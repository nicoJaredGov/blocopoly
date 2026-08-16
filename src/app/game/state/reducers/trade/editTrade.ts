import { GameStateDTO } from "../../GameState";
import { Trade } from "../../../trades/Trade";
import { getPlayerBalance } from "../../utils";

export function editTrade(
    state: GameStateDTO,
    payload: { tradeId: number; updated: Trade }
): GameStateDTO {
    const { tradeId, updated } = payload;

    // Check the trade exists
    const existing = state.trades.find((t) => t.id === tradeId);
    if (!existing) return state;

    // Validate initiator still owns all their offered properties
    for (const pos of updated.initiatorTradeIns) {
        if (state.ownedProperties[pos]?.owner !== updated.initiator) return state;
    }

    // Validate recipient still owns all their offered properties
    for (const pos of updated.recipientTradeIns) {
        if (state.ownedProperties[pos]?.owner !== updated.recipient) return state;
    }

    // Validate initiator can cover their cash offer
    if (updated.initiatorCashOffer > 0) {
        const balance = getPlayerBalance(state, updated.initiator);
        if (balance < updated.initiatorCashOffer) return state;
    }

    // Validate recipient can cover their cash offer
    if (updated.recipientCashOffer > 0) {
        const balance = getPlayerBalance(state, updated.recipient);
        if (balance < updated.recipientCashOffer) return state;
    }

    return {
        ...state,
        trades: state.trades.map((t) => (t.id === tradeId ? updated : t))
    };
}
