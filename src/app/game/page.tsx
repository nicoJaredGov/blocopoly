"use client";

import React, { useReducer } from "react";
import { Box } from "@mui/material";
import Board from "./board/board";
import { getInitialState, gameStateReducer } from "./state/gameStateReducer";
import { getBoardConfig } from "@/app/setup/boards/boardRegistry";
import { GameConfig } from "@/app/setup/GameConfig";
import { toGameStateVM } from "./hydration";

// Temporary: instantiate a default config directly until the setup page passes one in.
const devGameConfig: GameConfig = {
    boardId: "custom",
    startSalary: 2000,
    shouldLimitJailPrivileges: false,
    incomeTaxRate: 0.1,
    wealthTaxRate: 0.15,
    auctionTimeDuration: 30
};

// Temporary: initialise with no players for local dev rendering.
// In production, state arrives from the WebSocket server and playerConfigs
// are provided by the lobby/session setup.
const devInitialState = getInitialState({}, devGameConfig);

export default function GamePage() {
    const [state, dispatch] = useReducer(gameStateReducer, devInitialState);
    const boardConfig = getBoardConfig(state.boardId);

    // Hydrate the lean server state into a full view model for the UI.
    const vm = toGameStateVM(state, boardConfig.properties, {}, 0);

    // Derive a flat blockId → color map for the board renderer.
    const blockColors: Record<number, string> = Object.fromEntries(
        Object.entries(boardConfig.propertyBlocks).map(([id, block]) => [id, block.color])
    );

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh"
            }}
        >
            <Board board={vm.board} blockColors={blockColors} />
        </Box>
    );
}
