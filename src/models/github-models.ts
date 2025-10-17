/**
 * GitHub related models.
 * @module
 */

/**
 * Represents the state of a GitHub issue or pull request.
 */
export type State = "open" | "closed";

/**
 * Represents a GitHub label.
 */
export interface LabelModel {
	/**
	 * The name of the label.
	 */
	name: string;

	/**
	 * The description of the label.
	 */
	description: string;

	/**
	 * Gets or sets the URL to the label.
	 */
	url: string;

	/**
	 * Gets or sets the id of the label.
	 */
	id: number;

	/**
	 * Gets or sets the node id of the label.
	 */
	node_id: string;

	/**
	 * Gets or sets the color of the label.
	 */
	color: string;

	/**
	 * Gets or sets the default value of the label.
	 */
	default: false;
}

/**
 * Represents a GitHub milestone.
 */
export interface MilestoneModel {
	/**
	 * Gets or sets the title of the milestone.
	 */
	title: string;

	/**
	 * Gets or sets the number of the milestone.
	 */
	number: number;

	/**
	 * Gets or sets the URL of the milestone.
	 */
	url: string;

	/**
	 * Gets or sets the number of open issues for the milestone.
	 */
	open_issues: number;

	/**
	 * Gets or sets the number of closed issues for the milestone.
	 */
	closed_issues: number;
}

/**
 * Holds information about a pull requests head or base branches.
 */
export interface PullRequestHeadOrBaseModel {
	/**
	 * Gets or sets the ref.
	 */
	ref: string;

	/**
	 * Gets or sets the GIT sha.
	 */
	sha: string;

	/**
	 * Gets or sets the repository info.
	 */
	repo: RepoModel;
}

/**
 * Represents a GitHub user.
 */
export interface UserModel {
	/**
	 * Gets or sets the user's ID.
	 */
	id: number;

	/**
	 * Gets or sets the user's node ID.
	 */
	node_id: string;

	/**
	 * Gets or sets the user's login.
	 */
	login: string;

	/**
	 * Gets or sets the GitHub profile URL.
	 */
	html_url: string;

	/**
	 * Gets or sets the user's name.
	 */
	name: string;
}

/**
 * Holds additional information about a pull request.
 */
export interface PullRequestInfoModel {
	/**
	 * Gets or sets a value indicating the date and time of the merge.
	 */
	merged_at: string | null;
}

/**
 * Represents a GitHub pull request.
 */
export interface PullRequestModel {
	/**
	 * Gets or sets the ID of the pull request.
	 */
	id: number;

	/**
	 * Gets or sets the node id of the pull request.
	 */
	node_id?: string;

	/**
	 * Gets or sets the title of the pull request.
	 */
	title?: string;

	/**
	 * Gets or sets the number of the pull request.
	 */
	number: number;

	/**
	 * Gets or sets the body of the issue.
	 */
	body: string;

	/**
	 * Gets or sets the list of pull request reviewers.
	 */
	requested_reviewers: UserModel[];

	/**
	 * Gets or sets the assignees.
	 */
	assignees: UserModel[];

	/**
	 * Gets or sets the labels of the pull request.
	 */
	labels: LabelModel[];

	/**
	 * Gets or sets the state of the pull request.
	 */
	state?: State;

	/**
	 * Gets or sets the URL to the pull request.
	 */
	url: string;

	/**
	 * Gets or sets the milestone.
	 */
	milestone?: MilestoneModel;

	/**
	 * Gets or sets the URL to the html page of the pull request.
	 */
	html_url?: string;

	/**
	 * Gets or sets if the pull request is a draft.
	 */
	draft?: boolean;

	/**
	 * Gets or sets additional information about the pull request.
	 */
	pull_request?: PullRequestInfoModel;

	/**
	 * Gets or sets the head branch of the pull request.
	 */
	head: PullRequestHeadOrBaseModel;

	/**
	 * Gets or sets the base branch of the pull request.
	 */
	base: PullRequestHeadOrBaseModel;
}

/**
 * Represents a GitHub repository.
 */
export interface RepoModel {
	/**
	 * Gets or sets the ID of the repository.
	 */
	id: number;

	/**
	 * Gets or sets the node ID of the repository.
	 */
	node_id?: string;

	/**
	 * Gets or sets the name of the repository.
	 */
	name: string;

	/**
	 * Gets or sets the full name of the repository.
	 */
	full_name?: string;

	/**
	 * Gets or sets the URL of the repository.
	 */
	html_url?: string;

	/**
	 * Gets or sets the URL of the repository.
	 */
	url: string;
}
