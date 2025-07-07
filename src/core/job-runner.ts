import { Command, Job, Script, Task } from "./configuration.ts";
import { Guards } from "./guards.ts";

export async function runJob(job: Job): Promise<void> {
	printPreExecuteJobMsg(job);

	processEnvVariables(job);

	for (let i = 0; i < job.tasks.length; i++) {
		const task = job.tasks[i];

		printPreExecuteTaskMsg(task);

		switch (task.type) {
			case "cmd":
				runCmd(task.run);
				break;
			case "function":
				await runFunction(task.run);
				break;
			case "script":
				await runScript(task.run);
				break;
			default:
				break;
		}

		printPostExecuteTaskMsg(task);
	}

	printPostExecuteJobMsg(job);
}

export async function runCmd(cmd: Command): Promise<void> {
	const denoCmd = new Deno.Command(cmd.cmd, { args: cmd.args });

	const child = denoCmd.spawn();
	const status = await child.status;

	if (!status.success) {
		const argsStr = cmd.args ? ` ${cmd.args.join(" ")}` : "";
		console.log(`%cAn error occurred running the ${cmd.cmd} ${argsStr}`, "color: indianred");
	}
}

export async function runFunction(func: Function): Promise<void> {
	try {
		await func();
	} catch (error) {
		console.error("Error running function:", error);
	}
}

export async function runScript(script: Script): Promise<void> {
	try {
		const filePath = script.filePath.startsWith("./")
			? `${Deno.cwd()}/${script.filePath.replace("./", "")}`
			: script.filePath;

		const scriptPath = import.meta.resolve(`file:///${filePath}`);

		// Execute the script
		await import(scriptPath);
	} catch (error) {
		console.error("Error running script:", error);
	}
}

export function processEnvVariables(job: Job): void {
	if (Guards.isNothing(job.env)) {
		return;
	}

	for (const [key, value] of Object.entries(job.env)) {
		const trimmedValue = value.trim();
		const isInterpolated = trimmedValue.startsWith("${") && trimmedValue.endsWith("}");
		const valueToUse = isInterpolated
			? Deno.env.get(trimmedValue.slice(2, -1)) || ""
			: trimmedValue;

		Deno.env.set(key, valueToUse);
	}
}

function printPreExecuteJobMsg(job: Job): void {
	if (!Guards.isNothing(job.preExecuteMsg)) {
		const clr = Guards.isNothing(job.preExecuteMsgColor) ? "" : `color:${job.preExecuteMsgColor}`;
		job.preExecuteMsg = Guards.isNothing(clr) ? job.preExecuteMsg : `%c${job.preExecuteMsg}`;
		console.log(job.preExecuteMsg, clr);
	}
}

function printPostExecuteJobMsg(job: Job): void {
	if (!Guards.isNothing(job.postExecuteMsg)) {
		const clr = Guards.isNothing(job.postExecuteMsgColor) ? "" : `color:${job.postExecuteMsgColor}`;
		job.postExecuteMsg = Guards.isNothing(clr) ? job.postExecuteMsg : `%c${job.postExecuteMsg}`;
		console.log(job.postExecuteMsg, clr);
	}
}

function printPreExecuteTaskMsg(task: Task): void {
	if (!Guards.isNothing(task.preExecuteMsg)) {
		const clr = Guards.isNothing(task.preExecuteMsgColor) ? "" : `color:${task.preExecuteMsgColor}`;
		task.preExecuteMsg = Guards.isNothing(clr) ? task.preExecuteMsg : `%c${task.preExecuteMsg}`;
		console.log(task.preExecuteMsg, clr);
	}
}

function printPostExecuteTaskMsg(task: Task): void {
	if (!Guards.isNothing(task.postExecuteMsg)) {
		const clr = Guards.isNothing(task.postExecuteMsgColor) ? "" : `color:${task.postExecuteMsgColor}`;
		task.postExecuteMsg = Guards.isNothing(clr) ? task.postExecuteMsg : `%c${task.postExecuteMsg}`;
		console.log(task.postExecuteMsg, clr);
	}
}
