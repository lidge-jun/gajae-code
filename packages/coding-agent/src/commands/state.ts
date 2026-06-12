import { APP_NAME } from "@gajae-code/utils";
import { Command } from "@gajae-code/utils/cli";
import { runNativeStateCommand } from "../gjc-runtime/state-runtime";

export default class State extends Command {
	static description = `Read or update ${APP_NAME.toUpperCase()} workflow state receipts under .gjc/state`;
	static strict = false;
	static examples = [
		'$ gjc state read --input \'{"mode":"jaw-interview"}\' --json',
		'$ gjc state write --input \'{"state":{"interview_id":"abc"}}\' --mode jaw-interview --json',
		"$ gjc state clear --mode jaw-interview",
		"$ gjc state jaw-interview read --json",
		'$ gjc state ralplan write --input \'{"phase":"planner","active":true}\' --json',
		"$ gjc state team contract",
		"$ gjc state jaw-interview handoff --to ralplan --json",
		"$ gjc state doctor --skill ralplan --json",
	];

	async run(): Promise<void> {
		const result = await runNativeStateCommand(this.argv);
		if (result.stdout) process.stdout.write(result.stdout);
		if (result.stderr) process.stderr.write(result.stderr);
		process.exitCode = result.status;
	}
}
