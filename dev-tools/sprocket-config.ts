import type { ScriptTask, SprocketConfig } from "jsr:@kinsondigital/sprocket@2.1.0/configuration";

const config: SprocketConfig = {
	jobs: [{
		name: "Prep-Prod-Release",
		description: "Prepares for production release.",
		preExecuteMsg: "Starting release preparation.",
		preExecuteMsgColor: "cyan",
		postExecuteMsg: "Release preparation complete.",
		postExecuteMsgColor: "cyan",
		tasks: [{
			type: "script",
			name: "Develop Branch Checked Out",
			description: "Prepares for a production release.",
			preExecuteMsg: "\t⏳Process running. . .",
			preExecuteMsgColor: "gray",
			script: { filePath: `${Deno.cwd()}/dev-tools/prep-prod-release.ts` },
		} as ScriptTask],
	}, {
		name: "Create-PR",
		description: "Creates a feature branch and pull request.",
		preExecuteMsg: "Starting Feature PR creation.",
		preExecuteMsgColor: "cyan",
		postExecuteMsg: "Feature branch and pull request created.",
		postExecuteMsgColor: "cyan",
		tasks: [{
			type: "script",
			name: "Create Feature Pull Request",
			description: "Creates a feature branch and pull request.",
			preExecuteMsg: "\t⏳Creating. . .",
			preExecuteMsgColor: "gray",
			script: { filePath: `${Deno.cwd()}/dev-tools/create-pr.ts` },
		} as ScriptTask],
	}],
};

export { config };
