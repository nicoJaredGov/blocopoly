import { customProperties, customPropertyBlocks } from "./customBoard";
import { OwnablePropertyConfig } from "../../property/OwnableProperty";
import { Property } from "../../property/Property";
import { PropertyBlock } from "../../property/PropertyBlock";

// Swap this import to switch board variants
const properties = customProperties;
export const propertyBlocks: Record<number, PropertyBlock> = customPropertyBlocks;

/** Look up static config for any board position. */
export function getPropertyConfig(position: number): Property | OwnablePropertyConfig | undefined {
    return properties.find((p) => p.position === position);
}

/** Look up ownable config by position — returns undefined if the property is not ownable. */
export function getOwnableConfig(position: number): OwnablePropertyConfig | undefined {
    const p = getPropertyConfig(position);
    return p && "blockId" in p ? (p as OwnablePropertyConfig) : undefined;
}

/** Returns all board positions that share the same block as the given position. */
export function getBlockPositions(position: number): number[] {
    const config = getOwnableConfig(position);
    if (!config) return [];
    return properties
        .filter((p): p is OwnablePropertyConfig => "blockId" in p && p.blockId === config.blockId)
        .map((p) => p.position);
}
