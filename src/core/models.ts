/**
 * Various data models in the application.
 * @module
 */

/**
 * Represents an issue type returned by the GitHub API.
 */
export interface IssueTypeModel {
	/**
	 * The unique identifier of the issue type.
	 * Assigned by GitHub and unique across the repository.
	 */
	id: number;

	/**
	 * The node identifier of the issue type.
	 */
	node_id: string;

	/**
	 * The name of the issue type.
	 */
	name: string;

	/**
	 * A detailed description of the issue type.
	 */
	description: string;

	/**
	 * The color associated with the issue type.
	 * Represented as a six-character hex code without the leading '#'.
	 */
	color: string;

	/**
	 * The timestamp when the issue type was created.
	 * Formatted in ISO 8601 format.
	 */
	created_at: string;

	/**
	 * The timestamp when the issue type was last updated.
	 * Formatted in ISO 8601 format.
	 */
	updated_at: string;

	/**
	 * Indicates whether the issue type is enabled.
	 */
	is_enabled: boolean;
}
