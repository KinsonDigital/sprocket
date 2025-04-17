// <copyright file="IClientFactory.cs" company="KinsonDigital">
// Copyright (c) KinsonDigital. All rights reserved.
// </copyright>

namespace KDAdmin.Factories;

using Octokit;

public interface IClientFactory
{
    IGitHubClient CreateClient(string token);
}
