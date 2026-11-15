"use client";

import { Property } from "../property/Property";
import { isOwnableProperty, OwnableProperty } from "../property/OwnableProperty";
import { Player } from "../player/Player";
import { PropertyType } from "../property/PropertyType";
import PieceTray from "./PieceTray";
import JailTray from "./JailTray";
import BuildingTray from "./BuildingTray";

const BOARD_MIN = 1;
const BOARD_MAX = 11;
const BOARD_BG = "#83d0e0";
const CELL_PX = 72;
const STRIP_PX = 19;

type StripSide = "top" | "bottom" | "left" | "right";

function getStripSide(row: number, col: number): StripSide {
    if (row === BOARD_MAX) return "top";
    if (row === BOARD_MIN) return "bottom";
    if (col === BOARD_MAX) return "left";
    return "right";
}

const STRIP_FLEX_DIRECTION: Record<StripSide, "column" | "column-reverse" | "row" | "row-reverse"> =
    {
        top: "column",
        bottom: "column-reverse",
        left: "row",
        right: "row-reverse"
    };

// col 1  (strip on right): reader stands left  → text bottom-to-top → rotate(90deg)
// col 11 (strip on left):  reader stands right → text top-to-bottom → rotate(-90deg)
const SIDE_ROTATION: Partial<Record<StripSide, string>> = {
    right: "rotate(90deg)",
    left: "rotate(-90deg)"
};

function ContentBlock({
    property,
    ownable,
    occupants,
    isSideCol
}: {
    property: Property | OwnableProperty;
    ownable: OwnableProperty | null;
    occupants: Player[];
    isSideCol: boolean;
}) {
    return (
        <div
            style={{
                // Pre-rotation width = cell height so text wraps correctly after rotation.
                // Height is auto on side cells; the outer overflow:hidden clips to available space.
                width: isSideCol ? CELL_PX : "100%",
                height: isSideCol ? "auto" : "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                // Non-ownable cells have no strip, so pad the top by the strip height
                // to keep the name vertically aligned with ownable cell names.
                paddingTop: ownable ? "3px" : `${STRIP_PX}px`,
                paddingBottom: "3px",
                paddingLeft: "4px",
                paddingRight: "4px",
                boxSizing: "border-box"
            }}
        >
            <span
                style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: "11px",
                    color: "black",
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    WebkitTextStroke: "0px"
                }}
            >
                {property.name}
            </span>

            {/* Always rendered — invisible on non-ownable cells to hold vertical space */}
            <span
                style={{
                    flexShrink: 0,
                    fontSize: "10px",
                    fontWeight: "700",
                    color: ownable ? "white" : "transparent",
                    backgroundColor: ownable ? "#333" : "transparent",
                    borderRadius: "4px",
                    padding: "1px 4px",
                    WebkitTextStroke: "0px"
                }}
            >
                {ownable ? `$${ownable.cost}` : "\u00A0\u00A0\u00A0\u00A0"}
            </span>

            <PieceTray occupants={occupants} />
        </div>
    );
}

export default function Cell({
    property,
    color,
    occupants = [],
    jailedOccupants = []
}: {
    property: Property | OwnableProperty;
    color: string | undefined;
    occupants?: Player[];
    jailedOccupants?: Player[];
}) {
    const ownable = isOwnableProperty(property) ? (property as OwnableProperty) : null;
    const isJailCell = property.type === PropertyType.JAIL;
    const stripSide = getStripSide(property.row, property.col);
    const isSideCol = stripSide === "left" || stripSide === "right";
    const rotation = SIDE_ROTATION[stripSide];

    const content = (
        <ContentBlock
            property={property}
            ownable={ownable}
            occupants={occupants}
            isSideCol={isSideCol}
        />
    );

    return (
        <div
            style={{
                gridRow: property.row,
                gridColumn: property.col,
                backgroundColor: BOARD_BG,
                border: "1px solid black",
                display: "flex",
                flexDirection: ownable ? STRIP_FLEX_DIRECTION[stripSide] : "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                overflow: "hidden"
            }}
        >
            {/* Jail tray — pinned to the top of the cell before all other content */}
            {isJailCell && <JailTray jailed={jailedOccupants} />}

            {ownable && (
                <div
                    style={{
                        backgroundColor: color,
                        flexShrink: 0,
                        width: isSideCol ? `${STRIP_PX}px` : "100%",
                        height: isSideCol ? "100%" : `${STRIP_PX}px`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        borderBottom: stripSide === "top" ? "1px solid rgba(0,0,0,0.3)" : undefined,
                        borderTop: stripSide === "bottom" ? "1px solid rgba(0,0,0,0.3)" : undefined,
                        borderRight: stripSide === "left" ? "1px solid rgba(0,0,0,0.3)" : undefined,
                        borderLeft: stripSide === "right" ? "1px solid rgba(0,0,0,0.3)" : undefined
                    }}
                >
                    {/* On side cells the strip is vertical, so counter-rotate so buildings read horizontally */}
                    <div
                        style={{
                            transform: isSideCol
                                ? stripSide === "left"
                                    ? "rotate(-90deg)"
                                    : "rotate(90deg)"
                                : undefined,
                            // Pre-rotation: width becomes physical height, height becomes physical width.
                            // We want physical width = STRIP_PX and physical height = CELL_PX,
                            // so set logical width = CELL_PX and logical height = STRIP_PX.
                            width: isSideCol ? CELL_PX : "100%",
                            height: isSideCol ? `${STRIP_PX}px` : "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                        }}
                    >
                        <BuildingTray numHouses={ownable.numHouses} />
                    </div>
                </div>
            )}

            {isSideCol ? (
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        width: "100%",
                        height: "100%"
                    }}
                >
                    <div style={{ transform: rotation }}>{content}</div>
                </div>
            ) : (
                content
            )}
        </div>
    );
}
