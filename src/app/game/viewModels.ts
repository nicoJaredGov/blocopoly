import { PlayerDTO, Player } from "./player/Player";
import { OwnablePropertyDTO, OwnableProperty } from "./property/OwnableProperty";
import { Property } from "./property/Property";
import { GameStateDTO } from "./GameState";

/**
 * Client-side view of the full game — combines lean serialized state with
 * static board config so UI components have everything in one place.
 */
export interface GameState {
    /** The player who is playing their turn now. */
    activePlayer: number;
    /** The current player on this client device. */
    currentPlayer: number;
    players: Record<number, Player>;
    /**
     * Full board as view models — static PropertyVM cells merged with
     * hydrated OwnablePropertyVM cells reflecting current mutable state.
     */
    board: (Property | OwnableProperty)[];
    trades: import("./trades/Trade").Trade[];
    stage: import("./Stage").Stage;
}

// ---------------------------------------------------------------------------
// Static config shapes — provided once at session start from board/lobby data
// ---------------------------------------------------------------------------

/** Static fields for a player, provided at session start (lobby/game setup). */
export type PlayerConfig = Pick<Player, "id" | "name" | "piece" | "colour" | "isHost">;

// ---------------------------------------------------------------------------
// Hydration functions
// ---------------------------------------------------------------------------

/**
 * Merges mutable Player state with static config to produce a PlayerVM.
 */
export function toPlayerVM(player: PlayerDTO, config: PlayerConfig): Player {
    return {
        ...player,
        name: config.name,
        piece: config.piece,
        colour: config.colour,
        isHost: config.isHost
    };
}

/**
 * Merges mutable OwnableProperty state with its static config entry to
 * produce an OwnablePropertyVM.
 */
export function toOwnablePropertyVM(
    property: OwnablePropertyDTO,
    config: Omit<OwnableProperty, keyof OwnablePropertyDTO>
): OwnableProperty {
    return { ...property, ...config };
}

/**
 * Produces a full GameStateVM by hydrating all players and merging mutable
 * ownable property state into the static board config array.
 *
 * @param state         - Lean serialized game state from the server.
 * @param boardConfig   - Static board layout (PropertyVM | OwnablePropertyVM) loaded once at startup.
 * @param playerConfigs - Static player config keyed by player id.
 */
export function toGameStateVM(
    state: GameStateDTO,
    boardConfig: (Property | OwnableProperty)[],
    playerConfigs: Record<number, PlayerConfig>,
    currentPlayer: number
): GameState {
    const players: Record<number, Player> = {};
    for (const [idStr, player] of Object.entries(state.players)) {
        const id = Number(idStr);
        players[id] = toPlayerVM(player, playerConfigs[id]);
    }

    const board: (Property | OwnableProperty)[] = boardConfig.map((cell) => {
        const mutableState = state.ownedProperties[cell.position];
        // If there's mutable state for this position, overlay it onto the static config
        if (mutableState) {
            return { ...cell, ...mutableState } as OwnableProperty;
        }
        return cell;
    });

    return {
        activePlayer: state.activePlayer,
        currentPlayer,
        players,
        board,
        trades: state.trades,
        stage: state.stage
    };
}
