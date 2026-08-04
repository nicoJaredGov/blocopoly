import { PropertyTypeValue } from "./PropertyType";

/**
 * Static property config for non-ownable board cells (e.g. GO, Jail, Tax, Chance).
 * These cells have no mutable state — they are never serialized, only used client-side.
 */
export interface Property {
    // Grid position (for rendering)
    row: number;
    col: number;
    /** Board position (0–39) */
    position: number;
    name: string;
    type: PropertyTypeValue;
}
