export type TaskType = "cmd" | "script" | "function";

export interface Command {
	cmd: string;
	args?: string[];
}

export interface Script {
	filePath: string;
	args?: string[];
}

export type Func = (...args: any[]) => any;

export type Task =
	{
		type: "cmd";
		name: string;
		description: string;
		preExecuteMsg?: string;
		postExecuteMsg?: string;
		preExecuteMsgColor?: string;
		postExecuteMsgColor?: string;
		run: Command;
	} |
	{
		type: "script";
		name: string;
		description: string;
		preExecuteMsg?: string;
		postExecuteMsg?: string;
		preExecuteMsgColor?: string;
		postExecuteMsgColor?: string;
		run: Script;
	} |
	{
		type: "function";
		name: string;
		description: string;
		preExecuteMsg?: string;
		postExecuteMsg?: string;
		preExecuteMsgColor?: string;
		postExecuteMsgColor?: string;
		run: Func;
	};

export interface Job {
	name: string;
	description?: string;
	tasks: Task[];
	preExecuteMsg?: string;
	postExecuteMsg?: string;
	preExecuteMsgColor?: string;
	postExecuteMsgColor?: string;
	env?: Record<string, string>;
}

export interface KDAdminConfig {
	jobs: Job[];
}
