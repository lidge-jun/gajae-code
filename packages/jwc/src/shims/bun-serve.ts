/**
 * `Bun.serve` Node adapter (100.07 / inventory J).
 *
 * Covers the fetch-handler HTTP shape used by the OAuth callback server and
 * the py tool-bridge: `serve({ hostname, port, fetch }) → { port, stop }`.
 * WebSocket upgrade (bridge-mode full e2e) is explicitly deferred — passing a
 * `websocket` option throws with a pointer to this plan.
 */
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { Readable } from "node:stream";

interface BunServeOptions {
	hostname?: string;
	port?: number;
	reusePort?: boolean;
	fetch: (request: Request) => Response | Promise<Response>;
	websocket?: unknown;
	error?: (error: Error) => Response | Promise<Response>;
}

function toRequest(req: IncomingMessage, hostname: string, port: number): Request {
	const url = `http://${hostname}:${port}${req.url ?? "/"}`;
	const headers = new Headers();
	for (const [key, value] of Object.entries(req.headers)) {
		if (typeof value === "string") headers.set(key, value);
		else if (Array.isArray(value)) for (const v of value) headers.append(key, v);
	}
	const method = req.method ?? "GET";
	const body = method === "GET" || method === "HEAD" ? undefined : (Readable.toWeb(req) as ReadableStream);
	return new Request(url, {
		method,
		headers,
		body,
		// @ts-expect-error: required by undici for streamed request bodies
		duplex: body ? "half" : undefined,
	});
}

async function writeResponse(res: ServerResponse, response: Response): Promise<void> {
	const headers: Record<string, string | string[]> = {};
	response.headers.forEach((value, key) => {
		headers[key] = value;
	});
	res.writeHead(response.status, headers);
	if (response.body) {
		for await (const chunk of response.body as unknown as AsyncIterable<Uint8Array>) {
			res.write(chunk);
		}
	}
	res.end();
}

export function bunServe(options: BunServeOptions) {
	if (options.websocket) {
		throw new Error("Bun.serve shim: websocket upgrade is deferred on Node (devlog 100.07 §결정 기준)");
	}
	const hostname = options.hostname ?? "0.0.0.0";
	const requestedPort = options.port ?? 0;

	const server = createServer((req, res) => {
		Promise.resolve()
			.then(() => options.fetch(toRequest(req, hostname, boundPort())))
			.catch(async error => {
				if (options.error) return options.error(error instanceof Error ? error : new Error(String(error)));
				return new Response("Internal Server Error", { status: 500 });
			})
			.then(response => writeResponse(res, response ?? new Response("", { status: 204 })))
			.catch(() => {
				res.statusCode = 500;
				res.end();
			});
	});

	server.listen(requestedPort, hostname);
	const boundPort = () => {
		const address = server.address();
		return typeof address === "object" && address ? address.port : requestedPort;
	};

	return {
		get port(): number {
			return boundPort();
		},
		get hostname(): string {
			return hostname;
		},
		get url(): URL {
			return new URL(`http://${hostname}:${boundPort()}/`);
		},
		stop(_closeActiveConnections?: boolean): void {
			server.close();
			server.closeAllConnections?.();
		},
		ref(): void {
			server.ref();
		},
		unref(): void {
			server.unref();
		},
	};
}
