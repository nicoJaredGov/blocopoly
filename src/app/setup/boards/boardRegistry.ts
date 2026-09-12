import { BoardConfig } from "../BoardConfig";
import { customBoard } from "./customBoard";

/**
 * All available board variants keyed by their stable ID.
 * Add new boards here — the ID is what gets persisted in game config,
 * never the full BoardConfig object.
 */
const registry: Record<string, BoardConfig> = {
    custom: customBoard,
};

/** All board IDs that can be selected in setup. */
export type BoardId = keyof typeof registry;

/** Ordered list of available boards for display in the setup UI. */
export const availableBoards: { id: BoardId; name: string }[] = Object.entries(registry).map(
    ([id, config]) => ({ id, name: config.name })
);

/**
 * Resolves a board ID to its full static config.
 * Throws if the ID is unknown — this should never happen at runtime
 * since only registered IDs are ever persisted.
 */
export function getBoardConfig(id: BoardId): BoardConfig {
    const config = registry[id];
    if (!config) throw new Error(`Unknown board ID: "${id}"`);
    return config;
}
