import { PlayerDTO } from "./player/Player";
import { Stage } from "./Stage";
import { Trade } from "./trades/Trade";
import { OwnablePropertyDTO } from "./property/OwnableProperty";

const NUM_BOARD_POSITIONS = 40;

/**
 * Serialized game state — only mutable data sent over the wire.
 * The board is not included here; it is static config held client-side.
 */
export interface GameStateDTO {
    currentPlayer: number;
    /** Mutable player state keyed by player id */
    players: Record<number, PlayerDTO>;
    /** Mutable ownable property state keyed by board position */
    ownedProperties: Record<number, OwnablePropertyDTO>;
    trades: Trade[];
    stage: Stage;
}

export type GameStateAction =
    | { type: "ROLL_DICE" }
    | { type: "END_TURN" }
    | {
          type: "BUY_PROPERTY";
          payload: { propertyPosition: number; marketCap: number };
      }
    | { type: "MORTGAGE_PROPERTY"; payload: { playerId: number; propertyPosition: number } }
    | { type: "UNMORTGAGE_PROPERTY"; payload: { playerId: number; propertyPosition: number } }
    | { type: "SELL_PROPERTY"; payload: { playerId: number; propertyPosition: number } }
    | {
          type: "BUY_HOUSE";
          payload: { propertyPosition: number; hasWholeBlock: boolean };
      }
    | { type: "ADD_TRADE"; payload: Trade }
    | { type: "EDIT_TRADE"; payload: { tradeId: number; updated: Trade } }
    | { type: "REMOVE_TRADE"; payload: { tradeId: number } }
    | { type: "BANKRUPT"; payload: { playerId: number } }
    | { type: "LEAVE_GAME"; payload: { playerId: number } };

export function getInitialState(players: Record<number, PlayerDTO>): GameStateDTO {
    return {
        currentPlayer: 0,
        players,
        ownedProperties: {},
        trades: [],
        stage: "NORMAL"
    };
}

export function gameStateReducer(state: GameStateDTO, action: GameStateAction): GameStateDTO {
    switch (action.type) {
        case "ROLL_DICE":
            return { ...state };

        default:
            return state;
    }
}

type D6Result = 1 | 2 | 3 | 4 | 5 | 6;

function rollD6(): D6Result {
    return (Math.floor(Math.random() * 6) + 1) as D6Result;
}

function rollDice(state: GameStateDTO, playerId: number): GameStateDTO {
    const firstDice = rollD6();
    const secondDice = rollD6();
    const elapsedPositions = firstDice + secondDice;

    const currentPosition = state.players[playerId].boardPosition;
    const newPosition = (currentPosition + elapsedPositions) % NUM_BOARD_POSITIONS;

    return {
        ...state,
        players: {
            ...state.players,
            [playerId]: { ...state.players[playerId], boardPosition: newPosition }
        }
    };
}
