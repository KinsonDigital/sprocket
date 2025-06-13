const _workingDir = Deno.env.get("WORKING_DIR") ?? "";
const _token = Deno.env.get("GITHUB_TOKEN") ?? "";
const _ownerName = Deno.env.get("OWNER_NAME") ?? "";
const _repoName = Deno.env.get("REPO_NAME") ?? "";

const msg = "%cThis is a message";

if (msg.startsWith("%c")) {
	console.log(msg, "color:blue");
} else {
	console.log(msg);
}

debugger;
