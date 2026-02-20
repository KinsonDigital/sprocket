import { OrgClient, RepoClient } from "@kdclients";
import { isNothing } from "../../src/core/guards.ts";

/**
 * Get the value of an environment variable after checking if it exists.
 * @param name The name of the environment variable.
 * @remarks This function will throw an error if the environment variable does not exist.
 */
const getEnvVar = (name: string, scriptFileName?: string, throwErrorIfMissing: boolean = true): string => {
	const value = (Deno.env.get(name) ?? "").trim();

	if (isNothing(value) && throwErrorIfMissing) {
		const fileName = isNothing(scriptFileName) ? "" : `\n\t${scriptFileName}`;
		const errorMsg = `The '${name}' environment variable does not exist.${fileName}`;
		console.log(`::error::${errorMsg}`);
		Deno.exit(1);
	}

	return value;
};

/**
 * Validates that a GitHub organization exists.
 * @param scriptFileName The name of the script file.
 * @remarks The owner and token are retrieved from the environment variables 'OWNER_NAME' and 'EA_CICD_TOKEN'.
 */
const validateOrgExists = async (scriptFileName?: string): Promise<void> => {
	const ownerName = getEnvVar("OWNER_NAME", scriptFileName);
	const token = getEnvVar("EA_CICD_TOKEN", scriptFileName);

	const orgClient = new OrgClient(ownerName, token);

	// If the org does not exist
	if (!(await orgClient.exists())) {
		const errorMsg = `The organization '${ownerName}' does not exist.` +
			(isNothing(scriptFileName) ? "" : `\n\t${scriptFileName}`);

		console.log(`::error::${errorMsg}`);
		Deno.exit(1);
	}
};

/**
 * Validates that a GitHub repository exists.
 * @param scriptFileName The name of the script file.
 * @remarks The owner and token are retrieved from the environment variables 'OWNER_NAME' 'REPO_NAME', and 'EA_CICD_TOKEN'.
 */
const validateRepoExists = async (scriptFileName?: string): Promise<void> => {
	const ownerName = getEnvVar("OWNER_NAME", scriptFileName);
	const repoName = getEnvVar("REPO_NAME", scriptFileName);
	const token = getEnvVar("EA_CICD_TOKEN", scriptFileName);

	const repoClient = new RepoClient(ownerName, repoName, token);

	if (!(await repoClient.exists())) {
		const errorMsg = `The repository '${repoName}' does not exist.` +
			(isNothing(scriptFileName) ? "" : `\n\t${scriptFileName}`);

		console.log(`::error::${errorMsg}`);
		Deno.exit(1);
	}
};

export { getEnvVar, validateOrgExists, validateRepoExists };
