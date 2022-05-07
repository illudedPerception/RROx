import { IPluginRenderer, Renderer, SettingsRegistration } from "@rrox/api";
import React from "react";
import { GamepadSettingsPage } from "./settings";
import {LoadListener, UnloadListener} from "./listener";
import { registerCommunicator } from "../shared/communicator";

export default class AutosaveRenderer extends Renderer {
    public load( renderer: IPluginRenderer ): void | Promise<void> {
        renderer.register( SettingsRegistration, {
            category: [ 'Gamepad' ],
            element : <GamepadSettingsPage />
        });

        LoadListener(renderer);
        registerCommunicator(renderer);
    }
    public unload( renderer: IPluginRenderer ): void | Promise<void> {
        UnloadListener();
    }
}
