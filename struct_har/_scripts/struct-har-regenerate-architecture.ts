/**
 * Refresh struct_har architecture markdown to point at structure SoT.
 * Run: bun struct_har/_scripts/struct-har-regenerate-architecture.ts
 */
import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");
const STRUCT = path.join(ROOT, "struct_har");
const STRUCTURE = path.join(ROOT, "structure");

const MAP: Record<string, string> = {
	"architecture.md": "architecture.md",
	"packages.md": "packages_overview.md",
	"prompt_flow.md": "prompt_flow.md",
	"session_storage.md": "session_storage.md",
	"extensibility.md": "extensibility.md",
	"conventions.md": "conventions.md",
	"workflows.md": "workflows.md",
};

const FORK_HEAD = "81bcea96";
const GJC_HEAD = "67427c6";

for (const side of ["gjc_origin", "jwc_patched"] as const) {
	const archDir = path.join(STRUCT, side, "architecture");
	fs.mkdirSync(archDir, { recursive: true });
	for (const [harName, structName] of Object.entries(MAP)) {
		const structPath = path.join(STRUCTURE, structName);
		const excerpt = fs.existsSync(structPath)
			? fs.readFileSync(structPath, "utf8").split("\n").slice(0, 12).join("\n")
			: "(structure file missing)";
		const content = `# architecture / ${harName} (${side})

> **스냅샷 (2026-06-13)**: patched SoT는 [\`structure/${structName}\`](../../../structure/${structName}).  
> fork \`${FORK_HEAD}\` · gjc clone \`${GJC_HEAD}\`.

## structure/ 발췌 (첫 12줄)

\`\`\`markdown
${excerpt}
\`\`\`

## 대조 메모

| side | 역할 |
|---|---|
| gjc_origin | upstream 클론 시점의 structure 동형 요약 (과거 har_struct) |
| jwc_patched | **structure/** 가 항상 최신 정본 — 본 파일은 인덱스·리베이스 전 훑기용 |

## 부록

- 전수 갱신: \`bun struct_har/_scripts/struct-har-regenerate-architecture.ts\`
`;
		fs.writeFileSync(path.join(archDir, harName), `${content}\n`, "utf8");
	}
}

console.log("struct_har: architecture/*.md refreshed (both sides)");