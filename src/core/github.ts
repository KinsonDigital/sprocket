/**
 * GitHub related functions and types for easily interacting with the GitHub API.
 * @module
 */

import type { PullRequestModel } from "@kdclients/github/models";
import { MilestoneClient, PullRequestClient } from "@kdclients";
import type { IssueTypeModel } from "../models/github-models.ts";
import { isLessThanOne, isNothing } from "./guards.ts";

/**
 * Describes a GitHub API error.
 */
export interface GitHubError {
	/**
	 * The resource that caused the error.
	 */
	resource: string;

	/**
	 * The error code.
	 */
	code: string;

	/**
	 * The error message.
	 */
	message: string;
}

/**
 * Describes the structure of an error response from the GitHub API.
 */
export interface ErrorData {
	/**
	 * The error message.
	 */
	message: string;

	/**
	 * The list of errors.
	 */
	errors: GitHubError[];

	/**
	 * The URL to the documentation.
	 */
	documentation_url: string;
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

/**
 * Creates a pull request on GitHub.
 * @param ownerName The owner of the repository.
 * @param repoName The name of the repository.
 * @param title The title of the pull request.
 * @param description The description of the pull request.
 * @param headBranch The name of the branch to merge from.
 * @param baseBranch The name of the branch to merge into.
 * @param token The GitHub token to use for authentication.
 * @returns The pull request number.
 */
export async function createPr(
	ownerName: string,
	repoName: string,
	title: string,
	description: string,
	headBranch: string,
	baseBranch: string,
	token: string,
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
		const errorMessage = `${errorData.message}\n${errors}`;

		throw new Error(`Failed to create PR: ${response.status} - ${response.statusText}\nResponse: ${errorMessage}`);
	}

	const pr: PullRequestModel = await response.json();

	return pr.number;
}

/**
 * Builds a URL to a pull request that matches the given {@link prNumber} in a repository with a
 * name that matches the given {@link repoName} and is owned by the given {@link ownerName}.
 * @param ownerName The owner of the repository.
 * @param repoName The name of the repository.
 * @param prNumber The pull request number.
 * @returns The URL to the issue.
 */
export function buildPullRequestUrl(ownerName: string, repoName: string, prNumber: number): string {
	if (isNothing(ownerName)) {
		throw new Error("The owner name is required.");
	}
	if (isNothing(repoName)) {
		throw new Error("The repo name is required.");
	}
	if (isLessThanOne(prNumber)) {
		throw new Error("The pull request number must be greater than zero.");
	}

	return `https://github.com/${ownerName}/${repoName}/pull/${prNumber}`;
}

/**
 * Builds a URL to the labels page of a repository with a name that matches the given {@link repoName}
 * and is owned by the given {@link ownerName}.
 * @param ownerName The owner of the repository.
 * @param repoName The name of the repository.
 * @returns The URL to the repository labels page.
 */
export function buildLabelsUrl(ownerName: string, repoName: string): string {
	if (isNothing(ownerName)) {
		throw new Error("The owner name is required.");
	}
	if (isNothing(repoName)) {
		throw new Error("The repo name is required.");
	}

	return `https://github.com/${ownerName}/${repoName}/labels`;
}

/**
 * Creates a new pull request on GitHub using the GitHub API.
 *
 * This function uses the PullRequestClient to create a pull request between
 * two branches in a GitHub repository. It supports customization of various
 * pull request properties including title, description, draft status, and
 * maintainer modification permissions.
 *
 * @param ownerName The GitHub username or organization name that owns the repository
 * @param repoName The name of the GitHub repository
 * @param token The GitHub personal access token for authentication
 * @param title The title/summary of the pull request
 * @param headBranch The source branch containing the changes to be merged
 * @param baseBranch The target branch where changes will be merged into
 * @param description Optional description/body text for the pull request (defaults to empty string)
 * @param maintainerCanModify Whether repository maintainers can modify the pull request (defaults to true)
 * @param isDraft Whether to create the pull request as a draft (defaults to true)
 * @returns A promise that resolves to the pull request number of the newly created PR
 *
 * @example
 * ```typescript
 * const prNumber = await createPullRequest(
 *   "JohnDoe",
 *   "MyRepo",
 *   "ghp_xxxxxxxxxxxx",
 *   "Add new authentication feature",
 *   "feature/auth",
 *   "main",
 *   "This PR implements OAuth2 authentication",
 *   true,
 *   false
 * );
 * console.log(`Created pull request #${prNumber}`);
 * ```
 */
export async function createPullRequest(
	ownerName: string,
	repoName: string,
	token: string,
	title: string,
	headBranch: string,
	baseBranch: string,
	description = "",
	maintainerCanModify = true,
	isDraft = true,
): Promise<number> {
	const client = new PullRequestClient(ownerName, repoName, token);

	const newPr = await client.createPullRequest(title, headBranch, baseBranch, description, maintainerCanModify, isDraft);

	return newPr.number;
}

/**
 * Renames a milestone in a GitHub repository.
 *
 * @param ownerName The GitHub username or organization name that owns the repository.
 * @param repoName The name of the GitHub repository.
 * @param currentName The current name of the milestone.
 * @param newName The new name for the milestone.
 * @param token The GitHub personal access token for authentication.
 */
export async function renameMilestone(
	ownerName: string,
	repoName: string,
	currentName: string,
	newName: string,
	token: string
): Promise<number> {
	const milestoneClient = new MilestoneClient(ownerName, repoName, token);

	try {
		const milestone = await milestoneClient.getMilestoneByName(currentName);

		const response = await renameMilestoneInternal(ownerName, repoName, milestone.number, newName, token);

		if (!response.ok) {
			const errorData: ErrorData = await response.json();

			const errors = errorData.errors.map((error) => `${error.resource} - ${error.code}: ${error.message}`).join("\n");
			const errorMessage = `${errorData.message}\n${errors}`;

			console.error(`Failed to rename milestone: ${response.status} - ${response.statusText}\nResponse: ${errorMessage}`);

			Deno.exit(1);
		}

		return milestone.number;
	} catch (error) {
		const errMsg = error instanceof Error ? error.message : String(error);
		console.error(`Something went wrong while renaming the milestone: ${errMsg}`);
		Deno.exit(1);
	}
}

/**
 * Renames a milestone in a GitHub repository.
 *
 * @param ownerName The GitHub username or organization name that owns the repository.
 * @param repoName The name of the GitHub repository.
 * @param milestoneNumber The number of the milestone to rename.
 * @param newName The new name for the milestone.
 * @param token The GitHub personal access token for authentication.
 * @returns A promise that resolves to the response from the GitHub API.
 */
async function renameMilestoneInternal(
	ownerName: string,
	repoName: string,
	milestoneNumber: number,
	newName: string,
	token: string
): Promise<Response> {
	const url = `https://api.github.com/repos/${ownerName}/${repoName}/milestones/${milestoneNumber}`;

	const response = await fetch(url, {
		method: "PATCH",
		headers: {
			"Accept": "application/vnd.github+json",
			"Authorization": `Bearer ${token}`,
			"X-GitHub-Api-Version": "2022-11-28",
		},
		body: JSON.stringify({
			title: newName,
		}),
	});

	return response;
}

