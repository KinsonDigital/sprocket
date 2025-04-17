// <copyright file="Env.cs" company="KinsonDigital">
// Copyright (c) KinsonDigital. All rights reserved.
// </copyright>

namespace KDAdmin.Abstractions;

using System.Diagnostics.CodeAnalysis;

[ExcludeFromCodeCoverage(Justification = "A thin wrapper around environment variable operations.")]
public class Env : IEnv
{
    public string? GetEnvironmentVariable(string variable) => Environment.GetEnvironmentVariable(variable);
}
