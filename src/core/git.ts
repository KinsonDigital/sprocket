import { PullRequestClient } from "@kdclients";

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

export async function isCheckedOut(branchName: string): Promise<boolean> {
	const currentCheckedOutBranch = await getCurrentBranch();

	return currentCheckedOutBranch === branchName;
}

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

export async function pushToRemote(branchName: string): Promise<void> {
	const existsRemotely = await branchExistsRemotely(branchName);

	const args = existsRemotely
		? ["push"]
		: ["push", "-u", "origin", branchName];

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

export async function createPullRequest(
	ownerName: string,
	repoName: string,
	token: string,
	title: string,
	headBranch: string,
	baseBranch: string,
	description = "",
	maintainerCanModify = true,
	isDraft = true,): Promise<number> {
	const client = new PullRequestClient(ownerName, repoName, token);

	const newPr = await client.createPullRequest(title, headBranch, baseBranch, description, maintainerCanModify, isDraft);

	return newPr.number;
}
