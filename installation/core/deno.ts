/**
 * Represents a standard deno task, which is either a command string or `undefined`.
 */
export type Task = string | undefined;

/**
 * Represents a structured deno task definition with a description, command, and optional dependencies.
 */
export type TaskDefinition = {
	/**
	 * A human-readable description of what the task does.
	 */
	description: string;

	/**
	 * The command to execute when the task is run.
	 */
	command: string;

	/**
	 * An optional list of task names that must run before this task.
	 */
	dependencies?: string[];
};

/**
 * A record of task names mapped to either a command string, a {@link Task}, or a {@link TaskDefinition}.
 */
export type Tasks = {
	[key: string]: string | Task | TaskDefinition;
};

/**
 * Represents a deno configuration object, optionally containing a set of {@link Tasks}.
 */
export type DenoConfig = {
	/**
	 * The optional collection of tasks defined in the configuration.
	 */
	tasks?: Tasks;
};
