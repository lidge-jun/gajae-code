import { APP_NAME } from "@gajae-code/utils";
import { Command } from "@gajae-code/utils/cli";
import { runNativeStateCommand } from "../jwc-runtime/state-runtime";

export default class State extends Command {
	static description = `Read or update ${APP_NAME.toUpperCase()} workflow state receipts under .jwc/state`;
	static strict = false;
	static examples = [
		`$ ${APP_NAME} state read --input '{"mode":"jaw-interview"}' --json`,
		`$ ${APP_NAME} state write --input '{"state":{"interview_id":"abc"}}' --mode jaw-interview --json`,
		`$ ${APP_NAME} state clear --mode jaw-interview`,
		`$ ${APP_NAME} state jaw-interview read --json`,
		`$ ${APP_NAME} state ralplan write --input '{"phase":"planner","active":true}' --json`,
		`$ ${APP_NAME} state team contract`,
		`$ ${APP_NAME} state jaw-interview handoff --to ralplan --json`,
		`$ ${APP_NAME} state doctor --skill ralplan --json`,
	];

	async run(): Promise<void> {
		const result = await runNativeStateCommand(this.argv);
		if (result.stdout) process.stdout.write(result.stdout);
		if (result.stderr) process.stderr.write(result.stderr);
		process.exitCode = result.status;
	}
}
