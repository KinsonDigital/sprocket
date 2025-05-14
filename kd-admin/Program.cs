// <copyright file="Program.cs" company="KinsonDigital">
// Copyright (c) KinsonDigital. All rights reserved.
// </copyright>

using System.IO.Abstractions;
using KDAdmin;
using KDAdmin.Abstractions;
using Microsoft.Extensions.DependencyInjection;
using Octokit;
using Spectre.Console;
using Spectre.Console.Cli;

// var client = new GitHubClient(new ProductHeaderValue("kd-admin"));
// var basicAuth = new Credentials("");
// client.Credentials = basicAuth;
//
// try
// {
//     var issue = await client.Issue.Get("KinsonDigital", "Velaptor", 11067);
// }
// catch (Exception e)
// {
//     throw;
// }
//
// return;





return 0;

FileSystem fileSystem = new ();

var registration = new ServiceCollection();
registration.AddSingleton<IFile>((_) => fileSystem.File);
registration.AddSingleton<IJsonService, JsonService>();
registration.AddSingleton<IConsole, SpecConsole>();
registration.AddSingleton<IEnv, Env>();

var registrar = new TypeRegistrar(registration);

var app = new CommandApp(registrar);

app.Configure(config =>
{
        config.AddCommand<CreatePRCommand>("create-pr");
});

app.Run(args);

// Console.ReadLine();

