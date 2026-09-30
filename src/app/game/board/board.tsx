"use client";

import { Box } from "@mui/material";
import Cell from "./cell";
import { isOwnableProperty, OwnableProperty } from "../property/OwnableProperty";
import { Property } from "../property/Property";

interface BoardProps {
    board: (Property | OwnableProperty)[];
    blockColors: Record<string, string>;
}

export default function Board({ board, blockColors }: BoardProps) {
    return (
        <Box
            style={{
                backgroundColor: "#83d0e0",
                display: "grid",
                gridTemplateColumns: "90px repeat(9, 58px) 90px",
                gridTemplateRows: "90px repeat(9, 58px) 90px",
                gap: "0px",
                border: "1px solid black",
                width: "fit-content",
                margin: "10px"
            }}
        >
            {board.map((property, index) => {
                const color = isOwnableProperty(property)
                    ? blockColors[property.blockId]
                    : undefined;

                return <Cell key={index} property={property} color={color} />;
            })}
        </Box>
    );
}
