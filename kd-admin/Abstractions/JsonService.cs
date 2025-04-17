// <copyright file="JsonService.cs" company="KinsonDigital">
// Copyright (c) KinsonDigital. All rights reserved.
// </copyright>

namespace KDAdmin.Abstractions;

using System.Diagnostics.CodeAnalysis;
using System.Text.Json;

[ExcludeFromCodeCoverage(Justification = "A thin wrapper around JSON serialization.")]
internal sealed class JsonService : IJsonService
{
    public T Deserialize<T>(string json) => JsonSerializer.Deserialize<T>(json);
}
