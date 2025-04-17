// <copyright file="CreatePrSettingsServiceTests.cs" company="KinsonDigital">
// Copyright (c) KinsonDigital. All rights reserved.
// </copyright>

namespace KDAdminTests;

using System.IO.Abstractions;
using KDAdmin;
using KDAdmin.Abstractions;
using KDAdmin.Services;
using KDAdmin.Settings;
using NSubstitute;
using Shouldly;

/// <summary>
/// Tests the <see cref="CreatePrSettingsService"/>
/// </summary>
public class CreatePrSettingsServiceTests
{
    private const string FilePath = $"./dev-tools/create-pr-settings.json";
    private readonly IFile _mockFile = Substitute.For<IFile>();
    private readonly IConsole _mockConsole = Substitute.For<IConsole>();
    private readonly IJsonService _mockJsonService = Substitute.For<IJsonService>();

    [Fact]
    public void GetSettings_WhenSettingsDoesNotExist_PrintsError()
    {
        // Arrange
        _mockFile.Exists(FilePath).Returns(false);

        var sut = CreateSystemUnderTest();

        // Act
        var actual = sut.GetSettings();

        // Assert
        _mockConsole.MarkupLine("[indianred]The settings file 'create-pr-settings.json' does not exist in the current working directory.[/]");
        actual.ShouldBeNull();
    }

    [Fact]
    public void GetSettings_WhenSettingsExist_ReturnsSettings()
    {
        // Arrange
        var expected = new CreatePrSettings
        {
            OwnerName = "KinsonDigital",
            RepoName = "kd-admin",
            BaseBranches = ["main", "preview"],
            GitHubTokenEnvVarName = "GITHUB_TOKEN",
        };

        _mockFile.Exists(FilePath).Returns(true);
        _mockFile.ReadAllText(FilePath).Returns("test-json-data");
        _mockJsonService.Deserialize<CreatePrSettings>("test-json-data").Returns(expected);

        var sut = CreateSystemUnderTest();

        // Act
        var actual = sut.GetSettings();

        // Assert
        actual.ShouldBeEquivalentTo(expected);
    }

    [Fact]
    public void GetSettings_WhenInvoked_ReturnsSettings()
    {
    }

    /// <summary>
    /// Creates a new instance of <see cref="CreatePrSettingsService"/> for the purpose of testing.
    /// </summary>
    /// <returns>The instance to test.</returns>
    private CreatePrSettingsService CreateSystemUnderTest() => new (_mockFile, _mockConsole, _mockJsonService);
}
