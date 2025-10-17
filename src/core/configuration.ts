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
 * A type representing a function that runs a command.
 */
export type RunCommand = (cmd: Command) => Promise<void>;

/***
 * A type representing a function that runs a script.
 */
export type RunScript = (script: Script) => Promise<void>;

/**
 * A type representing a function that runs a function.
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

export function isCommandTask(task: unknown): task is CommandTask {
	return typeof task === "object" && task !== null && "run" in task &&
		"type" in task && typeof task.type === "string" && task.type === "cmd";
}

export function isScriptTask(task: unknown): task is ScriptTask {
	return typeof task === "object" && task !== null && "run" in task &&
		"type" in task && typeof task.type === "string" && task.type === "script";
}

export function isFunctionTask(task: unknown): task is FunctionTask {
	return typeof task === "object" && task !== null && "run" in task &&
		"type" in task && typeof task.type === "string" && task.type === "function";
}

export function isTaskTypeProp(value: unknown): value is TaskType {
	return typeof value === "string" && (value === "cmd" || value === "script" || value === "function");
}
