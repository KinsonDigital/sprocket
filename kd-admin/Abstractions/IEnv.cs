// <copyright file="IEnv.cs" company="KinsonDigital">
// Copyright (c) KinsonDigital. All rights reserved.
// </copyright>

namespace KDAdmin.Abstractions;

public interface IEnv
{
    string? GetEnvironmentVariable(string variable);
}
