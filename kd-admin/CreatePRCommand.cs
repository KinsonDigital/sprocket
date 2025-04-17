// <copyright file="CreatePRCommand.cs" company="KinsonDigital">
// Copyright (c) KinsonDigital. All rights reserved.
// </copyright>

using Spectre.Console.Cli;

namespace KDAdmin;

internal class CreatePRCommand : Command<FileCommandSettings>
{
    public CreatePRCommand()
    {
    }

    public override int Execute(CommandContext context, FileCommandSettings settings)
    {
        return 0;
    }
}
