/**
 * The dotnet copyright update type.
 */

import { existsSync, walkSync } from "@std/fs";
import { extname } from "@std/path";
import { isStringNothing } from "./guards.ts";
import type { WalkEntry } from "@std/fs";
import type { PrepareReleaseSettings } from "./releases.ts";

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

/**
 * Updates copyright tags in a dotnet csproj file.
 */
export class DotnetCopyrightUpdater {
	/**
	 * Updates the copyright year in a csproj file.
	 * @param copyRightSettings The settings.
	 */
	public updateCopyright(copyRightSettings: DotnetCopyrightUpdate): { csProjFilePath: string; wasUpdated: boolean } {
		if (!existsSync(copyRightSettings.searchDirPath)) {
			console.log(
				`%cThe directory '${copyRightSettings.searchDirPath}' does not exist. The copyright was not updated.`,
				"color: yellow",
			);
			Deno.exit(0);
		}

		const fileEntries = Array.from(walkSync(copyRightSettings.searchDirPath, {
			includeDirs: false,
			includeFiles: true,
			skip: [/\.git/, /\.vscode/, /bin/, /obj/],
			exts: [".csproj"],
		}));

		const extension = extname(copyRightSettings.projectFileName);

		const csProjFileName = extension === ""
			? `${copyRightSettings.projectFileName}.csproj`
			: copyRightSettings.projectFileName;

		const foundEntry: WalkEntry | undefined = fileEntries.find((entry: WalkEntry) => entry.name === csProjFileName);

		if (foundEntry === undefined || foundEntry === null) {
			console.log(`%cThe csproj file '${csProjFileName}' does not exist.`, "color: yellow");
			return { csProjFilePath: "", wasUpdated: false };
		}

		const csProjFilePath = foundEntry.path;

		if (!existsSync(csProjFilePath)) {
			console.log(`%cThe csproj file '${csProjFilePath}' does not exist.`, "color: yellow");
			return { csProjFilePath: "", wasUpdated: false };
		}

		const fileContent = Deno.readTextFileSync(csProjFilePath);

		if (fileContent === undefined || fileContent === null || fileContent === "") {
			console.log("%cThe csproj file content is empty.", "color: yellow");
			return { csProjFilePath: "", wasUpdated: false };
		}

		const copyRightRegex = /<Copyright>[\s\S]*?<\/Copyright>/gm;

		const matchesResults = fileContent.match(copyRightRegex);

		if (matchesResults === null) {
			console.log(
				"%cNo matches found. Add a '<Copyright/>' tag to the csproj file or remove the 'dotnetCopyrightUpdate' setting.",
				"color: yellow",
			);
			return { csProjFilePath: "", wasUpdated: false };
		}

		const matches = Array.from(matchesResults);

		if (matches.length <= 0) {
			console.log(
				"%cNo matches found. Add a '<Copyright/>' tag to the csproj file or remove the 'dotnetCopyrightUpdate' setting.",
				"color: yellow",
			);
			return { csProjFilePath: "", wasUpdated: false };
		}

		const newTag = `<Copyright>Copyright ©${new Date().getFullYear()} Kinson Digital</Copyright>`;
		const newFileContent = fileContent.replace(copyRightRegex, newTag);

		Deno.writeTextFileSync(csProjFilePath, newFileContent);

		return { csProjFilePath, wasUpdated: true };
	}
}

/**
 * Updates versions in csharp project files.
 */
export class CSharpVersionUpdater {
	/**
	 * Updates the version in the csharp project file at the given {@link versionFilePath}.
	 * @param settings The prepare release settings.
	 * @param newVersion The new version.
	 * @throws {Error} Thrown for the following reasons:
	 * 1. If the csproj file does not exist.
	 * 2. If the csproj file does not contain a version XML element.
	 * 3. If the csproj file does not contain a file version XML element.
	 */
	public updateVersion(settings: PrepareReleaseSettings, newVersion: string): void {
		if (isStringNothing(newVersion)) {
			return;
		}

		// Remove the letter 'v' if it exists.  C# project files do not allow the letter 'v' in the version number.
		newVersion = newVersion.startsWith("v") ? newVersion.substring(1) : newVersion;

		const versionFilePath = settings.versionFilePath ?? "";

		if (!existsSync(versionFilePath, { isFile: true })) {
			throw new Error(`The version file path '${versionFilePath}' does not exist.`);
		}

		let versionFileContent = Deno.readTextFileSync(versionFilePath);

		const versionTagRegex = /<Version\s*>.*<\/Version\s*>/gm;
		const fileVersionTagRegex = /<FileVersion\s*>.*<\/FileVersion\s*>/gm;

		const versionTagExists = versionTagRegex.test(versionFileContent);

		if (!versionTagExists) {
			const errorMsg = `The csharp project file does not contain a version property.` +
				`\nExpected '<Version>...</Version>'`;
			throw new Error(errorMsg);
		}

		const fileVersionTagExists = fileVersionTagRegex.test(versionFileContent);

		if (!fileVersionTagExists) {
			const errorMsg = `The csharp project file does not contain a file version property.` +
				`\nExpected '<FileVersion>...</FileVersion>'`;
			throw new Error(errorMsg);
		}

		// Update the version files
		versionFileContent = versionFileContent.replace(versionTagRegex, `<Version>${newVersion}</Version>`);
		versionFileContent = versionFileContent.replace(fileVersionTagRegex, `<FileVersion>${newVersion}</FileVersion>`);

		Deno.writeTextFileSync(versionFilePath, versionFileContent);
	}
}
