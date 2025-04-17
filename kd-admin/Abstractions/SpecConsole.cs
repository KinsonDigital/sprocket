// <copyright file="SpecConsole.cs" company="KinsonDigital">
// Copyright (c) KinsonDigital. All rights reserved.
// </copyright>

namespace KDAdmin.Abstractions;

using Spectre.Console;

public class SpecConsole : IConsole
{
    public void MarkupLine(string value) => AnsiConsole.MarkupLine(value);
}
