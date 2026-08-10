import { PropertyTypeValue } from "./PropertyType";

/**
 * Static config for an ownable property — loaded once at session start from board config.
 * Contains no mutable state; this is the source of truth for display/position/pricing.
 */
export interface OwnablePropertyConfig {
    /** Board position (0–39) — used as the key to look up mutable state */
    position: number;
    // Grid position (for rendering)
    row: number;
    col: number;
    name: string;
    type: PropertyTypeValue;
    blockId: number;
    /** Base rent charged when no houses are built */
    baseRent: number;
    /** Cost to buy this property */
    cost: number;
}

/**
 * Serialized ownable property state — only mutable fields sent over the wire.
 * Keyed by position in GameStateDTO.ownedProperties.
 */
export interface OwnablePropertyDTO {
    /** Board position (0–39) — key to look up static config on the client */
    position: number;
    numHouses: number;
    isMortgaged: boolean;
    /** Player id of the owner, or undefined if unowned */
    owner: number | undefined;
    baseRent: number;
    rent: number;
    cost: number;
}

/**
 * Client-side view model — merges serialized OwnablePropertyDTO state with static
 * OwnablePropertyConfig loaded once at session start from the board config.
 */
export interface OwnableProperty extends OwnablePropertyConfig {
    numHouses: number;
    isMortgaged: boolean;
    owner: number | undefined;
    baseRent: number;
    rent: number;
    cost: number;
}

export function isOwnableProperty(p: object): p is OwnableProperty {
    return typeof (p as OwnableProperty).blockId === "number";
}

export function buyOwnableProperty(
    property: OwnablePropertyDTO,
    playerId: number,
    baseRent: number,
    hasWholeBlock: boolean
): OwnablePropertyDTO {
    const rent = baseRent * (hasWholeBlock ? 2 : 1);
    return { ...property, owner: playerId, baseRent, rent };
}

// TODO At calling place, check that the person owns whole block
// and that all other properties have equal or 1 more house than current property
export function buyHouseOnProperty(property: OwnablePropertyDTO): OwnablePropertyDTO {
    if (property.numHouses >= 5) return property;

    const numHouses = property.numHouses + 1;
    const rent = property.baseRent * (1 + numHouses);

    return { ...property, numHouses, rent };
}
