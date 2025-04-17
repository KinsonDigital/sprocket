// <copyright file="IJsonService.cs" company="KinsonDigital">
// Copyright (c) KinsonDigital. All rights reserved.
// </copyright>

namespace KDAdmin.Abstractions;

public interface IJsonService
{
    T Deserialize<T>(string json);
}
