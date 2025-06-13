import denoConfig from "../deno.json" with { type: "json" };

export function updateVersion(version: string): { changeWasMade: boolean } {
	version = version.trim().toLocaleLowerCase();
	version = version.startsWith("v") ? version.substring(1) : version;

	if (denoConfig.version === version) {
		 return { changeWasMade: false };
	}

	denoConfig.version = version;
	Deno.writeTextFileSync(`${Deno.cwd()}/src-tauri/tauri.conf.json`, `${JSON.stringify(denoConfig, null, 4)}\n`);

	return {  changeWasMade: true };
}
