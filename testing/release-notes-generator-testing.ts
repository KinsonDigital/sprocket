import { ReleaseNotesGenerator } from "../src/release-notes-generator.ts";

const generator = new ReleaseNotesGenerator();

const notesResult = await generator.generateNotes({
	ownerName: "KinsonDigital",
	repoName: "sprocket",
	githubTokenEnvVarName: "CICD_TOKEN",
	milestoneName: "${VERSION}",
	headerText: "${REPONAME} Production Release Notes - ${VERSION}",
	version: "v1.2.3-test.4",
	releaseType: "",
	extraInfo: {
		title: "Extra Info",
		text: "This is extra info",
	},
	emojisToRemoveFromTitle: ["🤘🏻", "🐏"],
	issueCategoryIssueTypeMappings: {
		"CICD": "CICD ⚙️",
		"Bug": "Bug Fixes 🐛",
		"Enhancement": "Enhancements 💎",
		"Feature": "New Features ✨",
		"Project-Config": "Configuration 🛠️",
		"Research": "Research 🔬",
		"QA-Testing": "Testing 🧪",
		"Tech-Debt": "Tech Debt 📉",
		"Dependency-Update": "Dependency Updates 📦",
	},
	issueCategoryLabelMappings: {
		"dependency-update": "Dependency Updates 📦",
	},
	prCategoryLabelMappings: {
		"dependency-update": "Dependency Updates 📦",
	},
	ignoreLabels: ["help-wanted"],
	wordReplacements: {
		"chore(deps): ": "",
	},
	firstWordReplacements: {
		"Add": "Added",
		"Improve": "Improved",
		"Fix": "Fixed",
		"Update": "Updated",
		"Upgrade": "Upgraded",
		"Create": "Created",
		"Refactor": "Refactored",
		"Remove": "Removed",
		"Implement": "Implemented",
		"Move": "Moved",
		"Change": "Changed",
		"Increase": "Increased",
		"Prevent": "Prevented",
		"Introduce": "Introduced",
		"Adjust": "Adjusted",
		"Replace": "Replaced",
		"Deprecate": "Deprecated",
		"Integrate": "Integrated",
		"Revamp": "Revamped",
		"Research": "Researched",
		"Convert": "Converted",
		"Rename": "Renamed",
		"Make": "Made",
		"bump": "Updated",
		"Perform": "Performed",
		"Process": "Processed",
	},
	styledWordsList: {
		"workflow": "bold",
		"config": "italic",
		"feature": "bold,italic",
	},
	boldedVersions: true,
	italicVersions: true,
	otherCategoryName: "Other Category",
});

const generateNotesResultFilePath = `${Deno.cwd()}/testing/generate-notes-result.md`;

await Deno.writeTextFile(generateNotesResultFilePath, notesResult);

console.log(`Generated release notes written to: ${generateNotesResultFilePath}`);
