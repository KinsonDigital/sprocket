import { Input } from "@cliffy/prompt";
import { createCheckoutBranch, getCurrentBranch, isCheckedOut, pushToRemote } from "../src/core/git.ts";
import { createPr, githubIssueExists } from "../src/core/github.ts";
import type { FunctionTask, KDAdminConfig } from "../src/core/configuration.ts";

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
			func: async () => {
				const checkedOut = await isCheckedOut("develop");

				if (!checkedOut) {
					console.log("%cYou must be on the develop branch to run this script.", "color:indianred");
					Deno.exit(1);
				}
			},
		} as FunctionTask,
		{
			type: "function",
			name: "Create, Check Out, Push Branch",
			description: "Creates a new 'release' branch, checks it out, and pushes it to remote.",
			preExecuteMsg: "\t⏳Creating and/or checking out 'release' branch...",
			preExecuteMsgColor: "gray",
			func: async () => {
				await createCheckoutBranch("release");
				await pushToRemote("release");
			}
		} as FunctionTask,
		{
			type: "function",
			name: "Push To Remote",
			description: "Pushes the changes to the remote repository.",
			preExecuteMsg: "\t⏳Pushing to remote...",
			preExecuteMsgColor: "gray",
			func: async () => {
				await pushToRemote("release");
			}
		} as FunctionTask]
	},
	{
		name: "Create Feature Branch",
		description: "Creates a new feature branch from the develop branch with a pull request.",
		preExecuteMsg: "Creating a new feature branch!",
		preExecuteMsgColor: "cyan",
		postExecuteMsg: "Feature branch created successfully!",
		postExecuteMsgColor: "cyan",
		env: {
			"OWNER_NAME": "${OWNER_NAME}",
			"REPO_NAME": "${REPO_NAME}",
			"GITHUB_TOKEN": "${GITHUB_TOKEN}"
		},
		tasks: [{
			type: "function",
			name: "Create Feature Branch",
			description: "Creates a new feature branch from the develop branch.",
			preExecuteMsg: "\t⏳Creating feature branch...",
			preExecuteMsgColor: "gray",
			func: async () => {
				const chosenIssueNumber = await Input.prompt({
					message: "Enter the issue number for the feature branch:",
					validate: async (value) => {
						if (!/^\d+$/.test(value)) {
							return "Please enter a valid whole number.";
						}

						const ownerName = (Deno.env.get("OWNER_NAME") || "").trim();
						const repoName = (Deno.env.get("REPO_NAME") || "").trim();
						const githubToken = (Deno.env.get("GITHUB_TOKEN") || "").trim();

						const issueNumberExists = await githubIssueExists(ownerName, repoName, parseInt(value), githubToken);

						if (!issueNumberExists) {
							return `Issue #${value} does not exist in the repository.`;
						}

						return true;
					},
				});

				const chosenBranchName = await Input.prompt({
					message: "Enter the name of the new feature branch:",
					validate: (value) => {
						const branchRegex = /^[a-zA-Z\s\-_]+$/;

						if (!branchRegex.test(value)) {
							return "Branch name must be a valid string containing only letters, spaces, hyphens, or underscores.";
						}

						return true;
					},
					transform: (value) => value.trim().replaceAll(" ", "-").replaceAll("_", "-").toLowerCase(),
				});

				const headBranchName = `feature/${chosenIssueNumber}-${chosenBranchName}`;

				await createCheckoutBranch(headBranchName);
				await pushToRemote(headBranchName);

				const ownerName = (Deno.env.get("OWNER_NAME") || "").trim();
				const repoName = (Deno.env.get("REPO_NAME") || "").trim();
				const githubToken = (Deno.env.get("GITHUB_TOKEN") || "").trim();
				const baseBranch = await getCurrentBranch();

				await createPr(ownerName, repoName, "auto-set", "auto-set", headBranchName, baseBranch, githubToken);
			}
		} as FunctionTask]
	}]
};

export { config };
