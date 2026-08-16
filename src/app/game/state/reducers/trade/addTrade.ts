import { GameStateDTO } from "../../GameState";
import { Trade, MAX_TRADES } from "../../../trades/Trade";
import { isValidTradeTerms } from "./tradeValidation";

export function addTrade(state: GameStateDTO, trade: Trade): GameStateDTO {
    if (!isValidAdd(state, trade)) return state;

    return {
        ...state,
        trades: [...state.trades, trade]
    };
}

function isValidAdd(state: GameStateDTO, trade: Trade): boolean {
    // Enforce trade cap
    if (state.trades.length >= MAX_TRADES) return false;

    return isValidTradeTerms(state, trade);
}
