"use client";

import { Player } from "../player/Player";

const MAX_PIECES = 4;
const BAR_WIDTH = 4;
const BAR_COLOR = "#444";
const TRAY_HEIGHT = 32;
const PIECE_SIZE = 20;

/**
 * Jail bars tray pinned to the top of the jail cell.
 * Each of the 4 slots is a flex:1 div so pieces are always centred in their slot.
 * The bar layer is rendered after pieces in DOM order so it paints on top.
 */
export default function JailTray({ jailed }: { jailed: Player[] }) {
    const pieces = jailed.slice(0, MAX_PIECES);

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: `${TRAY_HEIGHT}px`,
                flexShrink: 0,
                backgroundColor: "rgba(0,0,0,0.1)",
                overflow: "hidden",
                boxSizing: "border-box"
            }}
        >
            {/* Pieces — each slot takes equal width, piece centred inside */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "row"
                }}
            >
                {Array.from({ length: MAX_PIECES }).map((_, i) => {
                    const player = pieces[i];
                    return (
                        <div
                            key={player?.id ?? i}
                            style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            {player && (
                                <div
                                    title={`${player.name} (in jail)`}
                                    style={{
                                        width: `${PIECE_SIZE}px`,
                                        height: `${PIECE_SIZE}px`,
                                        borderRadius: "50%",
                                        backgroundColor: player.colour,
                                        border: "1.5px solid rgba(0,0,0,0.5)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "10px",
                                        lineHeight: 1,
                                        flexShrink: 0,
                                        boxSizing: "border-box"
                                    }}
                                >
                                    {player.piece}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Bars — rendered after pieces so they paint on top */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                {Array.from({ length: MAX_PIECES + 1 }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: `${(i / MAX_PIECES) * 100}%`,
                            width: `${BAR_WIDTH}px`,
                            transform: "translateX(-50%)",
                            backgroundColor: BAR_COLOR
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
