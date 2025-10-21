// deno-lint-ignore no-import-prefix
import { existsSync } from "jsr:@std/fs@1.0.19";
// deno-lint-ignore no-import-prefix
import { promptSelect } from "jsr:@std/cli@1.0.23/unstable-prompt-select";
import { getLatestVersion } from "./core/jsr.ts";

/**
 * Represents a Deno configuration file.
 */
interface DenoConfig {
	/**
	 * The tasks defined in the Deno configuration.
	 */
	tasks: {
		/**
		 * The sprocket task command.
		 */
		sprocket?: string;
	};
}

const cwd = Deno.cwd();
const denoConfigPath = `${cwd}/deno.json`;
const command = "deno run -A";
const scope = "kinsondigital";
const pkgName = "sprocket";

// Get the latest version of sprocket
const latestVersion = await getLatestVersion(scope, pkgName);
const newDefaultTaskValue = `${command} jsr:@${scope}/${pkgName}@${latestVersion} run-job ./dev-tools/sprocket-config.ts`;

// If the deno.json does not exist, create it.
if (!existsSync(denoConfigPath)) {
	const newConfigFile: DenoConfig = {
		tasks: {
			sprocket: `${command} jsr:@${scope}/${pkgName}@${latestVersion} run-job ./dev-tools/sprocket-config.ts`,
		},
	};

	updateTaskValue(newConfigFile, newDefaultTaskValue);

	console.log(`Sprocket has been installed with version 'v${latestVersion}'.`);
	Deno.exit();
}

const configFileContent = await Deno.readTextFile(denoConfigPath);
const denoConfig = JSON.parse(configFileContent) as DenoConfig;

// Create the tasks property if it doesn't exist
if (!denoConfig["tasks"]) {
	denoConfig["tasks"] = {};
}

const updateConfig = false;

// If the sprocket task exists
if (denoConfig["tasks"]["sprocket"]) {
	const sprocketPkgPathRegex = /deno run .+ jsr:@kinsondigital\/sprocket@[0-2]\.[0-2]\.[0-2] run-job .\/dev-tools\/sprocket-config.ts/gm;
	const sprocketPropValue = denoConfig.tasks.sprocket;
	const taskSections = sprocketPropValue.split(" ").map((section) => section.trim());

	if (sprocketPkgPathRegex.test(sprocketPropValue)) {
		const pgkRefIndex = taskSections.findIndex((section) => {
			const regex = /jsr:@kinsondigital\/sprocket@[0-2]\.[0-2]\.[0-2]/gm;

			return regex.test(section);
		});

		if (pgkRefIndex === -1) {
			console.error("An error occurred while parsing the sprocket package reference from the deno.json file.");
			Deno.exit(1);
		}

		const version = taskSections[pgkRefIndex].split("@").pop();

		if (version !== latestVersion) {
			const selectionResult = promptSelect(`Are you sure you want to update sprocket to 'v${latestVersion}':`, [
				"Yes",
				"No",
			], { clear: true });

			const selectedOption: "Yes" | "No" = selectionResult === "Yes" ? selectionResult : "No";

			if (selectedOption === "Yes") {
				taskSections[pgkRefIndex] = `jsr:@${scope}/${pkgName}@${latestVersion}`;

				updateTaskValue(denoConfig, taskSections.join(" "));
			}
		}
	} else {
		updateTaskValue(denoConfig, newDefaultTaskValue);
	}
} else {
	updateTaskValue(denoConfig, newDefaultTaskValue);
}

if (updateConfig) {
	denoConfig["tasks"]["sprocket"] = `${command} jsr:@${scope}/${pkgName}@${latestVersion} run-job ./dev-tools/sprocket-config.ts`;

	// Write the updated config back to the file
	Deno.writeTextFileSync(denoConfigPath, `${JSON.stringify(denoConfig, null, 4)}\n`);
} else {
	console.log(`The sprocket task is already using the latest version.`);
}

/**
 * Updates the sprocket task value in the Deno configuration file.
 * @param denoConfig The Deno configuration object.
 * @param taskValue The new task value for sprocket.
 */
function updateTaskValue(denoConfig: DenoConfig, taskValue: string): void {
	denoConfig["tasks"]["sprocket"] = taskValue;

	// Write the updated config back to the file
	Deno.writeTextFileSync(denoConfigPath, `${JSON.stringify(denoConfig, null, 4)}\n`);
}
