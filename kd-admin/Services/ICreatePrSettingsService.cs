// <copyright file="ICreatePrSettingsService.cs" company="KinsonDigital">
// Copyright (c) KinsonDigital. All rights reserved.
// </copyright>

namespace KDAdmin.Services;

using Settings;

/// <summary>
/// Gets local pull request setting data.
/// </summary>
public interface ICreatePrSettingsService
{
    /// <summary>
    /// Gets the settings for creating a pull request.
    /// </summary>
    /// <returns>The pull request settings.</returns>
    CreatePrSettings? GetSettings();
}
