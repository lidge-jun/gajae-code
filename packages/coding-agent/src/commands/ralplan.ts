import { APP_NAME } from "@gajae-code/utils";
import { Command } from "@gajae-code/utils/cli";
import { runNativeRalplanCommand } from "../jwc-runtime/ralplan-runtime";

export default class Ralplan extends Command {
	static description = `Run native ${APP_NAME.toUpperCase()} P-stage consensus planning workflow (ralplan engine)`;
	static strict = false;
	static examples = [
		`$ ${APP_NAME} ralplan "<task description>"`,
		`$ ${APP_NAME} ralplan --interactive --deliberate "<task description>"`,
		`$ ${APP_NAME} ralplan --write --stage planner --stage_n 1 --artifact "<markdown or path>"`,
	];

	async run(): Promise<void> {
		const result = await runNativeRalplanCommand(this.argv, process.cwd());
		if (result.stdout) process.stdout.write(result.stdout);
		if (result.stderr) process.stderr.write(result.stderr);
		process.exitCode = result.status;
	}
}
