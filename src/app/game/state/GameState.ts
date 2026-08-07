import { PlayerDTO } from "../player/Player";
import { Stage } from "./Stage";
import { Trade } from "../trades/Trade";
import { OwnablePropertyDTO } from "../property/OwnableProperty";
import { GameStateAction } from "./GameStateAction";
import { rollDice, endTurn } from "./reducers";

/**
 * Serialized game state — only mutable data sent over the wire.
 * The board is not included here; it is static config held client-side.
 */
export interface GameStateDTO {
    activePlayer: number;
    /** Mutable player state keyed by player id */
    players: Record<number, PlayerDTO>;
    /** Mutable ownable property state keyed by board position */
    ownedProperties: Record<number, OwnablePropertyDTO>;
    trades: Trade[];
    stage: Stage;
}

export function getInitialState(players: Record<number, PlayerDTO>): GameStateDTO {
    return {
        activePlayer: 0,
        players,
        ownedProperties: {},
        trades: [],
        stage: "NORMAL"
    };
}

export function gameStateReducer(state: GameStateDTO, action: GameStateAction): GameStateDTO {
    switch (action.type) {
        case "ROLL_DICE":
            return rollDice(state);
        case "END_TURN":
            return endTurn(state);
        default:
            return state;
    }
}
