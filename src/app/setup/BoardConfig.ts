import { OwnablePropertyConfig } from "@/app/game/property/OwnableProperty";
import { Property } from "@/app/game/property/Property";
import { PropertyBlock } from "@/app/game/property/PropertyBlock";
import { Card } from "../game/cards";

/**
 * Static configuration for a board variant.
 * Loaded once at session start; never mutated at runtime.
 */
export interface BoardConfig {
    /** Display name for this board variant */
    name: string;
    /** All 40 board cells in position order */
    properties: (Property | OwnablePropertyConfig)[];
    /** Colour groups keyed by block Id */
    propertyBlocks: Record<number, PropertyBlock>;
    /** Full deck of cards grouped by card Id */
    cardDeck: Record<number, Card>;
    /** Community chest card Ids from card deck*/
    communityChestCards: number[];
    /** Chance card Ids from card deck */
    chanceCards: number[];
}

/** Look up static config for any board position. */
export function getPropertyConfig(
    board: BoardConfig,
    position: number
): Property | OwnablePropertyConfig | undefined {
    return board.properties.find((p) => p.position === position);
}

/** Look up ownable config by position — returns undefined if the property is not ownable. */
export function getOwnableConfig(
    board: BoardConfig,
    position: number
): OwnablePropertyConfig | undefined {
    const p = getPropertyConfig(board, position);
    return p && "blockId" in p ? (p as OwnablePropertyConfig) : undefined;
}

/** Returns all board positions that share the same block as the given position. */
export function getBlockPositions(board: BoardConfig, position: number): number[] {
    const config = getOwnableConfig(board, position);
    if (!config) return [];
    return board.properties
        .filter((p): p is OwnablePropertyConfig => "blockId" in p && p.blockId === config.blockId)
        .map((p) => p.position);
}
