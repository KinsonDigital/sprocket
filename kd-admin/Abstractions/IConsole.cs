// <copyright file="IConsole.cs" company="KinsonDigital">
// Copyright (c) KinsonDigital. All rights reserved.
// </copyright>

namespace KDAdmin.Abstractions;

public interface IConsole
{
    void MarkupLine(string value);

    void ErrorLine(string value);

    string ReadLine(string? msg = null);

    void MsgWhite(string msg);

    void MsgGray(string msg);

    string SelectionPrompt(string msg, string[] choices);
}
