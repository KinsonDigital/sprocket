/**
 * Dotnet copyright update settings.
 */
export interface DotnetCopyrightUpdate {
	/**
	 * The directory to start the search from.
	 */
	searchDirPath: string;

	/**
	 * The name of the dotnet project file.
	 * @remarks The file extension is not required.
	 */
	projectFileName: string;

	/**
	 * The name of the company.
	 */
	companyName: string;
}
