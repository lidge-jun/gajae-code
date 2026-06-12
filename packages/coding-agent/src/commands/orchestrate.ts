import { APP_NAME } from "@gajae-code/utils";
import { Command, Flags } from "@gajae-code/utils/cli";
import { runNativeOrchestrateCommand } from "../gjc-runtime/orchestrate-runtime";

export default class Orchestrate extends Command {
	static description = `Run the native ${APP_NAME.toUpperCase()} IPABCD orchestration (i|p|a|b|c|d)`;
	static strict = false;
	static flags = {
		"session-id": Flags.string({
			description: "Route state through a session-scoped .gjc state directory",
		}),
		deliberate: Flags.boolean({ description: "Force deliberate mode (stage-a dual audit)" }),
		"audit-mode": Flags.string({ description: 'Stage-a audit mode: "solo" | "dual" (D050-21)' }),
		"spec-ref": Flags.string({ description: "Record the interview spec path (.gjc/specs/jaw-interview-<slug>.md)" }),
		"plan-ref": Flags.string({ description: "Record the devlog plan path produced in stage p" }),
		"worker-output": Flags.string({
			description: "With the verdict subcommand: parse PASS|FAIL|DONE|NEEDS_FIX from this file",
		}),
		"user-approved": Flags.boolean({ description: "Explicit user approval override for a gated transition" }),
		json: Flags.boolean({ description: "Output JSON" }),
	};
	static examples = [
		"$ jwc orchestrate i",
		"$ jwc orchestrate p --spec-ref .gjc/specs/jaw-interview-my-feature.md",
		"$ jwc orchestrate a --audit-mode dual",
		"$ jwc orchestrate verdict --worker-output ./audit-report.md",
		"$ jwc orchestrate b --user-approved",
		"$ jwc orchestrate status --json",
	];

	async run(): Promise<void> {
		const result = await runNativeOrchestrateCommand(this.argv, process.cwd());
		if (result.stdout) process.stdout.write(result.stdout);
		if (result.stderr) process.stderr.write(result.stderr);
		process.exitCode = result.status;
	}
}
