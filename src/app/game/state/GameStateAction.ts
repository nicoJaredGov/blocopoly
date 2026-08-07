import { Trade } from "../trades/Trade";

export type GameStateAction =
    | { type: "ROLL_DICE" }
    | { type: "END_TURN" }
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
