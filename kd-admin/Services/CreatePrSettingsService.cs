// <copyright file="CreatePrSettingsService.cs" company="KinsonDigital">
// Copyright (c) KinsonDigital. All rights reserved.
// </copyright>

namespace KDAdmin.Services;

using System.IO.Abstractions;
using Settings;
using System.Text.Json;
using Abstractions;

internal sealed class CreatePrSettingsService : ICreatePrSettingsService
{
    private const string FileName = "create-pr-settings.json";
    private readonly IFile _file;
    private readonly IConsole _console;
    private readonly IJsonService _jsonService;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreatePrSettingsService"/> class.
    /// </summary>
    /// <param name="file">Provides file operations.</param>
    /// <param name="console">Prints text to the console.</param>
    public CreatePrSettingsService(IFile file, IConsole console, IJsonService jsonService)
    {
        _file = file;
        _console = console;
        _jsonService = jsonService;
    }

    public CreatePrSettings? GetSettings()
    {
        const string filePath = $"./dev-tools/{FileName}";

        if (!_file.Exists(filePath))
        {
            _console.MarkupLine($"[indianred]The settings file '{FileName}' does not exist in the current working directory.[/]");
            return null;
        }

        var jsonData = _file.ReadAllText(filePath);
        var result = _jsonService.Deserialize<CreatePrSettings>(jsonData);

        return result;
    }
}
