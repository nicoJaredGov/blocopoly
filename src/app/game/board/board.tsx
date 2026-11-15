"use client";

import { Box } from "@mui/material";
import Cell from "./cell";
import { isOwnableProperty, OwnableProperty } from "../property/OwnableProperty";
import { Property } from "../property/Property";
import { Player } from "../player/Player";
import { PropertyType } from "../property/PropertyType";

interface BoardProps {
    board: (Property | OwnableProperty)[];
    blockColors: Record<string, string>;
    players?: Record<number, Player>;
}

export default function Board({ board, blockColors, players = {} }: BoardProps) {
    const occupantsByPosition: Record<number, Player[]> = {};
    const jailedPlayers: Player[] = [];

    for (const player of Object.values(players)) {
        const pos = player.boardPosition;
        if (!occupantsByPosition[pos]) occupantsByPosition[pos] = [];
        // Jailed players show only in the jail tray, not the regular piece tray
        if (player.isInJail) {
            jailedPlayers.push(player);
        } else {
            occupantsByPosition[pos].push(player);
        }
    }

    return (
        <Box
            style={{
                backgroundColor: "#83d0e0",
                display: "grid",
                gridTemplateColumns: "112px repeat(9, 72px) 112px",
                gridTemplateRows: "112px repeat(9, 72px) 112px",
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
                const occupants = occupantsByPosition[property.position] ?? [];

                return (
                    <Cell
                        key={index}
                        property={property}
                        color={color}
                        occupants={occupants}
                        jailedOccupants={
                            property.type === PropertyType.JAIL ? jailedPlayers : undefined
                        }
                    />
                );
            })}
        </Box>
    );
}
