import { PlayerDTO, Player, PlayerConfig } from "./player/Player";
import {
    OwnablePropertyConfig,
    OwnablePropertyDTO,
    OwnableProperty
} from "./property/OwnableProperty";
import { Property } from "./property/Property";
import { GameState, GameStateDTO } from "./state/GameState";

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
