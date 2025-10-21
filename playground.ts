import { createCheckoutBranch, createCommit, pushToRemote, stageFiles } from "./src/core/git.ts";
import jsrConfig from "./jsr.json" with { type: "json" };
import { printGray } from "./src/core/logging.ts";

const _workingDir = Deno.env.get("WORKING_DIR") ?? "";
const _ownerName = Deno.env.get("OWNER_NAME") ?? "";
const _repoName = Deno.env.get("REPO_NAME") ?? "";
const _token = Deno.env.get("GITHUB_TOKEN") ?? "";

const releaseVersion = "1.2.3";
const headBranch = "prod-release";

printGray(`⌛Creating the branch '${headBranch}'. . .`);
await createCheckoutBranch(headBranch);

jsrConfig.version = releaseVersion;
Deno.writeTextFileSync(`${Deno.cwd()}/jsr.json`, `${JSON.stringify(jsrConfig, null, 4)}\n`);

printGray("⌛Staging version changes. . .");
await stageFiles(["*jsr.json"]);
printGray("⌛Creating commit. . .");
await createCommit(`release: update version to v${releaseVersion}`);
printGray("⌛Pushing to remote. . .");
await pushToRemote(headBranch);

debugger;
