/**
 * GIT related functions for easily interacting with repositories.
 * @module
 */

import { PullRequestClient } from "@kdclients";

/**
 * Retrieves the name of the currently checked out Git branch.
 *
 * This function executes the `git symbolic-ref --short HEAD` command to get
 * the current branch name. If the command fails or no branch is found,
 * an empty string is returned.
 *
 * @returns A promise that resolves to the current branch name, or an empty string if unable to determine
 *
 * @example
 * ```typescript
 * const branch = await getCurrentBranch();
 * console.log(`Currently on branch: ${branch}`);
 * ```
 */
export async function getCurrentBranch(): Promise<string> {
	const cmd = new Deno.Command("git", {
		args: ["symbolic-ref", "--short", "HEAD"],
	});

	const { stdout, stderr, success } = await cmd.output();

	let currentBranch = "";

	if (stdout) {
		currentBranch = new TextDecoder().decode(stdout).replace("\n", "");

		return currentBranch;
	}

	if (!success) {
		console.error(new TextDecoder().decode(stderr));
	}

	return "";
}

/**
 * Checks if a specific branch is currently checked out in the Git repository.
 *
 * This function compares the provided branch name against the currently
 * checked out branch to determine if they match.
 *
 * @param branchName The name of the branch to check
 * @returns A promise that resolves to true if the specified branch is currently checked out, false otherwise
 *
 * @example
 * ```typescript
 * const isOnMain = await isCheckedOut("main");
 * if (isOnMain) {
 *   console.log("Currently on main branch");
 * }
 * ```
 */
export async function isCheckedOut(branchName: string): Promise<boolean> {
	branchName = branchName.trim();
	const currentCheckedOutBranch = await getCurrentBranch();

	return currentCheckedOutBranch === branchName;
}

/**
 * Creates a new Git branch and immediately checks it out, or switches to an existing branch.
 *
 * This function executes the `git checkout -B` command, which creates a new branch
 * if it doesn't exist, or resets an existing branch to the current HEAD and switches to it.
 * Any command output is logged to the console, and errors are logged to stderr.
 *
 * @param branchName The name of the branch to create and checkout
 * @returns A promise that resolves when the branch operation is complete
 *
 * @example
 * ```typescript
 * await createCheckoutBranch("feature/new-feature");
 * console.log("Now working on feature/new-feature branch");
 * ```
 */
export async function createCheckoutBranch(branchName: string): Promise<void> {
	const cmd = new Deno.Command("git", {
		args: ["checkout", "-B", branchName],
	});

	const { stdout, stderr, success } = await cmd.output();

	if (stdout) {
		console.log(new TextDecoder().decode(stdout));
	}

	if (!success) {
		console.error(new TextDecoder().decode(stderr));
	}
}

/**
 * Stages all modified files in the current Git repository for the next commit.
 *
 * This function executes the `git add *.*` command to stage all files with extensions
 * in the current directory and subdirectories. If the operation fails, the process
 * will exit with code 1. Success output is logged to the console.
 *
 * @returns A promise that resolves when all files have been staged
 *
 * @throws Exits the process with code 1 if the staging operation fails
 *
 * @example
 * ```typescript
 * await stageAll();
 * console.log("All files have been staged for commit");
 * ```
 */
export async function stageAll(): Promise<void> {
	const cmd = new Deno.Command("git", {
		args: ["add", "*.*"],
	});

	const { stdout, stderr, success } = await cmd.output();

	if (success) {
		console.log(new TextDecoder().decode(stdout));
	}

	if (!success) {
		console.error(new TextDecoder().decode(stderr));
		Deno.exit(1);
	}
}

/**
 * Creates a Git commit with the specified commit message.
 *
 * This function executes the `git commit -m` command with the provided message
 * to create a new commit from the currently staged changes. On success, the process
 * exits with code 0. On failure, an error is logged and the process exits with code 1.
 *
 * @param commitMsg The commit message to use for the new commit
 * @returns A promise that resolves when the commit operation completes (note: process may exit)
 *
 * @throws Exits the process with code 0 on success or code 1 on failure
 *
 * @example
 * ```typescript
 * await createCommit("feat: add new authentication system");
 * // Process will exit after successful commit
 * ```
 */
export async function createCommit(commitMsg: string): Promise<void> {
	const cmd = new Deno.Command("git", {
		args: ["commit", "-m", commitMsg],
	});

	const { stdout, stderr, success } = await cmd.output();

	if (stdout) {
		console.log(new TextDecoder().decode(stdout));
		Deno.exit(0);
	}

	if (!success) {
		console.error(new TextDecoder().decode(stderr));
		Deno.exit(1);
	}
}

/**
 * Checks if a specified branch exists on the remote Git repository.
 *
 * This function executes the `git ls-remote --heads origin` command to query
 * the remote repository for the existence of a specific branch. It compares
 * the branch reference format to determine if the branch exists remotely.
 *
 * @param branchName The name of the branch to check for on the remote repository
 * @returns A promise that resolves to true if the branch exists remotely, false otherwise
 *
 * @throws Exits the process with code 1 if the remote query fails
 *
 * @example
 * ```typescript
 * const exists = await branchExistsRemotely("feature/new-feature");
 * if (exists) {
 *   console.log("Branch exists on remote");
 * } else {
 *   console.log("Branch is local only");
 * }
 * ```
 */
export async function branchExistsRemotely(branchName: string): Promise<boolean> {
	const cmd = new Deno.Command("git", {
		args: ["ls-remote", "--heads", "origin", branchName],
	});

	const { stdout, stderr, success } = await cmd.output();

	if (success) {
		const result = new TextDecoder().decode(stdout);
		const sections = result.split("\t").map((section) => section.trim().replaceAll("\n", ""));
		const branch = sections[1];

		return `refs/heads/${branchName}` === branch;
	}

	if (!success) {
		console.error(new TextDecoder().decode(stderr));
		Deno.exit(1);
	}

	return false;
}

/**
 * Pushes the specified branch to the remote Git repository.
 *
 * This function intelligently handles both new and existing remote branches.
 * If the branch doesn't exist remotely, it uses `git push -u origin <branch>`
 * to set up tracking. If the branch already exists remotely, it uses a simple
 * `git push` command. The operation will exit the process with code 1 on failure.
 *
 * @param branchName The name of the branch to push to the remote repository
 * @returns A promise that resolves when the push operation completes successfully
 *
 * @throws Exits the process with code 1 if the push operation fails
 *
 * @example
 * ```typescript
 * await pushToRemote("feature/new-feature");
 * console.log("Branch successfully pushed to remote");
 * ```
 */
export async function pushToRemote(branchName: string): Promise<void> {
	const existsRemotely = await branchExistsRemotely(branchName);

	const args = existsRemotely ? ["push"] : ["push", "-u", "origin", branchName];

	const cmd = new Deno.Command("git", { args });

	const { stdout, stderr, success } = await cmd.output();

	if (success) {
		console.log(new TextDecoder().decode(stdout));
	}

	if (!success) {
		console.error(new TextDecoder().decode(stderr));
		Deno.exit(1);
	}
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
