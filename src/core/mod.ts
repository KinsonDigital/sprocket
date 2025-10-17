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
import { runCmd, runFunction, runJob, runScript } from "./runners.ts";

// misc
import { runCommandAsync } from "./utils.ts";
import { printBlue, printCyan, printGray, printGreen, printIndianRed, printMediumSeaGreen, printRed, printYellow } from "./logging.ts";
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
export { printBlue, printCyan, printGray, printGreen, printIndianRed, printMediumSeaGreen, printRed, printYellow }
export { runCommandAsync };
export type { Task };
