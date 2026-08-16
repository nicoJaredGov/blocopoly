import { GameStateDTO } from "../../GameState";

/**
 * Removes a trade by id — covers rejection, cancellation, and expiry.
 */
export function removeTrade(
    state: GameStateDTO,
    payload: { tradeId: number }
): GameStateDTO {
    const { tradeId } = payload;

    const exists = state.trades.some((t) => t.id === tradeId);
    if (!exists) return state;

    return {
        ...state,
        trades: state.trades.filter((t) => t.id !== tradeId)
    };
}
