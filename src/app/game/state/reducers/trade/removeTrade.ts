import { GameStateDTO } from "../../GameState";

/**
 * Removes a trade by id — covers rejection, cancellation, and expiry.
 */
export function removeTrade(state: GameStateDTO, payload: { tradeId: number }): GameStateDTO {
    const { tradeId } = payload;

    if (!isValidRemove(state, tradeId)) return state;

    return {
        ...state,
        trades: state.trades.filter((t) => t.id !== tradeId)
    };
}

function isValidRemove(state: GameStateDTO, tradeId: number): boolean {
    return state.trades.some((t) => t.id === tradeId);
}
