import { GameStateDTO } from "../../GameState";
import { Trade, MAX_TRADES } from "../../../trades/Trade";
import { getPlayerBalance } from "../../utils";

export function addTrade(state: GameStateDTO, trade: Trade): GameStateDTO {
    // Enforce trade cap
    if (state.trades.length >= MAX_TRADES) return state;
    // Validate initiator owns all their offered properties
    for (const pos of trade.initiatorTradeIns) {
        if (state.ownedProperties[pos]?.owner !== trade.initiator) return state;
    }

    // Validate recipient owns all their offered properties
    for (const pos of trade.recipientTradeIns) {
        if (state.ownedProperties[pos]?.owner !== trade.recipient) return state;
    }

    // Validate initiator can cover their cash offer
    if (trade.initiatorCashOffer > 0) {
        const balance = getPlayerBalance(state, trade.initiator);
        if (balance < trade.initiatorCashOffer) return state;
    }

    // Validate recipient can cover their cash offer
    if (trade.recipientCashOffer > 0) {
        const balance = getPlayerBalance(state, trade.recipient);
        if (balance < trade.recipientCashOffer) return state;
    }

    return {
        ...state,
        trades: [...state.trades, trade]
    };
}
