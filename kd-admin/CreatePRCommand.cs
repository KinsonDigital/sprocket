// <copyright file="CreatePRCommand.cs" company="KinsonDigital">
// Copyright (c) KinsonDigital. All rights reserved.
// </copyright>

using Spectre.Console.Cli;

namespace KDAdmin;

using System.Text.RegularExpressions;
using Abstractions;
using Factories;
using Octokit;
using Services;

internal sealed class CreatePRCommand : AsyncCommand<FileCommandSettings>
{
    private readonly ICreatePrSettingsService _prSettingsService;
    private readonly IConsole _console;
    private readonly IEnv _env;
    private readonly IClientFactory _clientFactory;

    public CreatePRCommand(
        ICreatePrSettingsService prSettingsService,
        IConsole console,
        IEnv env,
        IClientFactory clientFactory)
    {
        _prSettingsService = prSettingsService;
        _console = console;
        _env = env;
        _clientFactory = clientFactory;
    }

    public override async Task<int> ExecuteAsync(CommandContext context, FileCommandSettings fileCmdSettings)
    {
        var settings = _prSettingsService.GetSettings();

        var issueNumValue = _console.ReadLine("Enter the issue number: ");

        if (string.IsNullOrEmpty(issueNumValue))
        {
            _console.ErrorLine("The issue number cannot be empty.");

            return 1;
        }

        var success = int.TryParse(issueNumValue, out var issueNum);

        if (!success)
        {
            _console.ErrorLine($"The issue number '{issueNumValue}' must be a number.");

            return 1;
        }

        var envName = settings?.GitHubTokenEnvVarName ?? string.Empty;
        var token = _env.GetEnvironmentVariable(envName);

        if (string.IsNullOrEmpty(token))
        {
            var errorMsg = $"The environment variable '{envName}' does not exist." +
                           "Check your 'create-pr-settings.json' settings file.";
            _console.ErrorLine(errorMsg);

            return 1;
        }

        var client = _clientFactory.CreateClient(token);

        Issue? issue;
        var ownerName = settings?.OwnerName ?? string.Empty;
        var repoName = settings?.RepoName ?? string.Empty;

        try
        {
            issue = await client.Issue.Get(ownerName, repoName, issueNum);
        }
        catch (NotFoundException e)
        {
            _console.ErrorLine($"The issue number '{issueNum}' does not exist.");

            return 1;
        }

        if (issue.State == ItemState.Closed)
        {
            _console.ErrorLine($"The issue with number '{issueNum}' is closed.\nPlease choose another open issue.");

            return 1;
        }

        var chosenHeadBranch = _console.ReadLine("Enter a head branch name:");

        _console.MsgGray($"Checking that the head branch '{chosenHeadBranch}' does not exist . . .");

        var branchRegex = new Regex("^feature\\/([1-9][0-9]*)-(?!-)[a-z-]+$");

        if (!branchRegex.IsMatch(chosenHeadBranch))
        {
            var errorMsg = $"The head branch name '{chosenHeadBranch}' is invalid." +
                           " It should match he pattern: 'feature/<issue-number>-<branch-name>'";
            _console.ErrorLine(errorMsg);

            return 1;
        }

        _console.MsgGray($"Head branch name '{chosenHeadBranch}' does not exist.");

        try
        {
            await client.Git.Reference.Get(ownerName, repoName, chosenHeadBranch);
        }
        catch (NotFoundException e)
        {
            _console.ErrorLine($"The head branch '{chosenHeadBranch}' exists in the remote repository.");

            return 1;
        }

        var chosenBaseBranch = _console.SelectionPrompt("Choose a base branch:", settings?.BaseBranches ?? []);

        _console.MsgGray($"Checking that the base branch '{chosenBaseBranch}' exists . . .");

        return 0;
    }
}
