import { IssueTypeModel } from "./IssueTypeModel.ts";

/**
 * Gets the list of issue types.
 * @param orgName The name of the organization.
 * @param githubToken The GitHub token to use for authentication.
 * @returns The list of issue types.
 */
export async function getAllIssueTypes(orgName: string, githubToken: string): Promise<IssueTypeModel[]> {
	const url = `https://api.github.com/orgs/${orgName}/issue-types`;

	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Accept": "application/vnd.github+json",
			"Authorization": `Bearer ${githubToken}`,
			"X-GitHub-Api-Version": "2022-11-28",
		},
	});

	if (!response.ok) {
		console.error("Error fetching data:", response.statusText);
		Deno.exit(1);
	}

	const data: IssueTypeModel[] = await response.json();

	return data;
}
