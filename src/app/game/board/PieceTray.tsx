"use client";

import { Player } from "../player/Player";

/**
 * Renders a row of up to 4 player pieces at the bottom of a board cell.
 * Each piece is a small colored circle containing the player's piece character.
 */
export default function PieceTray({ occupants }: { occupants: Player[] }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "2px",
                width: "100%",
                flexWrap: "nowrap",
                height: "18px",
                flexShrink: 0,
                boxSizing: "border-box",
                padding: "2px 0 1px"
            }}
        >
            {occupants.slice(0, 4).map((player) => (
                <div
                    key={player.id}
                    title={player.name}
                    style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        backgroundColor: player.colour,
                        border: "1.5px solid rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "9px",
                        lineHeight: 1,
                        flexShrink: 0,
                        boxSizing: "border-box"
                    }}
                >
                    {player.piece}
                </div>
            ))}
        </div>
    );
}
