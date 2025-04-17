// <copyright file="ClientFactory.cs" company="KinsonDigital">
// Copyright (c) KinsonDigital. All rights reserved.
// </copyright>

namespace KDAdmin.Factories;

using System.Diagnostics.CodeAnalysis;
using Abstractions;
using Octokit;

[ExcludeFromCodeCoverage(Justification = "Factory used to product clients.")]
internal sealed class ClientFactory : IClientFactory
{
    public IGitHubClient CreateClient(string token)
    {
        ArgumentException.ThrowIfNullOrEmpty(token);

        var client = new GitHubClient(new ProductHeaderValue("kd-admin"));
        var tokeAuth = new Credentials(token);
        client.Credentials = tokeAuth;

        return client;
    }
}
