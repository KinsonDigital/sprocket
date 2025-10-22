<h1 align="center" style="color: mediumseagreen;font-weight: bold;">
sprocket Production Release Notes - v2.1.0
</h1>

<h2 align="center" style="font-weight: bold;">Features</h2>

1. [#91](https://github.com/KinsonDigital/sprocket/issues/91) - Added the following functions:
   - Created a function named `stageFiles` in the `git` module that stages files.
   - Created a function named `checkoutBranch` in the `git` module to checkout a branch.
   - Created a function named `uncommittedChangesExist` in the `git` module that checks if any uncommitted changes exist.
   - Created a function named `noUncommittedChangesExist` in the `git` module to check if no committed changes exist.
   - Created a function named `branchExistsLocally` in the `git` module that checks if a branch exists locally.
   - Created a function named `renameMilestone` in the `github` module that renames a GitHub milestone.
2. [#91](https://github.com/KinsonDigital/sprocket/issues/91) - Moved the function `createPullRequest` from the `git` module to the `github` module.


<h2 align="center" style="font-weight: bold;">Project-Config</h2>

1. [#91](https://github.com/KinsonDigital/sprocket/issues/91) - Created install scripts to easily install the tool into a project.
