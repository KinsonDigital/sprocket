import { Input, Select } from "jsr:@cliffy/prompt@1.0.0-rc.8";
import {
	createCheckoutBranch, getCurrentBranch, isCheckedOut, pushToRemote,
	branchExistsRemotely,
	branchExistsLocally,
	noUncommittedChangesExist,
	uncommittedChangesExist,
	checkoutBranch,
	createCommit,
	stageFiles,
} from "../src/core/git.ts"; // TODO: Update to jsr import
// } from "jsr:@kinsondigital/sprocket@2.0.0/git"; // TODO: Re-enable this
// import { createPr, githubIssueExists } from "jsr:@kinsondigital/";
import jsrConfig from "../jsr.json" with { type: "json" };
import { LabelClient, ProjectClient, PullRequestClient } from "jsr:@kinsondigital/kd-clients@1.0.0-preview.15";
import { IssueOrPRRequestData } from "jsr:@kinsondigital/kd-clients@1.0.0-preview.15/core";
import { renameMilestone } from "../src/core/github.ts"; // TODO: Update to jsr import
// import { printGray } from "jsr:@kinsondigital/sprocket@2.0.0/console"; // TODO: Update to jsr import
import { printGray } from "../src/core/logging.ts"; // TODO: remove

const token = (Deno.env.get("CICD_TOKEN") ?? "").trim();

if (token === "") {
	console.log("The environment variable 'CICD_TOKEN' is required.");
	Deno.exit(1);
}

const ownerName = "KinsonDigital";
const repoName = "sprocket";
const prodLabel = "🚀production-release";
const baseBranch = "main";

const releaseType = await Select.prompt<string>({
	message: "Select the type of release:",
	options: ["Production", "Preview"],
	transform: (value) => value.toLowerCase(),
});

// Ask the user for a version number
const releaseVersion = await Input.prompt({
	message: "Enter the release version:",
	validate: (value) => {
		const prodVersionRegex = /^v([1-9]\d*|0)\.([1-9]\d*|0)\.([1-9]\d*|0)$/gm;

		return prodVersionRegex.test(value.trim().toLowerCase())
	},
	transform: (value) => {
		const result = value.trim().toLowerCase()

		return result.startsWith("v") ? result.slice(1) : result;
	},
});

printGray(`⌛Validating the label '${prodLabel}'. . .`);
const labelClient = new LabelClient(ownerName, repoName, token);
const labelExists = await labelClient.exists(prodLabel);

if (!labelExists) {
	console.error(`The label '${prodLabel}' does not exist in the repository '${ownerName}/${repoName}'.`);
	Deno.exit(1);
}

printGray(`⌛Checking if the branch '${baseBranch}' exists locally. . .`);
// Check if the main branch is checked out
if (await branchExistsLocally(baseBranch)) {
	// If the base branch is checked out
	if (await isCheckedOut(baseBranch)) {
		if (await uncommittedChangesExist()) {
			console.log(`You have uncommitted changes in your working directory. Please commit or stash them before preparing a release.`);
			Deno.exit(1);
		}
	} else {
		if (await noUncommittedChangesExist()) {
			await checkoutBranch(baseBranch);
		} else {
			console.log(`You have uncommitted changes in your working directory. Please commit or stash them before preparing a release.`);
			Deno.exit(1);
		}
	}
} else { // Exists remotely?
	printGray(`⌛Checking if the branch '${baseBranch}' exists remotely. . .`);
	if (await branchExistsRemotely(baseBranch)) {
		await checkoutBranch(baseBranch);
	} else {
		console.log(`The base branch '${baseBranch}' does not exist locally or remotely. Please create it before preparing a release.`);
		Deno.exit(1);
	}
}

const headBranch = `${releaseType}-release`;

// Create a prod-release branch from the base branch
printGray(`⌛Creating the branch '${headBranch}'. . .`);
await createCheckoutBranch(headBranch);

printGray("⌛Updating the version in the jsr.json file. . .");
// Update the version in the jsr.json file
jsrConfig.version = releaseVersion;
Deno.writeTextFileSync(`${Deno.cwd()}/jsr.json`, `${JSON.stringify(jsrConfig, null, 4)}\n`);

printGray("⌛Staging version changes. . .");
await stageFiles(["*jsr.json"]);
printGray("⌛Creating commit. . .");
await createCommit(`release: update version to v${releaseVersion}`);
printGray("⌛Pushing to remote. . .");
await pushToRemote(headBranch);

const title = `🚀Production Release (v${releaseVersion})`;
const assignee = "CalvinWilkinson";
const projectName = "KD-Team";

const prodReleasePrTemplateFilePath = `${Deno.cwd()}/templates/prod-prepare-release-template.md`;
const templateFileContent = Deno.readTextFileSync(prodReleasePrTemplateFilePath);

printGray(`⌛Renaming milestone 'vnext' to 'v${releaseVersion}'. . .`);
const milestoneNumber = await renameMilestone(ownerName, repoName, "vnext", `v${releaseVersion}`, token);

// Create a pull request
const prClient = new PullRequestClient(ownerName, repoName, token);

printGray(`⌛Creating pull request to merge the branch '${headBranch}' into the branch '${baseBranch}'. . .`);
const newPr = await prClient.createPullRequest(
	title,
	headBranch,
	baseBranch,
	templateFileContent);

// Add a label to the PR
const prData: IssueOrPRRequestData = {
	assignees: [assignee],
	labels: [prodLabel],
	milestone: milestoneNumber,
};

const projClient = new ProjectClient(ownerName, repoName, token);

// Update the PR
printGray(`⌛Updating pull request '#${newPr.number}' assignee, label, and milestone. . .`);
await prClient.updatePullRequest(newPr.number, prData);

// Add the PR to the org project.
printGray(`⌛Adding pull request '#${newPr.number}' to project '${projectName}'. . .`);
await projClient.addIssueToProject(newPr.number, projectName);
