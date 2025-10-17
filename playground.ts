import { FunctionTask } from "./src/core/configuration.ts";
import { isNothing } from "./src/core/guards.ts";

const _workingDir = Deno.env.get("WORKING_DIR") ?? "";
const _ownerName = Deno.env.get("OWNER_NAME") ?? "";
const _repoName = Deno.env.get("REPO_NAME") ?? "";
const _token = Deno.env.get("GITHUB_TOKEN") ?? "";

const funcTask: FunctionTask = {
	name: "Sample Function Task",
	description: "A sample function task that logs environment variables.",
	type: "function",
	func: async () => {
		console.log("Working Directory:", _workingDir);
		console.log("Owner Name:", _ownerName);
		console.log("Repository Name:", _repoName);
		console.log("GitHub Token:", _token ? "******" : "Not Provided");
	}
};


function stuff(task: FunctionTask) {
	if (isNothing(task)) {
	
	}

}

debugger;
