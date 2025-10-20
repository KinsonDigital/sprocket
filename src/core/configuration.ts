/**
 * Configuration types for setting up jobs and tasks.
 * @module
 */

import * as zod from "@zod";

/**
 * Defines the different types of tasks that can be executed.
 * - "cmd": Execute a command line program or executable
 * - "script": Execute a TypeScript file
 * - "function": Execute a TypeScript/JavaScript function
 */
export type TaskType = "cmd" | "script" | "function";

/**
 * Configuration for executing a command line program or executable.
 */
export interface Command {
	/**
	 * The command or executable to run (e.g., "git", "npm", "deno")
	 */
	app: string;

	/**
	 * Optional arguments to pass to the command
	 */
	args?: string[];
}

/**
 * Function type for executing command-based tasks.
 * @param cmd The command configuration to execute
 * @returns A promise that resolves when the command completes
 */
export type RunCommand = (cmd: Command) => Promise<void>;

/**
 * Function type for executing script-based tasks.
 * @param script The script configuration to execute
 * @returns A promise that resolves when the script completes
 */
export type RunScript = (script: Script) => Promise<void>;

/**
 * Function type for executing function-based tasks.
 * @param func The function to execute
 * @returns A promise that resolves when the function completes
 */
export type RunFunction = (func: (...args: unknown[]) => Promise<void>) => Promise<void>;

/**
 * Configuration for executing a script file.
 */
export interface Script {
	/**
	 * Path to the script file to execute
	 */
	filePath: string;

	/**
	 * Optional arguments to pass to the script
	 */
	args?: string[];
}

/**
 * Messaging options that can be applied to tasks before and after execution.
 */
export type TaskMessaging = {
	/**
	 * Optional message to display before executing the task
	 */
	preExecuteMsg?: string;

	/**
	 * Optional message to display after executing the task
	 */
	postExecuteMsg?: string;
};

/**
 * Messaging color options that can be applied to tasks before and after execution.
 */
export type TaskMessagingColor = {
	/**
	 * Optional color for the pre-execute message (e.g., "red", "green", "blue")
	 */
	preExecuteMsgColor?: string;

	/**
	 * Optional color for the post-execute message (e.g., "red", "green", "blue")
	 */
	postExecuteMsgColor?: string;
};

/**
 * Base properties shared by all task types.
 */
export type TaskBase = TaskMessaging & TaskMessagingColor & {
	/**
	 * The type of task.
	 */
	type: TaskType;

	/**
	 * Unique name for the task.
	 */
	name: string;

	/**
	 * Human-readable description of what the task does.
	 */
	description: string;
};

/**
 * Configuration for executing a command line based task.
 */
export type CommandTask = TaskBase & {
	/**
	 * Command configuration for execution
	 */
	command: Command;
};

/**
 * Configuration for executing a script based task.
 */
export type ScriptTask = TaskBase & {
	/**
	 * Script configuration for execution
	 */
	script: Script;
};

/**
 * Configuration for executing a function based task.
 */
export type FunctionTask = TaskBase & {
	/**
	 * Function to execute - should return a Promise that resolves when complete
	 */
	func: () => Promise<void>;
};

/**
 * Represents a single task that can be executed as part of a job.
 * Tasks can be commands, scripts, or functions, each with their own configuration.
 */
export type Task = CommandTask | ScriptTask | FunctionTask;

/**
 * Represents a collection of tasks that are executed together as a unit.
 * Jobs provide a way to group related tasks and configure their execution environment.
 */
export interface Job {
	/**
	 * Unique name for the job
	 */
	name: string;

	/**
	 * Optional human-readable description of what the job accomplishes
	 */
	description?: string;

	/**
	 * Array of tasks to execute in sequence
	 */
	tasks: Task[];

	/**
	 * Optional message to display before executing the job
	 */
	preExecuteMsg?: string;

	/**
	 * Optional message to display after executing the job
	 */
	postExecuteMsg?: string;

	/**
	 * Optional color for the pre-execute message (e.g., "red", "green", "blue")
	 */
	preExecuteMsgColor?: string;

	/**
	 * Optional color for the post-execute message (e.g., "red", "green", "blue")
	 */
	postExecuteMsgColor?: string;

	/**
	 * Optional environment variables to set for all tasks in this job
	 */
	env?: Record<string, string>;
}

/**
 * Main configuration interface for the sprocket tool.
 * This defines the complete structure for configuring jobs and their associated tasks.
 */
export interface SprocketConfig {
	/**
	 * Array of jobs that can be executed by the sprocket tool
	 */
	jobs: Job[];
}

/**
 * Type guard to check if a configuration object is a {@link SprocketConfig}.
 * @param config The configuration object to check.
 * @returns True if the configuration object is a {@link SprocketConfig}, false otherwise.
 */
export function isSprocketConfig(config: unknown): config is SprocketConfig {
	const schema = zod.looseObject({
		jobs: zod.array(zod.object({
			name: zod.string(),
			tasks: zod.array(zod.any()),
		})),
	});

	return schema.safeParse(config).success;
}

/**
 * Type guard to check if a task is a {@link CommandTask}.
 * @param task The task to check.
 * @returns True if the task is a {@link CommandTask}, false otherwise.
 */
export function isCommandTask(task: unknown): task is CommandTask {
	const schema = zod.looseObject({
		type: zod.enum(["cmd", "script", "function"]),
		name: zod.string(),
		description: zod.string(),
		command: zod.object({
			app: zod.string(),
			args: zod.optional(zod.array(zod.string())),
		}),
		preExecuteMsg: zod.optional(zod.string()),
		postExecuteMsg: zod.optional(zod.string()),
		preExecuteMsgColor: zod.optional(zod.string()),
		postExecuteMsgColor: zod.optional(zod.string()),
	});

	return schema.safeParse(task).success;
}

/**
 * Type guard to check if a task is a {@link ScriptTask}.
 * @param task The task to check.
 * @returns True if the task is a {@link ScriptTask}, false otherwise.
 */
export function isScriptTask(task: unknown): task is ScriptTask {
	const schema = zod.looseObject({
		type: zod.enum(["cmd", "script", "function"]),
		name: zod.string(),
		description: zod.string(),
		script: zod.object({
			filePath: zod.string(),
			args: zod.optional(zod.array(zod.string())),
		}),
		preExecuteMsg: zod.optional(zod.string()),
		postExecuteMsg: zod.optional(zod.string()),
		preExecuteMsgColor: zod.optional(zod.string()),
		postExecuteMsgColor: zod.optional(zod.string()),
	});

	return schema.safeParse(task).success;
}

/**
 * Type guard to check if a task is a {@link FunctionTask}.
 * @param task The task to check.
 * @returns True if the task is a {@link FunctionTask}, false otherwise.
 */
export function isFunctionTask(task: unknown): task is FunctionTask {
	const schema = zod.looseObject({
		type: zod.enum(["cmd", "script", "function"]),
		name: zod.string(),
		description: zod.string(),
		func: zod.function(),
		preExecuteMsg: zod.optional(zod.string()),
		postExecuteMsg: zod.optional(zod.string()),
		preExecuteMsgColor: zod.optional(zod.string()),
		postExecuteMsgColor: zod.optional(zod.string()),
	});

	return schema.safeParse(task).success;
}
