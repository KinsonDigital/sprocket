import { Input } from "@cliffy/prompt";
import { createCheckoutBranch, getCurrentBranch, isCheckedOut, pushToRemote } from "@sprocket/git";
import { createPr, githubIssueExists } from "@sprocket/github";
import type { FunctionTask, SprocketConfig } from "@sprocket/configuration";

const config: SprocketConfig = {
	jobs: [{
		name: "Prep-Prod-Release",
		description: "Prepares a production release.",
		preExecuteMsg: "Starting release preparation!",
		preExecuteMsgColor: "cyan",
		postExecuteMsg: "Release preparation complete!",
		postExecuteMsgColor: "cyan",
		tasks: [{
			type: "function",
			name: "Prepare Production Release",
			description: "Prepares a production release.",
			preExecuteMsg: "\t⏳Preparing release...",
			preExecuteMsgColor: "gray",
			func: async () => {
				console.log("Creating branch...");
				console.log("Updating version...");
				console.log("Creating release notes...");
				console.log("Creating pull request...");
			},
		} as FunctionTask],
	}, {
		name: "Other-Job",
		description: "Prepares another job.",
		preExecuteMsg: "Starting job!",
		preExecuteMsgColor: "cyan",
		postExecuteMsg: "Other job complete!",
		postExecuteMsgColor: "cyan",
		tasks: [{
			type: "function",
			name: "Run Other Job",
			description: "Runs the job",
			preExecuteMsg: "\t⏳Running other job...",
			preExecuteMsgColor: "gray",
			func: async () => {
				console.log("Getting status...");
				console.log("Processing data...");
				console.log("Finishing process...");
				console.log("Process finished!");
			},
		} as FunctionTask],
	}],
};

export { config };
