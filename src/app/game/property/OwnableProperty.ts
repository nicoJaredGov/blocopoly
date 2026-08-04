import { PropertyTypeValue } from "./PropertyType";

/**
 * Serialized ownable property state — only mutable fields sent over the wire.
 * Static config (row, col, name, type, blockId, baseRentWeighting) lives in OwnablePropertyVM.
 */
export interface OwnablePropertyDTO {
    /** Board position (0–39) — used as the key to look up static config on the client */
    position: number;
    numHouses: number;
    isMortgaged: boolean;
    /** Player id of the owner, or undefined if unowned */
    owner: number | undefined;
    baseRent: number;
    rent: number;
}

/**
 * Client-side view model — merges serialized OwnableProperty state with static
 * config loaded once at session start from the board config.
 */
export interface OwnableProperty extends OwnablePropertyDTO {
    // Grid position (for rendering)
    row: number;
    col: number;
    name: string;
    type: PropertyTypeValue;
    blockId: number;
    /** Weighting used to derive baseRent from the game's marketCap setting */
    baseRentWeighting: number;
}

export function isOwnableProperty(p: object): p is OwnableProperty {
    return typeof (p as OwnableProperty).blockId === "number";
}

export function buyProperty(
    property: OwnablePropertyDTO,
    playerId: number,
    marketCap: number,
    baseRentWeighting: number
): OwnablePropertyDTO {
    const baseRent = marketCap * (baseRentWeighting / 100);
    return { ...property, owner: playerId, baseRent, rent: baseRent };
}

export function buyHouse(
    property: OwnablePropertyDTO,
    hasWholeBlock: boolean,
    baseRent: number
): OwnablePropertyDTO {
    if (property.numHouses >= 5) return property;
    const numHouses = property.numHouses + 1;
    const rent = baseRent * numHouses * (hasWholeBlock ? 2 : 1);
    return { ...property, numHouses, rent };
}
