import { Player } from "./player/Player";
import { Stage } from "./Stage";
import { Trade } from "./trades/Trade";
import { OwnableProperty } from "./property/OwnableProperty";
import { Property } from "./property/Property";

export interface GameState {
    currentPlayer: number;
    players: Player[];
    /** Board cells indexed by position (0–39) */
    board: (Property | OwnableProperty)[];
    trades: Trade[];
    stage: Stage;
}

export type GameStateAction =
    | {
          type: "BUY_PROPERTY";
          payload: { playerId: number; propertyPosition: number; marketCap: number };
      }
    | { type: "MORTGAGE_PROPERTY"; payload: { playerId: number; propertyPosition: number } }
    | { type: "UNMORTGAGE_PROPERTY"; payload: { playerId: number; propertyPosition: number } }
    | { type: "SELL_PROPERTY"; payload: { playerId: number; propertyPosition: number } }
    | {
          type: "BUY_HOUSE";
          payload: { playerId: number; propertyPosition: number; hasWholeBlock: boolean };
      }
    | { type: "ADD_TRADE"; payload: Trade }
    | { type: "EDIT_TRADE"; payload: { tradeId: number; updated: Trade } }
    | { type: "REMOVE_TRADE"; payload: { tradeId: number } }
    | { type: "BANKRUPT"; payload: { playerId: number } }
    | { type: "LEAVE_GAME"; payload: { playerId: number } };

export function getInitialState(
    players: Player[],
    board: (Property | OwnableProperty)[]
): GameState {
    return {
        currentPlayer: 0,
        players,
        board,
        trades: [],
        stage: "NORMAL"
    };
}

export function gameStateReducer(state: GameState, action: GameStateAction): GameState {
    switch (action.type) {
        // Reducer cases to be implemented as features are built.
        default:
            return state;
    }
}
