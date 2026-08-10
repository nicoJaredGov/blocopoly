import { Trade } from "../trades/Trade";

export type GameStateAction =
    | { type: "ROLL_DICE" }
    | { type: "END_TURN" }
    | { type: "BUY_PROPERTY"; payload: { playerId: number; propertyPosition: number } }
    | { type: "SELL_PROPERTY"; payload: { playerId: number; propertyPosition: number } }
    | { type: "MORTGAGE_PROPERTY"; payload: { playerId: number; propertyPosition: number } }
    | { type: "UNMORTGAGE_PROPERTY"; payload: { playerId: number; propertyPosition: number } }
    | { type: "BUY_HOUSE"; payload: { propertyPosition: number } }
    | { type: "SELL_HOUSE"; payload: { propertyPosition: number } }
    | { type: "ADD_TRADE"; payload: Trade }
    | { type: "EDIT_TRADE"; payload: { tradeId: number; updated: Trade } }
    | { type: "REMOVE_TRADE"; payload: { tradeId: number } }
    | { type: "ACCEPT_TRADE"; payload: { tradeId: number } }
    | { type: "BANKRUPT"; payload: { playerId: number } }
    | { type: "LEAVE_GAME"; payload: { playerId: number } };
