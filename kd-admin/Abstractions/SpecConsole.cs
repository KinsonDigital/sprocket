// <copyright file="SpecConsole.cs" company="KinsonDigital">
// Copyright (c) KinsonDigital. All rights reserved.
// </copyright>

namespace KDAdmin.Abstractions;

using System.Diagnostics.CodeAnalysis;
using Spectre.Console;

[ExcludeFromCodeCoverage(Justification = "A thin wrapper around console operations.")]
internal sealed class SpecConsole : IConsole
{
    public void MarkupLine(string value) => AnsiConsole.MarkupLine(value);

    public void ErrorLine(string value) => MarkupLine($"[indianred]{value}[/]");

    public string ReadLine(string? msg = null)
    {
        if (!string.IsNullOrEmpty(msg))
        {
            AnsiConsole.Markup($"[white]{msg}[/]");
        }

        return Console.ReadLine() ?? string.Empty;
    }

    public void MsgWhite(string msg) => MarkupLine($"[white]{msg}[/]");

    public void MsgGray(string msg) => MarkupLine($"[grey]{msg}[/]");

    public string SelectionPrompt(string msg, string[] choices)
    {
        MsgWhite(msg);
        var choice = AnsiConsole.Prompt(new SelectionPrompt<string>()
            .AddChoices(choices));

        return choice;
    }
}
