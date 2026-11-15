"use client";

const HOUSE_EMOJI = "🏠";
const HOTEL_EMOJI = "🏨";
const HOTEL_THRESHOLD = 5;

const FONT_SIZE_BY_COUNT: Record<number, string> = {
    1: "11px",
    2: "10px",
    3: "8px",
    4: "7px"
};

/**
 * Renders houses or a hotel in a single row inside the color strip.
 * Font size scales down as count increases so all items fit without clipping.
 */
export default function BuildingTray({ numHouses }: { numHouses: number }) {
    if (numHouses === 0) return null;

    const isHotel = numHouses >= HOTEL_THRESHOLD;
    const count = Math.min(numHouses, 4);
    const emoji = isHotel ? HOTEL_EMOJI : HOUSE_EMOJI;
    const fontSize = isHotel ? "11px" : FONT_SIZE_BY_COUNT[count];

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "1px",
                width: "100%",
                height: "100%",
                overflow: "hidden"
            }}
        >
            {Array.from({ length: isHotel ? 1 : count }, (_, i) => (
                <span key={i} style={{ fontSize, lineHeight: 1, flexShrink: 0 }}>
                    {emoji}
                </span>
            ))}
        </div>
    );
}
