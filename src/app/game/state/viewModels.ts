import { PlayerDTO, Player } from "../player/Player";
import {
    OwnablePropertyConfig,
    OwnablePropertyDTO,
    OwnableProperty
} from "../property/OwnableProperty";
import { Property } from "../property/Property";
import { Trade } from "../trades/Trade";
import { Stage } from "./Stage";
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
     * Full board — static Property/OwnablePropertyConfig cells hydrated with
     * mutable OwnablePropertyDTO state where available.
     */
    board: (Property | OwnableProperty)[];
    trades: Trade[];
    stage: Stage;
}

// ---------------------------------------------------------------------------
// Static config shapes — provided once at session start from board/lobby data
// ---------------------------------------------------------------------------

/**
 * Static display config for a player, provided at session start (lobby/game setup).
 * isHost is on PlayerDTO since the server needs it for authority checks.
 */
export type PlayerConfig = Pick<Player, "id" | "name" | "piece" | "colour">;

// ---------------------------------------------------------------------------
// Hydration functions
// ---------------------------------------------------------------------------

/**
 * Merges mutable PlayerDTO state with static PlayerConfig to produce a Player view model.
 */
export function toPlayerVM(player: PlayerDTO, config: PlayerConfig): Player {
    return {
        ...player,
        name: config.name,
        piece: config.piece,
        colour: config.colour
    };
}

/**
 * Merges a mutable OwnablePropertyDTO with its static OwnablePropertyConfig
 * to produce a full OwnableProperty view model.
 */
export function toOwnablePropertyVM(
    dto: OwnablePropertyDTO,
    config: OwnablePropertyConfig
): OwnableProperty {
    return { ...config, ...dto };
}

/**
 * Produces a full GameState view model by hydrating all players and merging
 * mutable owned property state into the static board config array.
 *
 * @param state         - Lean serialized game state from the server.
 * @param boardConfig   - Static board layout loaded once at startup.
 * @param playerConfigs - Static player display config keyed by player id.
 * @param currentPlayer - The player id of the local client.
 */
export function toGameStateVM(
    state: GameStateDTO,
    boardConfig: (Property | OwnablePropertyConfig)[],
    playerConfigs: Record<number, PlayerConfig>,
    currentPlayer: number
): GameState {
    const players: Record<number, Player> = {};
    for (const [idStr, player] of Object.entries(state.players)) {
        const id = Number(idStr);
        players[id] = toPlayerVM(player, playerConfigs[id]);
    }

    const board: (Property | OwnableProperty)[] = boardConfig.map((cell) => {
        const dto = state.ownedProperties[cell.position];
        if (dto) {
            // Overlay mutable state onto the static config
            return toOwnablePropertyVM(dto, cell as OwnablePropertyConfig);
        }
        return cell as Property;
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
