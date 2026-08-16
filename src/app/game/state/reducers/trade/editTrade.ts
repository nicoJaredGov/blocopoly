import { GameStateDTO } from "../../GameState";
import { Trade } from "../../../trades/Trade";
import { isValidTradeTerms } from "./tradeValidation";

export function editTrade(
    state: GameStateDTO,
    payload: { tradeId: number; updated: Trade }
): GameStateDTO {
    const { tradeId, updated } = payload;

    if (!isValidEdit(state, tradeId, updated)) return state;

    return {
        ...state,
        trades: state.trades.map((t) => (t.id === tradeId ? updated : t))
    };
}

function isValidEdit(state: GameStateDTO, tradeId: number, updated: Trade): boolean {
    // Trade must exist
    const existing = state.trades.find((t) => t.id === tradeId);
    if (!existing) return false;

    return isValidTradeTerms(state, updated);
}
