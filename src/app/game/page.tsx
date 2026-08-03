"use client";

import { Box } from "@mui/material";
import Board from "./board/board";
import { getInitialState, gameStateReducer } from "./GameState";
import { customProperties } from "./board/board_configs/customBoard";
import React, { useReducer } from "react";

// Temporary: initialise with no players for local dev rendering.
// In production this state will arrive from the WebSocket server.
const devInitialState = getInitialState([], customProperties);

export default function GamePage() {
    const [state, dispatch] = useReducer(gameStateReducer, devInitialState);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh"
            }}
        >
            <Board board={state.board} />
        </Box>
    );
}
