"use client";

import React, { useReducer } from "react";
import { Box } from "@mui/material";
import Board from "./board/board";
import { getInitialState, gameStateReducer } from "./state/gameStateReducer";
import { getBoardConfig } from "@/app/setup/boards/boardRegistry";
import { GameConfig } from "@/app/setup/GameConfig";
import { toGameStateVM } from "./hydration";
import { PlayerConfig, PlayerDTO } from "./player/Player";

// Temporary: instantiate a default config directly until the setup page passes one in.
const devGameConfig: GameConfig = {
    boardId: "custom",
    startSalary: 2000,
    shouldLimitJailPrivileges: false,
    incomeTaxRate: 0.1,
    wealthTaxRate: 0.15,
    auctionTimeDuration: 30
};

// Temporary: dev players for local rendering until the lobby wires up real players.
const devPlayerConfigs: Record<number, PlayerConfig> = {
    0: { id: 0, name: "Alice", piece: "🎩", colour: "#e74c3c" },
    1: { id: 1, name: "Bob", piece: "🚂", colour: "#3498db" },
    2: { id: 2, name: "Charlie", piece: "🐶", colour: "#2ecc71" },
    3: { id: 3, name: "Diana", piece: "⚓", colour: "#f39c12" }
};

const devPlayerDTOs: Record<number, PlayerDTO> = {
    0: {
        id: 0,
        balance: 1500,
        isInJail: false,
        isOnVacation: false,
        numJailFreeCards: 0,
        boardPosition: 0,
        jailTurnsElapsed: 0,
        doublesRolled: 0,
        stage: "ROLL_DICE",
        isHost: true
    },
    1: {
        id: 1,
        balance: 1500,
        isInJail: false,
        isOnVacation: false,
        numJailFreeCards: 0,
        boardPosition: 23,
        jailTurnsElapsed: 0,
        doublesRolled: 0,
        stage: "WAITING",
        isHost: false
    },
    2: {
        id: 2,
        balance: 1500,
        isInJail: false,
        isOnVacation: false,
        numJailFreeCards: 0,
        boardPosition: 10,
        jailTurnsElapsed: 0,
        doublesRolled: 0,
        stage: "WAITING",
        isHost: false
    },
    3: {
        id: 3,
        balance: 1500,
        isInJail: true,
        isOnVacation: false,
        numJailFreeCards: 0,
        boardPosition: 10,
        jailTurnsElapsed: 1,
        doublesRolled: 0,
        stage: "WAITING",
        isHost: false
    }
};

const devInitialState = getInitialState(devPlayerDTOs, devGameConfig);

// Temporary: seed a couple of owned properties so building trays are visible in dev.
// Tel Aviv (pos 1): 2 houses. Pretoria (pos 39): hotel (numHouses = 5).
devInitialState.ownedProperties = {
    1: {
        position: 1,
        owner: 0,
        numHouses: 2,
        isMortgaged: false,
        baseRent: 10,
        rent: 30,
        cost: 10
    },
    39: {
        position: 39,
        owner: 1,
        numHouses: 5,
        isMortgaged: false,
        baseRent: 90,
        rent: 540,
        cost: 180
    },
    11: {
        position: 11,
        owner: 2,
        numHouses: 4,
        isMortgaged: false,
        baseRent: 30,
        rent: 150,
        cost: 60
    }
};

export default function GamePage() {
    const [state, dispatch] = useReducer(gameStateReducer, devInitialState);
    const boardConfig = getBoardConfig(state.boardId);

    // Hydrate the lean server state into a full view model for the UI.
    const vm = toGameStateVM(state, boardConfig.properties, devPlayerConfigs, 0);

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
            <Board board={vm.board} blockColors={blockColors} players={vm.players} />
        </Box>
    );
}
