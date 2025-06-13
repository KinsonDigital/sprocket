import { KDAdminConfig } from "../src/core/configuration.ts";
import { createCheckoutBranch, isCheckedOut, pushToRemote } from "../src/core/git.ts";

const config: KDAdminConfig = {
	jobs: [{
		name: "Prep Prev Release",
		description: "Prepares a preview release.",
		preExecuteMsg: "Starting release preparation!",
		preExecuteMsgColor: "cyan",
		postExecuteMsg: "Release preparation complete!",
		postExecuteMsgColor: "cyan",
		tasks: [{
			type: "function",
			name: "Develop Branch Checked Out",
			description: "Checks if the develop branch is currently checked out.",
			preExecuteMsg: "\t⏳Checking if the 'develop' branch is checked out...",
			preExecuteMsgColor: "gray",
			run: async () => {
				const checkedOut = await isCheckedOut("develop");

				if (!checkedOut) {
					console.log("%cYou must be on the develop branch to run this script.", "color:indianred");
					Deno.exit(1);
				}
			}
		},
		{
			type: "function",
			name: "Create, Check Out, Push Branch",
			description: "Creates a new 'release' branch, checks it out, and pushes it to remote.",
			preExecuteMsg: "\t⏳Creating and/or checking out 'release' branch...",
			preExecuteMsgColor: "gray",
			run: async () => {
				await createCheckoutBranch("release");
				await pushToRemote("release");
			}
		},
		{
			type: "function",
			name: "Push To Remote",
			description: "Pushes the changes to the remote repository.",
			preExecuteMsg: "\t⏳Pushing to remote...",
			preExecuteMsgColor: "gray",
			run: async () => {
				await pushToRemote("release");
			}
		}]
	}]
};

export { config };
