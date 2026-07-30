"use client";

import { Box } from "@mui/material";
import Board from "./board/board";
import { initialState, gameStateReducer } from "./GameState";
import React, { useReducer } from "react";

export default function GamePage() {
    const [state, dispatch] = useReducer(gameStateReducer, initialState);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh"
            }}
        >
            <Board />
        </Box>
    );
}
