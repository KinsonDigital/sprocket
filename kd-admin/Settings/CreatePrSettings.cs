// <copyright file="CreatePrSettings.cs" company="KinsonDigital">
// Copyright (c) KinsonDigital. All rights reserved.
// </copyright>

using System.Text.Json.Serialization;

namespace KDAdmin.Settings;

public class CreatePrSettings
{
	[JsonRequired]
	public string OwnerName { get; set; }

	[JsonRequired]
	public string RepoName { get; set; }

	[JsonRequired]
	public string GitHubTokenEnvVarName { get; set; }

	[JsonRequired]
	public string[] BaseBranches { get; set; }
}
