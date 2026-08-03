import { PropertyTypeValue } from "./PropertyType";

/**
 * Represents a property that can be owned, mortgaged, and built on.
 * This is a plain data interface — all mutations are handled by pure
 * functions in the reducer, not by methods on this type.
 */
export interface OwnableProperty {
    // Grid position (for rendering)
    row: number;
    col: number;
    // Board position (0-39)
    position: number;
    name: string;
    type: PropertyTypeValue;
    blockId: number;
    /** Weighting used to derive baseRent from the game's marketCap setting */
    baseRentWeighting: number;
    numHouses: number;
    isMortgaged: boolean;
    /** Player id of the owner, or undefined if unowned */
    owner: number | undefined;
    baseRent: number;
    rent: number;
}

export function isOwnableProperty(p: object): p is OwnableProperty {
    return typeof (p as OwnableProperty).blockId === "number";
}

export function buyProperty(
    property: OwnableProperty,
    playerId: number,
    marketCap: number
): OwnableProperty {
    const baseRent = marketCap * (property.baseRentWeighting / 100);
    return { ...property, owner: playerId, baseRent, rent: baseRent };
}

export function buyHouse(property: OwnableProperty, hasWholeBlock: boolean): OwnableProperty {
    if (property.numHouses >= 5) return property;
    const numHouses = property.numHouses + 1;
    const rent = property.baseRent * numHouses * (hasWholeBlock ? 2 : 1);
    return { ...property, numHouses, rent };
}
