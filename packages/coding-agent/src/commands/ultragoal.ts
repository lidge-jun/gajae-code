import { APP_NAME } from "@gajae-code/utils";
import { Command } from "@gajae-code/utils/cli";
import {
	GJC_SESSION_FILE_ENV,
	GJC_SESSION_ID_ENV,
	isUltragoalCreateGoalsInvocation,
	readUltragoalJwcObjective,
	writeCurrentSessionGoalModeState,
	writePendingGoalModeRequest,
} from "../jwc-runtime/goal-mode-request";
import { runNativeUltragoalCommand } from "../jwc-runtime/ultragoal-runtime";

export default class Ultragoal extends Command {
	static description = `Run native ${APP_NAME.toUpperCase()} goal-ledger (ultragoal) workflow commands`;
	static strict = false;
	static examples = [`$ ${APP_NAME} ultragoal status --json`];
	static delegateHelp = true;

	async run(): Promise<void> {
		const shouldActivateGoalMode = isUltragoalCreateGoalsInvocation(this.argv);
		const result = await runNativeUltragoalCommand(this.argv);
		if (result.stdout) process.stdout.write(result.stdout);
		if (result.stderr) process.stderr.write(result.stderr);
		process.exitCode = result.status;
		if (result.status !== 0 || !shouldActivateGoalMode) return;

		const cwd = process.cwd();
		const { objective, goalsPath } = await readUltragoalJwcObjective(cwd);
		await writeCurrentSessionGoalModeState({
			sessionFile: process.env[GJC_SESSION_FILE_ENV],
			objective,
		});
		await writePendingGoalModeRequest({
			cwd,
			objective,
			goalsPath,
			sessionId: process.env[GJC_SESSION_ID_ENV],
		});
	}
}
