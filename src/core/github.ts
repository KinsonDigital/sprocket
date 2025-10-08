import { PullRequestModel } from "@kdclients/github/models";
import { IssueTypeModel } from "./IssueTypeModel.ts";


interface GitHubError {
	resource: string,
	code: string,
	message: string,
}

interface ErrorData {
	message: string,
    errors: GitHubError[],
    documentation_url: string
}

/**
 * Checks if a GitHub issue exists.
 * @param owner The repository owner.
 * @param repo The repository name.
 * @param issueNumber The issue number.
 * @param githubToken The GitHub token to use for authentication.
 * @returns True if the issue exists, false otherwise.
 */
export async function githubIssueExists(owner: string, repo: string, issueNumber: number, githubToken: string): Promise<boolean> {
	const baseUrl = "https://api.github.com/repos";
	const url = `${baseUrl}/${owner}/${repo}/issues/${issueNumber}`;

	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Accept": "application/vnd.github+json",
			"Authorization": `Bearer ${githubToken}`,
			"X-GitHub-Api-Version": "2022-11-28",
		},
	});

	if (response.status === 200) {
		return true;
	} else {
		console.log(`%c${response.status} - ${response.statusText}`, "color:indianred");
		return false;
	}
}

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

export async function createPr(
	ownerName: string,
	repoName: string,
	title: string,
	description: string,
	headBranch: string,
	baseBranch: string,
	token: string
): Promise<number> {
	const baseUrl = "https://api.github.com";
	const url = `${baseUrl}/repos/${ownerName}/${repoName}/pulls`;
	const body = {
		title: title,
		head: headBranch,
		base: baseBranch,
		body: description,
		maintainer_can_modify: true,
		draft: true,
	};

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Accept": "application/vnd.github+json",
			"Authorization": `Bearer ${token}`,
			"X-GitHub-Api-Version": "2022-11-28",
		},
		body: JSON.stringify(body),
	});

	if (response.status !== 201) {
		const errorData: ErrorData = await response.json();

		const errors = errorData.errors.map((error) => `${error.resource} - ${error.code}: ${error.message}`).join("\n");
		const errorMessage = `${errorData.message}\n${errors}`

        throw new Error(`Failed to create PR: ${response.status} - ${response.statusText}\nResponse: ${errorMessage}`);
	}

	const pr: PullRequestModel = await response.json();

	return pr.number;
}
