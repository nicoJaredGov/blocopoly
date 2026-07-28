'use client'

import { Box } from "@mui/material"
import Board from "./board/board"

export default function GamePage() {
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
    )
}