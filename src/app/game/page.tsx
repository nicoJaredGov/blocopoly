"use client";

import { Box } from "@mui/material";
import Board from "./board/board";
import { getInitialState, gameStateReducer } from "./GameState";
import { customProperties } from "./board/board_configs/customBoard";
import { toGameStateVM } from "./viewModels";
import React, { useReducer } from "react";

// Temporary: initialise with no players for local dev rendering.
// In production, state arrives from the WebSocket server and playerConfigs
// are provided by the lobby/session setup.
const devInitialState = getInitialState({});

export default function GamePage() {
    const [state, dispatch] = useReducer(gameStateReducer, devInitialState);

    // Hydrate the lean server state into a full view model for the UI.
    // customProperties is the static board config loaded once at startup.
    const vm = toGameStateVM(state, customProperties, {});

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh"
            }}
        >
            <Board board={vm.board} />
        </Box>
    );
}
