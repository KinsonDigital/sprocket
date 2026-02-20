// deno-lint-ignore no-import-prefix
import { existsSync } from "jsr:@std/fs@1.0.19";
import { getLatestVersion } from "./core/jsr.ts";
import { isDenoConfig, isStandardTask, isTaskDefinition } from "./core/validation.ts";
import type { DenoConfig } from "./core/deno.ts";
import detectIndent from "detect-indent";
import { isNothing } from "../src/core/guards.ts";

const cwd = Deno.cwd();
const denoConfigPath = `${cwd}/deno.json`;
const command = "deno run -A";
const scope = "kinsondigital";
const pkgName = "sprocket";

// Get the latest version of sprocket
const latestVersion = await getLatestVersion(scope, pkgName);

// If the deno.json does not exist, create it.
if (!existsSync(denoConfigPath)) {
	const newDefaultTaskValue = `${command} jsr:@${scope}/${pkgName}@${latestVersion} run-job ./dev-tools/sprocket-config.ts`;
	const newConfigFile: DenoConfig = {
		tasks: {
			"run-sprocket-job": newDefaultTaskValue,
		},
	};

	Deno.writeTextFileSync(denoConfigPath, JSON.stringify(newConfigFile, null, 4));
	console.log(`Sprocket has been installed with version 'v${latestVersion}'.`);
	Deno.exit();
}

const configFileContent = await Deno.readTextFile(denoConfigPath);
const indent = detectIndent(configFileContent).indent;

let denoConfig: unknown;

try {
	denoConfig = JSON.parse(configFileContent);
} catch (error) {
	const errorMsg = error instanceof Error ? error.message : String(error);
	console.error(`An error occurred while parsing the deno.json file: ${errorMsg}`);
	Deno.exit(1);
}

if (isDenoConfig(denoConfig)) {
	// Create the tasks property if it doesn't exist
	if (denoConfig.tasks === undefined) {
		denoConfig["tasks"] = {
			"run-sprocket-job": `${command} jsr:@${scope}/${pkgName}@${latestVersion} run-job ./dev-tools/sprocket-config.ts`,
		};

		const updatedConfigContent = JSON.stringify(denoConfig, null, isNothing(indent) ? 4 : indent);
		Deno.writeTextFileSync(denoConfigPath, updatedConfigContent);
		Deno.exit();
	}

	const taskNames = Object.getOwnPropertyNames(denoConfig.tasks);

	for (let i = 0; i < taskNames.length; i++) {
		const taskName = taskNames[i];

		if (isStandardTask(denoConfig.tasks[taskName])) {
			denoConfig.tasks[taskName] = updateSprocketVersion(denoConfig.tasks[taskName] as string, latestVersion);
		} else if (isTaskDefinition(denoConfig.tasks[taskName])) {
			denoConfig.tasks[taskName].command = updateSprocketVersion(denoConfig.tasks[taskName].command, latestVersion);
		} else {
			console.error(
				`The task '${taskName}' in the deno.json file is not valid. Please ensure all tasks are either a string or an object with 'description' and 'command' properties.`,
			);
			Deno.exit(1);
		}
	}

	const updatedConfigContent = JSON.stringify(denoConfig, null, isNothing(indent) ? 4 : indent);
	Deno.writeTextFileSync(denoConfigPath, updatedConfigContent);

	console.log(`Sprocket has been installed with version 'v${latestVersion}'.`);
} else {
	console.error(`The existing deno.json file is not valid. Please ensure it conforms to the expected schema.`);
	Deno.exit(1);
}

/**
 * Updates the version of the Sprocket package in a given task value.
 * @param taskValue The task value containing the Sprocket package reference.
 * @param newVersion The new version to update the Sprocket package to.
 * @returns The updated task value with the new Sprocket version.
 * @remarks If no sprocket package reference is found in the task value, the original task value is returned unchanged.
 */
function updateSprocketVersion(taskValue: string, newVersion: string): string {
	const sprocketPkgPathRegex = /jsr:@kinsondigital\/sprocket@[0-9]+\.[0-9]+\.[0-9]+/;

	// Pull the sprocket package reference from the task value
	const pkgRefMatch = Array.from(taskValue.match(sprocketPkgPathRegex) || []);

	if (pkgRefMatch.length === 0) {
		return taskValue;
	}

	const pkgRef = pkgRefMatch[0];
	const versionRegex = /[0-9]+\.[0-9]+\.[0-9]+/;

	const pkgRefSections = pkgRef.split("@");

	const versionSectionIndex = pkgRefSections.findIndex((section) => versionRegex.test(section));

	if (versionSectionIndex === -1) {
		throw new Error("An error occurred while parsing the sprocket package reference from the deno.json file.");
	}

	pkgRefSections[versionSectionIndex] = newVersion;

	const updatedPkgRef = pkgRefSections.join("@");

	return taskValue.replace(pkgRef, updatedPkgRef);
}
