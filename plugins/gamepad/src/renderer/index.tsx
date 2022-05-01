import { IPluginRenderer, Renderer, SettingsRegistration, ShareMode } from "@rrox/api";
import React from "react";
import { GamepadSettingsPage } from "./settings";
import {LoadListener, UnloadListener} from "./listener";

export default class AutosaveRenderer extends Renderer {
    public load( renderer: IPluginRenderer ): void | Promise<void> {
        renderer.register( SettingsRegistration, {
            category: [ 'Gamepad' ],
            element : <GamepadSettingsPage />
        });

        LoadListener(renderer);
    }
    public unload( renderer: IPluginRenderer ): void | Promise<void> {
        UnloadListener();
    }
}