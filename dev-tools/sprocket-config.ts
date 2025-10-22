import type { ScriptTask, SprocketConfig } from "@sprocket/configuration";

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
	}],
};

export { config };
