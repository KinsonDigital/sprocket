/**
 * Types related to releases.
 * @module releases
 */

import type { DotnetCopyrightUpdate } from "./dotnet.ts";
import { LabelClient, MilestoneClient, RepoClient } from "@kdclients/github";
import { isNothing } from "../core/guards.ts";
import type { IssueModel, PullRequestModel } from "@kdclients/github/models";
import type { IssueTypeModel } from "../models/github-models.ts";

/**
 * Represents the different settings.
 */
export type PrepareReleaseSettings = {
	/**
	 * Gets the owner of the repository.
	 */
	ownerName: string;

	/**
	 * Gets the name of the repository.
	 */
	repoName: string;

	/**
	 * Gets the list of release types.
	 */
	releaseTypes: ReleaseType[];

	/**
	 * Gets the name of the name of the environment name for the GitHub token.
	 */
	githubTokenEnvVarName: string;

	/**
	 * Gets the name of the organization project.
	 */
	orgProjectName?: string;

	/**
	 * Gets the full or relative file path to the version file.
	 * @remarks If undefined, null, or empty, then the version will not be updated.
	 */
	versionFilePath?: string;

	/**
	 * Gets the dot separated path to the JSON key that contains the version.
	 */
	versionJSONKeyPath?: string;

	/**
	 * Gets the value to prefix the release notes file name with.
	 */
	releaseNotesFilePrefix?: string;

	/**
	 * Gets the list of strings to trim from the start of the version.
	 */
	trimFromStartOfVersion?: string[];

	/**
	 * Gets the dotnet copyright update settings.
	 */
	dotnetCopyrightUpdate?: DotnetCopyrightUpdate;
};

/**
 * Various settings for generating release notes.
 */
export type GeneratorSettings = {
	/**
	 * The owner of the GitHub repository.
	 *
	 * This is the username or organization name that owns the repository
	 * where the release notes will be generated from. Used in GitHub API
	 * calls to identify the repository owner.
	 *
	 * @example "KinsonDigital"
	 */
	ownerName: string;

	/**
	 * The name of the GitHub repository.
	 *
	 * This is the repository name (not including the owner) from which
	 * issues and pull requests will be fetched to generate release notes.
	 * Used in conjunction with ownerName to form the full repository path.
	 *
	 * @example "sprocket"
	 */
	repoName: string;

	/**
	 * The name of the environment variable containing the GitHub token.
	 *
	 * This environment variable should contain a GitHub Personal Access Token
	 * or GitHub App token with appropriate permissions to read repository data,
	 * issues, pull requests, milestones, and labels. The token is required
	 * for authenticating GitHub API requests.
	 *
	 * @example "GITHUB_TOKEN"
	 */
	githubTokenEnvVarName: string;

	/**
	 * The name of the milestone used to filter issues and pull requests.
	 *
	 * Supports placeholder substitution for dynamic milestone naming:
	 * - `${VERSION}` - Replaced with the version property value
	 * - `${ENVIRONMENT}` - Replaced with the releaseType property value
	 * - `${REPONAME}` - Replaced with the repoName property value
	 *
	 * Only issues and pull requests associated with this milestone will be
	 * included in the generated release notes.
	 *
	 * @example "v${VERSION}" or "${REPONAME} v${VERSION}"
	 */
	milestoneName: string;

	/**
	 * The header text displayed at the top of the generated release notes.
	 *
	 * Supports placeholder substitution for dynamic header content:
	 * - `${VERSION}` - Replaced with the version property value
	 * - `${RELEASETYPE}` - Replaced with the releaseType property value
	 * - `${REPONAME}` - Replaced with the repoName property value
	 *
	 * The header will be rendered as an HTML h1 element with styling
	 * applied for consistent formatting across release notes.
	 *
	 * @example "${REPONAME} Release Notes - v${VERSION}"
	 */
	headerText: string;

	/**
	 * A mapping of words or phrases to replace in issue and PR titles.
	 *
	 * This allows for standardizing terminology and improving readability
	 * of release notes by replacing technical terms, abbreviations, or
	 * inconsistent wording with more user-friendly alternatives.
	 *
	 * The replacement is performed as a simple string replacement across
	 * all issue and pull request titles before they are added to the
	 * release notes.
	 *
	 * @example { "feat": "Feature", "fix": "Bug Fix", "perf": "Performance" }
	 */
	wordReplacements: Record<string, string>;

	/**
	 * The version string for the release.
	 *
	 * This version is used in placeholder substitution within milestoneName
	 * and headerText properties. It typically follows semantic versioning
	 * format (e.g., "1.2.3") but can be any string that represents the
	 * release version.
	 *
	 * When undefined, placeholder substitutions for ${VERSION} will result
	 * in empty strings.
	 *
	 * @example "1.2.3" or "2.0.0-beta.1"
	 */
	version?: string;

	/**
	 * The type of release being generated.
	 *
	 * This field categorizes the release (e.g., "Production", "Preview", "Beta")
	 * and is used in placeholder substitution within milestoneName and headerText
	 * properties. It helps distinguish between different release channels or
	 * deployment environments.
	 *
	 * When undefined, placeholder substitutions for ${RELEASETYPE} and
	 * ${ENVIRONMENT} will result in empty strings.
	 *
	 * @example "Production" or "Preview" or "Beta"
	 */
	releaseType?: string;

	/**
	 * Additional information section displayed below the header.
	 *
	 * When provided, this creates an extra informational section between
	 * the main header and the categorized issue/PR listings. This is useful
	 * for adding release highlights, breaking changes, migration notes,
	 * or other important information users should know about the release.
	 *
	 * The section will be rendered as an HTML h2 title followed by the
	 * text content in a centered div container.
	 *
	 * @example { title: "Breaking Changes", text: "This release includes..." }
	 */
	extraInfo?: { title: string; text: string };

	/**
	 * List of emoji characters to remove from issue and PR titles.
	 *
	 * GitHub issues and pull requests often contain emojis that may not
	 * be desired in formal release notes. This array specifies which
	 * emoji characters should be stripped from titles during processing.
	 *
	 * Each string in the array should be a single emoji character or
	 * emoji sequence that will be removed from all issue and PR titles.
	 *
	 * @example ["🐛", "✨", "🚀", "💥"]
	 */
	emojisToRemoveFromTitle?: string[];

	/**
	 * Mapping of release note categories to GitHub issue types.
	 *
	 * This creates sections in the release notes based on issue type
	 * classifications rather than labels. Each key represents a category
	 * name that will appear as a section header, and each value represents
	 * the issue type name to match against.
	 *
	 * Issues matching the specified type will be grouped under the
	 * corresponding category section in the generated release notes.
	 *
	 * @example { "New Features": "enhancement", "Bug Fixes": "bug" }
	 */
	issueCategoryIssueTypeMappings?: Record<string, string>;

	/**
	 * Mapping of release note categories to GitHub issue labels.
	 *
	 * This creates sections in the release notes by grouping issues based
	 * on their labels. Each key represents a category name that will appear
	 * as a section header, and each value represents the GitHub label name
	 * to match against.
	 *
	 * Issues with matching labels will be grouped under the corresponding
	 * category section. Labels must exist in the repository or validation
	 * will fail during release note generation.
	 *
	 * @example { "Enhancements": "enhancement", "Bug Fixes": "bug" }
	 */
	issueCategoryLabelMappings?: Record<string, string>;

	/**
	 * Mapping of release note categories to GitHub pull request labels.
	 *
	 * Similar to issueCategoryLabelMappings but specifically for pull requests.
	 * This creates sections in the release notes by grouping PRs based on
	 * their labels. Each key represents a category name that will appear
	 * as a section header, and each value represents the GitHub label name
	 * to match against.
	 *
	 * Pull requests with matching labels will be grouped under the
	 * corresponding category section. Labels must exist in the repository.
	 *
	 * @example { "Features": "feature", "Documentation": "documentation" }
	 */
	prCategoryLabelMappings?: Record<string, string>;

	/**
	 * List of GitHub label names to exclude from release notes.
	 *
	 * Issues and pull requests with any of these labels will be filtered
	 * out and not included in the generated release notes, regardless of
	 * their milestone association. This is useful for excluding internal
	 * items, duplicates, or items not relevant to end users.
	 *
	 * All specified labels must exist in the repository or validation
	 * will fail during release note generation.
	 *
	 * @example ["internal", "duplicate", "wontfix", "invalid"]
	 */
	ignoreLabels?: string[];

	/**
	 * Mapping of first words in titles to replacement words.
	 *
	 * This performs targeted word replacement specifically for the first
	 * word of issue and PR titles after capitalizing it. This is useful
	 * for standardizing action words or prefixes that commonly appear
	 * at the beginning of titles.
	 *
	 * The replacement only occurs if the first word (after capitalization)
	 * exactly matches a key in this mapping.
	 *
	 * @example { "Add": "Added", "Fix": "Fixed", "Update": "Updated" }
	 */
	firstWordReplacements?: Record<string, string>;

	/**
	 * Mapping of words to markdown styling options.
	 *
	 * This applies markdown formatting (bold and/or italic) to specific
	 * words found in issue and PR titles. Each key represents a word to
	 * style, and each value is a comma-separated string of style options.
	 *
	 * Supported style values:
	 * - "bold" - Wraps the word in **bold** markdown syntax
	 * - "italic" - Wraps the word in _italic_ markdown syntax
	 * - "bold,italic" - Applies both bold and italic formatting
	 *
	 * @example { "API": "bold", "BREAKING": "bold,italic", "deprecated": "italic" }
	 */
	styledWordsList?: Record<string, string>;

	/**
	 * Whether to apply bold formatting to version numbers in titles.
	 *
	 * When true, any semantic version patterns found in issue and PR titles
	 * will be wrapped in **bold** markdown syntax. Version detection uses
	 * regex pattern matching for standard semantic versioning format including
	 * pre-release and build metadata components.
	 *
	 * This formatting is applied after all other text processing and can
	 * be combined with italic formatting if both options are enabled.
	 *
	 * @default false
	 */
	boldedVersions?: boolean;

	/**
	 * Whether to apply italic formatting to version numbers in titles.
	 *
	 * When true, any semantic version patterns found in issue and PR titles
	 * will be wrapped in _italic_ markdown syntax. Version detection uses
	 * regex pattern matching for standard semantic versioning format including
	 * pre-release and build metadata components.
	 *
	 * This formatting is applied after all other text processing and can
	 * be combined with bold formatting if both options are enabled.
	 *
	 * @default false
	 */
	italicVersions?: boolean;

	/**
	 * Name of the category for uncategorized items.
	 *
	 * Issues and pull requests that don't match any category label mappings
	 * will be grouped under this category section. This provides a catch-all
	 * section for items that don't fit into the predefined categories.
	 *
	 * When undefined, uncategorized items will be excluded from the release
	 * notes entirely. When defined, creates an additional section with this
	 * name containing all unmatched items.
	 *
	 * @example "Other Changes" or "Miscellaneous"
	 */
	otherCategoryName?: string;
};

/**
 * Represents a release type that would create a release pull request from the head branch to the base branch.
 */
export type ReleaseType = {
	/**
	 * Gets the name of the release type.
	 */
	name: string;

	/**
	 * Gets the pull request reviewer.
	 */
	reviewer?: string;

	/**
	 * Gets the pull request assignee.
	 */
	assignee?: string;

	/**
	 * Gets the head branch for a release pull request.
	 */
	headBranch: string;

	/**
	 * Gets the base branch for a release pull request.
	 */
	baseBranch: string;

	/**
	 * Gets the file path to the generate release settings.
	 */
	genReleaseSettingsFilePath?: string;

	/**
	 * Gets the directory path to the release notes.
	 */
	releaseNotesDirPath: string;

	/**
	 * Gets the path to the template file for the release pull request.
	 */
	releasePrTemplateFilePath: string;

	/**
	 * Gets the labels to use in the release pull request.
	 */
	releaseLabels: string[];

	/**
	 * Gets the title of the pull request.
	 */
	prTitle: string;
};

/**
 * Extended issue model that includes issue type information.
 * Combines the standard IssueModel with IssueTypeModel data.
 */
type IssueModelNew = IssueModel & { type: IssueTypeModel };

/**
 * Generates release notes based on various settings.
 */
export class ReleaseNotesGenerator {
	private labelClient?: LabelClient = undefined;
	private milestoneClient?: MilestoneClient = undefined;
	private repoClient?: RepoClient = undefined;

	/**
	 * Generates the release notes using the given {@link settings}.
	 * @param settings The settings to use to generate the release notes.
	 */
	public async generateNotes(settings: GeneratorSettings): Promise<string> {
		this.init(settings);

		const releaseNotesList: string[] = [];

		await this.validateSettings(settings);

		const notesHeader = this.createNotesHeader(settings);
		const extraInfo = this.createExtraInfo(settings.extraInfo);
		releaseNotesList.push(notesHeader);
		releaseNotesList.push(extraInfo);

		const issues = await this.getIssues(settings);
		const prs = await this.getPrs(settings);

		let categorySections: Record<string, string[]> = {};

		const issuesWithTypes: IssueModelNew[] = issues.map((issue) => {
			return <IssueModelNew>issue;
		});

		const issueTypeCatSections = this.buildCategoryIssueTypeSections(
			settings.issueCategoryIssueTypeMappings ?? {},
			issuesWithTypes,
		);

		// Create the issue categories and line items
		const issueCatSections = this.buildCategoryLabelSections(settings.issueCategoryLabelMappings ?? {}, issues);

		// Create the pr categories and line items
		const prCatSections = this.buildCategoryLabelSections(settings.prCategoryLabelMappings ?? {}, prs);

		const issueCatLabels: string[] = [];
		const issueTypeNames: string[] = [];

		// Collect all of the issue category names
		for (const catName in settings.issueCategoryLabelMappings) {
			issueCatLabels.push(settings.issueCategoryLabelMappings[catName].trim());
		}

		// Collect all of the issueType names
		for (const catName in settings.issueCategoryIssueTypeMappings) {
			issueTypeNames.push(catName.trim());
		}

		// Get all of the issues that do not have any of the labels in the category labels
		const otherCatIssues = settings.otherCategoryName === undefined ? [] : issues.filter((issue) => {
			const hasNoCategoryLabels = issue.labels.every((label) => !issueCatLabels.includes(label.name));
			const hasNoIssueType = isNothing(issue.type) || !issueTypeNames.includes(issue.type.name.trim());

			return hasNoCategoryLabels && hasNoIssueType;
		});

		const otherCat: Record<string, string | undefined> = {};
		otherCat[settings?.otherCategoryName ?? ""] = undefined;

		const otherIssueCatSection = this.buildCategoryLabelSections(otherCat, otherCatIssues);

		categorySections = { ...issueTypeCatSections, ...issueCatSections, ...prCatSections, ...otherIssueCatSection };

		for (const section in categorySections) {
			const catSection = categorySections[section].join("\n");
			releaseNotesList.push(`${catSection}\n`);
		}

		return releaseNotesList.join("\n");
	}

	/**
	 * Initializes the generator with the given {@link settings}.
	 * @param settings The settings to use to initialize the generator.
	 */
	private init(settings: GeneratorSettings): void {
		if (isNothing(settings.githubTokenEnvVarName)) {
			const errorMsg = "The 'githubTokenEnvVarName' setting is required and cannot be empty.";
			throw new Error(errorMsg);
		}

		const githubToken = Deno.env.get(settings.githubTokenEnvVarName);

		if (githubToken === undefined) {
			const errorMsg = `The environment variable '${settings.githubTokenEnvVarName}' was not found or is empty.`;
			throw new Error(errorMsg);
		}

		this.labelClient = new LabelClient(settings.ownerName, settings.repoName, githubToken);
		this.milestoneClient = new MilestoneClient(settings.ownerName, settings.repoName, githubToken);
		this.repoClient = new RepoClient(settings.ownerName, settings.repoName, githubToken);

		this.validateSettings(settings);
	}

	/**
	 * Validates the given {@link settings}.
	 * @param settings The settings to validate.
	 */
	private async validateSettings(settings: GeneratorSettings) {
		if (isNothing(settings.ownerName)) {
			const errorMsg = "The 'ownerName' setting is required and cannot be empty.";
			throw new Error(errorMsg);
		}

		if (isNothing(settings.repoName)) {
			const errorMsg = "The 'repoName' setting is required and cannot be empty.";
			throw new Error(errorMsg);
		}

		if (isNothing(settings.headerText)) {
			const errorMsg = "The 'headerText' setting is required and cannot be empty.";
			throw new Error(errorMsg);
		}

		const repoDoesNotExit = !(await this.repoClient?.exists());

		if (repoDoesNotExit) {
			const errorMsg = `The repository '${settings.ownerName}/${settings.repoName}' does not exist.`;
			throw new Error(errorMsg);
		}

		// Validate the labels in the issue category to label mappings
		if (settings.issueCategoryLabelMappings !== undefined) {
			const labelsToCheck = Object.getOwnPropertyNames(settings.issueCategoryLabelMappings).map((p) => p.trim());

			await this.validateLabels("issueCategoryLabelMappings", labelsToCheck);
		}

		// Validate the labels in the pr category to label mappings
		if (settings.prCategoryLabelMappings !== undefined) {
			const labelsToCheck = Object.getOwnPropertyNames(settings.prCategoryLabelMappings).map((l) => l.trim());

			await this.validateLabels("prCategoryLabelMappings", labelsToCheck);
		}

		// Validate the ignore labels
		if (settings.ignoreLabels !== undefined) {
			await this.validateLabels("ignoreLabels", settings.ignoreLabels);
		}
	}

	/**
	 * Validates the given {@link labels}.
	 * @param labelSettingType The type of labels being validated.
	 * @param labels The labels to validate.
	 */
	private async validateLabels(labelSettingType: string, labels: string[]): Promise<void> {
		const invalidLabels: string[] = [];
		const workItems: Promise<boolean>[] = [];

		labels.forEach((labelToCheck) => {
			workItems.push(this.labelClient?.exists(labelToCheck) ?? Promise.resolve(true));
		});

		const results = await Promise.all(workItems);

		for (let i = 0; i < results.length; i++) {
			if (!results[i]) {
				invalidLabels.push(labels[i]);
			}
		}

		//If there are any invalid labels, throw an error
		if (results.some((i) => i === false)) {
			const errorMsg = `The following '${labelSettingType}' label(s) do not exist:\n   ${invalidLabels.join(", ")}`;
			throw new Error(errorMsg);
		}
	}

	/**
	 * Builds a markdown line item using the given {@link issueOrPr} and {@link itemNumber}.
	 * @param issueOrPr The issue or pr to use for the line item.
	 * @param itemNumber The item number in the list.
	 * @returns The markdown line item.
	 */
	private buildLineItem(issueOrPr: IssueModel | PullRequestModel, itemNumber: number): string {
		const markdownLink = this.createMarkDownLink(issueOrPr.number, issueOrPr.html_url ?? "");

		return `${itemNumber + 1}. ${markdownLink} - ${issueOrPr.title}.`;
	}

	/**
	 * Builds category sections for the given {@link categoryMappings} and {@link issues}.
	 * @param categoryMappings The category to label mappings.
	 * @param issues The issues to build the category sections from.
	 * @returns The category sections.
	 */
	private buildCategoryIssueTypeSections(
		categoryMappings: Record<string, string | undefined>,
		issues: IssueModelNew[],
	): Record<string, string[]> {
		const categorySection: Record<string, string[]> = {};

		for (const catName in categoryMappings) {
			const catIssues = issues.filter((issue) => !isNothing(issue.type) && issue.type.name === catName);

			if (catIssues.length > 0) {
				const notesCategoryName = catName.replaceAll("-", " ").trim();

				if (categorySection[notesCategoryName] === undefined) {
					categorySection[notesCategoryName] = [`${this.createCategoryHeader(categoryMappings[catName])}\n`];
				}

				for (let i = 0; i < catIssues.length; i++) {
					const issueItem = this.buildLineItem(catIssues[i], i);

					if (categorySection[notesCategoryName] === undefined) {
						categorySection[notesCategoryName] = [issueItem];
					} else {
						categorySection[notesCategoryName].push(issueItem);
					}
				}
			}
		}

		return categorySection;
	}

	/**
	 * Builds category sections for the given {@link categoryMappings} and {@link issuesOrPrs}.
	 * @param categoryMappings The category to label mappings.
	 * @param issuesOrPrs The issues or prs to build the category sections from.
	 * @returns The category sections.
	 */
	private buildCategoryLabelSections(
		categoryMappings: Record<string, string | undefined>,
		issuesOrPrs: IssueModel[] | PullRequestModel[],
	): Record<string, string[]> {
		const categorySection: Record<string, string[]> = {};

		for (const catName in categoryMappings) {
			const catLabel = categoryMappings[catName];

			const catIssues = issuesOrPrs.filter((issue) => issue.labels.some((label) => label.name === catName));

			if (catIssues.length > 0) {
				if (categorySection[catName] === undefined) {
					categorySection[catName] = [`${this.createCategoryHeader(catLabel)}\n`];
				}

				for (let i = 0; i < catIssues.length; i++) {
					const issueItem = this.buildLineItem(catIssues[i], i);

					if (categorySection[catName] === undefined) {
						categorySection[catName] = [issueItem];
					} else {
						categorySection[catName].push(issueItem);
					}
				}
			}
		}

		return categorySection;
	}

	/**
	 * Builds the milestone name using the given {@link settings}.
	 * @param settings The settings to use to build the milestone name.
	 * @returns The milestone name.
	 */
	private buildMilestoneName(settings: GeneratorSettings) {
		return settings.milestoneName
			.replace("${VERSION}", settings.version ?? "")
			.replace("${ENVIRONMENT}", settings.releaseType ?? "")
			.replace("${REPONAME}", settings.repoName);
	}

	/**
	 * Gets a list of issues that belong to a milestone.
	 * @param settings The settings to use to get the issues.
	 * @returns The list of issues that belong to a milestone.
	 */
	private async getIssues(settings: GeneratorSettings): Promise<IssueModelNew[]> {
		const milestoneName = this.buildMilestoneName(settings);

		const issues = (await this.milestoneClient?.getIssues(milestoneName) ?? []) as IssueModelNew[];

		const ignoreLabels = settings.ignoreLabels ?? [];

		if (ignoreLabels.length === 0) {
			return issues;
		}

		return issues.filter((issue) => issue.labels.every((label) => !ignoreLabels.includes(label.name)))
			.map((issue) => this.sanitizeIssueTitle(settings, issue));
	}

	/**
	 * Gets a list of prs that belong to a milestone.
	 * @param settings The settings to use to get the prs.
	 * @returns The list of prs that belong to a milestone.
	 */
	private async getPrs(settings: GeneratorSettings): Promise<PullRequestModel[]> {
		const milestoneName = this.buildMilestoneName(settings);

		const prs = await this.milestoneClient?.getPullRequests(milestoneName) ?? [];

		const ignoreLabels = settings.ignoreLabels ?? [];

		if (ignoreLabels.length === 0) {
			return prs;
		}

		return prs.filter((pr) => pr.labels.every((label) => !ignoreLabels.includes(label.name)))
			.map((pr) => this.sanitizePrTitle(settings, pr));
	}

	/**
	 * Creates a category header with the given {@link categoryName}.
	 * @param categoryName The name of the category.
	 * @returns The category section.
	 */
	private createCategoryHeader(categoryName: string | undefined): string {
		return categoryName === undefined ? "" : `<h2 align="center" style="font-weight: bold;">${categoryName}</h2>`;
	}

	/**
	 * Sanitizes the issue title by removing emojis and replacing words.
	 * @param settings The settings to use to sanitize the title.
	 * @param title The title to sanitize.
	 * @returns The sanitized title.
	 */
	private sanitizeIssueTitle(settings: GeneratorSettings, issue: IssueModelNew): IssueModelNew {
		issue.title = this.sanitizeTitle(settings, issue.title ?? "");

		return issue;
	}

	/**
	 * Sanitizes the pr title by removing emojis and replacing words.
	 * @param settings The settings to use to sanitize the title.
	 * @param title The title to sanitize.
	 * @returns The sanitized title.
	 */
	private sanitizePrTitle(settings: GeneratorSettings, pr: PullRequestModel): PullRequestModel {
		pr.title = this.sanitizeTitle(settings, pr.title ?? "");

		return pr;
	}

	/**
	 * Sanitizes the given {@link title} using the given {@link settings}.
	 * @param settings The settings to use to sanitize the title.
	 * @param title The title to sanitize.
	 * @returns The sanitized title.
	 */
	private sanitizeTitle(settings: GeneratorSettings, title: string): string {
		// Remove all emojis from the title
		if (settings.emojisToRemoveFromTitle !== undefined) {
			for (const emoji of settings.emojisToRemoveFromTitle) {
				title = title.replace(emoji, "");
			}
		}

		if (settings.wordReplacements !== undefined) {
			for (const wordToReplace in settings.wordReplacements) {
				const replacementWord = settings.wordReplacements[wordToReplace];
				title = title.replace(wordToReplace, replacementWord);
			}
		}

		const sections = title.split(" ") ?? [];

		for (const wordToReplace in settings.firstWordReplacements) {
			const replacementWord = settings.firstWordReplacements[wordToReplace];

			// Get the first word and trim all periods from the end
			let firstWord = sections[0];

			firstWord = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);

			if (firstWord === wordToReplace) {
				sections[0] = replacementWord;
				break;
			}
		}

		title = sections.join(" ");

		// If there are any words that need to be bolded or italicized
		for (const wordToStyle in settings.styledWordsList) {
			const styleList = settings.styledWordsList[wordToStyle].toLowerCase().trim();

			const styles = styleList.split(",").filter((s) => s === "bold" || s === "italic");

			const isBold = styles.includes("bold");
			const isItalic = styles.includes("italic");

			const italicSyntax = isItalic ? "_" : "";
			const boldSyntax = isBold ? "**" : "";

			title = title.replace(wordToStyle, `${italicSyntax}${boldSyntax}${wordToStyle}${boldSyntax}${italicSyntax}`);
		}

		// If versions are to be bolded and/or italicized
		const withoutPrefixVersionRegex =
			/(0|[1-9]\d*)(\.(0|[1-9]\d*))?(\.(0|[1-9]\d*))?(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/gm;
		const withPrefixVersionRegex =
			/v(0|[1-9]\d*)(\.(0|[1-9]\d*))?(\.(0|[1-9]\d*))?(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/gm;

		const italicSyntax = settings.italicVersions ? "_" : "";
		const boldSyntax = settings.boldedVersions ? "**" : "";

		const prefixedVersions = Array.from(title.match(withPrefixVersionRegex) ?? []);

		// Remove the prefix "v" from the versions in the title
		for (const version of prefixedVersions) {
			const versionWithoutPrefix = version.startsWith("v") ? version.slice(1) : version;
			title = title.replace(version, versionWithoutPrefix);
		}

		// Now that all versions in the title do not have the "v" prefix, find all
		// unprefixed versions which should be all of the versions.
		const notPrefixedVersions = Array.from(title.match(withoutPrefixVersionRegex) ?? []);

		// Resolve, bold, and italicize all versions in the title
		for (const version of notPrefixedVersions) {
			const resolvedVersion = this.resolveVersionToFull(version);
			title = title.replace(version, `${italicSyntax}${boldSyntax}v${resolvedVersion}${boldSyntax}${italicSyntax}`);
		}

		return title;
	}

	/**
	 * Creates a release notes header using the given {@link settings}.
	 * @param settings The settings to use to create the header.
	 * @returns The release notes header.
	 */
	private createNotesHeader(settings: GeneratorSettings): string {
		const headerText = settings.headerText
			.replace("${VERSION}", settings.version ?? "")
			.replace("${RELEASETYPE}", settings.releaseType ?? "")
			.replace("${REPONAME}", settings.repoName);

		const extraEmptyLine = settings.extraInfo === undefined ? "" : "\n";
		return `<h1 align="center" style="color: mediumseagreen;font-weight: bold;">\n${headerText}\n</h1>${extraEmptyLine}`;
	}

	/**
	 * Creates an extra info section using the given {@link extraInfo}.
	 * @param extraInfo The extra info used to create the extra info section.
	 * @returns The extra info section.
	 * @remarks The extra info section will be empty if the given {@link extraInfo} is undefined.
	 */
	private createExtraInfo(extraInfo: { title: string; text: string } | undefined): string {
		if (extraInfo === undefined) {
			return "";
		}

		let result = `<h2 align="center" style="font-weight: bold;">${extraInfo.title}</h2>\n\n`;
		result += `<div align="center">\n\n`;
		result += extraInfo.text;
		result += `\n</div>\n`;

		return result;
	}

	/**
	 * Creates a markdown link using the given {@link issueOrPrNumber} and {@link url}.
	 * @param issueOrPrNumber The issue or pr number to use for the link.
	 * @param url The url to use for the link.
	 * @returns The markdown link.
	 */
	private createMarkDownLink(issueOrPrNumber: number, url: string): string {
		return `[#${issueOrPrNumber}](${url})`;
	}

	/**
	 * Resolves the given {@link version} to a full version if it is not already a full version. A full version is in the
	 * format of v{major}.{minor}.{patch}. If the given version is missing the patch or minor version,
	 * it will be resolved to a full version by adding .0 for each missing part. For example, v1 will
	 * be resolved to v1.0.0 and v1.2 will be resolved to v1.2.0.
	 * @param version The version to resolve.
	 * @returns Returns the full version. If the given version is already a full version, it will be returned as is.
	 * If the given version is missing the patch or minor version, it will be resolved to a full version by adding .0 for each missing part. For example, v1 will be resolved to v1.0.0 and v1.2 will be resolved to v1.2.0.
	 */
	private resolveVersionToFull(version: string): string {
		if (this.isFullVersion(version)) {
			return version;
		}

		const split = version.split(".");

		if (split.length === 1) {
			return `${version}.0.0`;
		} else if (split.length === 2) {
			return `${version}.0`;
		} else {
			throw new Error(`Cannot resolve version: ${version} to full version`);
		}
	}

	/**
	 * Returns a value indicating whether the given {@link version} is a full version. A full version is in the format of
	 * v{major}.{minor}.{patch}. For example, v1.2.3 is a full version, while v1 and v1.2 are not full versions.
	 * @param version The version to check.
	 * @returns A boolean value indicating whether the given {@link version} is a full version.
	 */
	private isFullVersion(version: string): boolean {
		if (version === undefined || version === null || version === "") {
			return false;
		}

		const split = version.split(".");

		return split.length >= 3;
	}
}
