import { isCommandTask, isFunctionTask, isScriptTask } from "@kinsondigital/sprocket/configuration";
import type { Command, Job, Script, Task } from "@kinsondigital/sprocket/configuration";
import { isNothing } from "./guards.ts";

/**
 * Runs the given {@link job}.
 * @param job The job to run.
 */
export async function runJob(job: Job): Promise<void> {
	printPreExecuteJobMsg(job);

	processEnvVariables(job);

	for (let i = 0; i < job.tasks.length; i++) {
		const task = job.tasks[i];

		printPreExecuteTaskMsg(task);

		if (isCommandTask(task)) {
			await runCmd(task.command);
		} else if (isFunctionTask(task)) {
			await runFunction(task.func);
		} else if (isScriptTask(task)) {
			await runScript(task.script);
		} else {
			console.error("Unknown task type:", task);
		}

		printPostExecuteTaskMsg(task);
	}

	printPostExecuteJobMsg(job);
}

/**
 * Runs the given {@link cmd}.
 * @param cmd The command to run.
 */
export async function runCmd(cmd: Command): Promise<void> {
	const denoCmd = new Deno.Command(cmd.app, { args: cmd.args });

	const child = denoCmd.spawn();
	const status = await child.status;

	if (!status.success) {
		const argsStr = cmd.args ? ` ${cmd.args.join(" ")}` : "";
		console.log(`%cAn error occurred running the ${cmd.app} ${argsStr}`, "color: indianred");
	}
}

/**
 * Runs the given {@link func}.
 * @param func The function to run.
 */
export async function runFunction(func: () => Promise<void>): Promise<void> {
	try {
		await func();
	} catch (error) {
		console.error("Error running function:", error);
	}
}

/**
 * Runs the given {@link script}.
 * @param script The script to run.
 */
export async function runScript(script: Script): Promise<void> {
	try {
		const absolutePath = script.filePath.startsWith("./")
			? `${Deno.cwd()}/${script.filePath.replace("./", "")}`
			: script.filePath;

		const scriptURL = new URL(`file://${absolutePath}`).href;

		await import(scriptURL);
	} catch (error) {
		console.error("Error running script:", error);
	}
}

/**
 * Processes environment variables for the given {@link job}.
 * @param job The job to process environment variables for.
 * @returns
 */
function processEnvVariables(job: Job): void {
	if (isNothing(job.env)) {
		return;
	}

	for (const [key, value] of Object.entries(job.env)) {
		const trimmedValue = value.trim();
		const isInterpolated = trimmedValue.startsWith("${") && trimmedValue.endsWith("}");
		const valueToUse = isInterpolated ? Deno.env.get(trimmedValue.slice(2, -1)) || "" : trimmedValue;

		Deno.env.set(key, valueToUse);
	}
}

/**
 * Prints a pre-execute message for the given {@link job}.
 * @param job The job to print the pre-execute message for.
 */
function printPreExecuteJobMsg(job: Job): void {
	if (!isNothing(job.preExecuteMsg)) {
		const clr = isNothing(job.preExecuteMsgColor) ? "" : `color:${job.preExecuteMsgColor}`;
		job.preExecuteMsg = isNothing(clr) ? job.preExecuteMsg : `%c${job.preExecuteMsg}`;
		console.log(job.preExecuteMsg, clr);
	}
}

/**
 * Prints a post-execute message for the given {@link job}.
 * @param job The job to print the post-execute message for.
 */
function printPostExecuteJobMsg(job: Job): void {
	if (!isNothing(job.postExecuteMsg)) {
		const clr = isNothing(job.postExecuteMsgColor) ? "" : `color:${job.postExecuteMsgColor}`;
		job.postExecuteMsg = isNothing(clr) ? job.postExecuteMsg : `%c${job.postExecuteMsg}`;
		console.log(job.postExecuteMsg, clr);
	}
}

/**
 * Prints a pre-execute message for the given {@link task}.
 * @param task The task to print the pre-execute message for.
 */
function printPreExecuteTaskMsg(task: Task): void {
	if (!isNothing(task.preExecuteMsg)) {
		const clr = isNothing(task.preExecuteMsgColor) ? "" : `color:${task.preExecuteMsgColor}`;
		task.preExecuteMsg = isNothing(clr) ? task.preExecuteMsg : `%c${task.preExecuteMsg}`;
		console.log(task.preExecuteMsg, clr);
	}
}

/**
 * Prints a post-execute message for the given {@link task}.
 * @param task The task to print the post-execute message for.
 */
function printPostExecuteTaskMsg(task: Task): void {
	if (!isNothing(task.postExecuteMsg)) {
		const clr = isNothing(task.postExecuteMsgColor) ? "" : `color:${task.postExecuteMsgColor}`;
		task.postExecuteMsg = isNothing(clr) ? task.postExecuteMsg : `%c${task.postExecuteMsg}`;
		console.log(task.postExecuteMsg, clr);
	}
}
