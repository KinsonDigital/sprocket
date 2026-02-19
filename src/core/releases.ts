/**
 * Types related to releases.
 * @module releases
 */

import type { DotnetCopyrightUpdate } from "./dotnet.ts";

/**
 * Represents the different settings.
 */
export interface PrepareReleaseSettings {
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
}

/**
 * Various settings for generating release notes.
 */
export interface GeneratorSettings {
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
}

/**
 * Represents a release type that would create a release pull request from the head branch to the base branch.
 */
export interface ReleaseType {
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
}
