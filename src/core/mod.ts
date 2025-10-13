// git
import {
	branchExistsRemotely,
	createCheckoutBranch,
	createCommit,
	createPullRequest,
	getCurrentBranch,
	isCheckedOut,
	pushToRemote,
	stageAll,
} from "./git.ts";

// github
import { createPr, getAllIssueTypes, githubIssueExists } from "./github.ts";
import type { ErrorData, GitHubError } from "./github.ts";

// runner
import { runCmd, runFunction, runJob, runScript } from "./job-runner.ts";

// misc
import runCommandAsync from "./run-async.ts";
import { ConsoleLogColor } from "./console-log-color.ts";
import type { Task } from "./configuration.ts";

///////////////////////////////////////////////////////////////////////////

// git
export {
	branchExistsRemotely,
	createCheckoutBranch,
	createCommit,
	createPullRequest,
	getCurrentBranch,
	isCheckedOut,
	pushToRemote,
	stageAll,
};

// github
export { createPr, getAllIssueTypes, githubIssueExists };
export type { ErrorData, GitHubError };

// runner
export { runCmd, runFunction, runJob, runScript };

// misc
export { ConsoleLogColor, runCommandAsync };
export type { Task };
