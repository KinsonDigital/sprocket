<h1 align="center" style="color: mediumseagreen;font-weight: bold;">
sprocket Production Release Notes - v3.0.0
</h1>

<h2 align="center" style="font-weight: bold;">Enhancements 💎</h2>

1. [#102](https://github.com/KinsonDigital/sprocket/issues/102) - Improved the install process.

<h2 align="center" style="font-weight: bold;">New Features ✨</h2>

1. [#103](https://github.com/KinsonDigital/sprocket/issues/103) - Exported the `ReleaseNotesGenerator` to make it available for users.

<h2 align="center" style="font-weight: bold;">Breaking Changes 🧨</h2>

1. [#103](https://github.com/KinsonDigital/sprocket/issues/103) - Introduced the following breaking changes:
    - Moved the `ReleaseType` interface to the releases module.
    - Changed the `ReleaseType` from an interface to a type.
    - Changed the `PrepareReleaseSettings` from an interface to a type.
    - Changed the `GeneratorSettings` from an interface to a type.
    - Changed the `GeneratorSettings` from an interface to a type.
    - Changed the `JsrMetaModel` from an interface to a type.
    - Changed the `Command` from an interface to a type.
    - Changed the `Script` from an interface to a type.
    - Changed the `Job` from an interface to a type.
    - Changed the `SprocketConfig` from an interface to a type.
    - Changed the `DotnetCopyrightUpdate` from an interface to a type.
    - Changed the `GitHubError` from an interface to a type.
    - Changed the `ErrorData` from an interface to a type.
    - Changed the `LabelModel` from an interface to a type.
    - Changed the `MilestoneModel` from an interface to a type.
    - Changed the `PullRequestHeadOrBaseModel` from an interface to a type.
    - Changed the `UserModel` from an interface to a type.
    - Changed the `PullRequestInfoModel` from an interface to a type.
    - Changed the `PullRequestModel` from an interface to a type.
    - Changed the `RepoModel` from an interface to a type.
    - Changed the `IssueTypeModel` from an interface to a type.

<h2 align="center" style="font-weight: bold;">Project Config 🛠️</h2>

1. [#104](https://github.com/KinsonDigital/sprocket/issues/104) - Added badges to the project readme.
2. [#101](https://github.com/KinsonDigital/sprocket/issues/101) - Improved the release workflow by adding the ability to auto-create a new `vnext` milestone after the release has completed.
