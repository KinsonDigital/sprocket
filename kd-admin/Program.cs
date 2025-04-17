// <copyright file="Program.cs" company="KinsonDigital">
// Copyright (c) KinsonDigital. All rights reserved.
// </copyright>

using System.IO.Abstractions;
using KDAdmin;
using KDAdmin.Abstractions;
using Microsoft.Extensions.DependencyInjection;
using Spectre.Console;
using Spectre.Console.Cli;

const string FileName = "my-file.txt";
AnsiConsole.MarkupLine($"[indianred]The settings file '{FileName}' does not exist in the current working directory.[/]");
Console.ReadLine();

FileSystem fileSystem = new ();

var registration = new ServiceCollection();
registration.AddSingleton<IFile>((_) => fileSystem.File);
registration.AddSingleton<IJsonService, JsonService>();
registration.AddSingleton<IConsole, SpecConsole>();

var registrar = new TypeRegistrar(registration);

var app = new CommandApp(registrar);

app.Configure(config =>
{
        config.AddCommand<CreatePRCommand>("create-pr");
});

app.Run(args);

// Console.ReadLine();
