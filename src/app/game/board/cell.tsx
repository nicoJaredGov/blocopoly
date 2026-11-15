"use client";

import { Property } from "../property/Property";
import { isOwnableProperty, OwnableProperty } from "../property/OwnableProperty";

export default function Cell({
    property,
    color
}: {
    property: Property | OwnableProperty;
    color: string | undefined;
}) {
    const ownable = isOwnableProperty(property) ? property : null;

    return (
        <div
            style={{
                gridRow: property.row,
                gridColumn: property.col,
                backgroundColor: color ?? "#83d0e0",
                border: "1px solid black",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                textAlign: "center",
                color: color == "black" ? "white" : "black",
                WebkitTextStroke: "0.2px black",
                padding: "2px",
                width: "100%",
                height: "100%",
                boxSizing: "border-box"
            }}
        >
            {ownable && (
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        fontWeight: "bold",
                        backgroundColor: "rgba(255,255,255,0.55)",
                        color: "black",
                        WebkitTextStroke: "0px",
                        borderRadius: "3px",
                        padding: "0px 3px",
                        width: "40px",
                        marginTop: "2px",
                        marginBottom: "2px"
                    }}
                >
                    ${ownable.cost}
                </span>
            )}
            <span
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    width: "100%"
                }}
            >
                {property.name}
            </span>
        </div>
    );
}
