import { Command, CommandTask, isCommandTask, Task } from "./src/core/configuration.ts";

const _workingDir = Deno.env.get("WORKING_DIR") ?? "";
const _ownerName = Deno.env.get("OWNER_NAME") ?? "";
const _repoName = Deno.env.get("REPO_NAME") ?? "";
const _token = Deno.env.get("GITHUB_TOKEN") ?? "";

const task: CommandTask = {
	description: "asdf",
	name: "asdf",
	type: "function",
	cmd: { cmd: "echo", args: ["hello"] },
};

if (isCommandTask(task)) {
	console.log("is command task");
} else {
	console.log("not command task");
}

debugger;
