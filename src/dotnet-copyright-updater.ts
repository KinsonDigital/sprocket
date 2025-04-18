import { existsSync, walkSync } from "jsr:@std/fs@1.0.11";
import { extname } from "../deps.ts";
import { DotnetCopyrightUpdate } from "./dotnet-copyright-update.ts";

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

		const foundEntries = fileEntries.find((entry) => entry.name === csProjFileName);

		if (foundEntries === undefined) {
			console.log(`%cThe csproj file '${csProjFileName}' does not exist.`, "color: yellow");
			return { csProjFilePath: "", wasUpdated: false };
		}

		const csProjFilePath = foundEntries.path;

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
