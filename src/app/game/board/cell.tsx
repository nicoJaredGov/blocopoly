"use client";

import { Property } from "../property/Property";

export default function Cell({
    property,
    color
}: {
    property: Property;
    color: string | undefined;
}) {
    return (
        <div
            style={{
                gridRow: property.row,
                gridColumn: property.col,
                backgroundColor: color ?? "#83d0e0",
                border: "1px solid black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                textAlign: "center",
                color: color == "black" ? "white" : "black",
                WebkitTextStroke: "0.2px black",
                padding: "2px",
                width: "100%",
                height: "100%",
                boxSizing: "border-box"
            }}
        >
            {property.name}
        </div>
    );
}
