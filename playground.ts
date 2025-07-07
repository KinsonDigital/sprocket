import { githubIssueExists } from "./src/core/github.ts";

const _workingDir = Deno.env.get("WORKING_DIR") ?? "";
const _ownerName = Deno.env.get("OWNER_NAME") ?? "";
const _repoName = Deno.env.get("REPO_NAME") ?? "";
const _token = Deno.env.get("GITHUB_TOKEN") ?? "";


const exists = await githubIssueExists(_ownerName, _repoName, 456548, _token);


debugger;
