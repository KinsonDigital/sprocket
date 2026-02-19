import { getEnvVar } from "./validators.ts";

const scriptName = `\n\tScript Name : ${import.meta.url.split("/").pop()}`;

const ownerName = getEnvVar("OWNER_NAME", scriptName);
const repoName = getEnvVar("REPO_NAME", scriptName);
const token = getEnvVar("CICD_TOKEN", scriptName);

try {
	const url = `https://api.github.com/repos/${ownerName}/${repoName}/milestones`;

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Accept": "application/vnd.github.v3+json",
			"X-GitHub-Api-Version": "2022-11-28",
			"Authorization": `Bearer ${token}`,
		},
		body: JSON.stringify({
			title: "vnext",
		}),
	});

	if (response.status !== 201) {
		const responseBody = await response.text();
		const otherInfo = `Error: ${response.status} ${response.statusText}\nResponse: ${responseBody}\n${scriptName}`;

		const errorMsg = `::error::Failed to create the 'vnext' milestone.\n${otherInfo}`;
		console.log(errorMsg);
		Deno.exit(1);
	}

	console.log("::notice::The 'vnext' milestone has been created successfully.");
} catch (error) {
	const errorMsg = error instanceof Error
		? `::error::Network error occurred while trying to create the 'vnext' milestone. Error: ${error.message}${scriptName}`
		: "::error::An unexpected error occurred while trying to create the 'vnext' milestone." + scriptName;
	console.log(errorMsg);

	Deno.exit(1);
}
