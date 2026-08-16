import { GameStateDTO } from "../../GameState";
import { Trade } from "../../../trades/Trade";
import { getPlayerBalance } from "../../utils";

/**
 * Validates that both parties in a trade still own their offered properties
 * and can cover their respective cash offers.
 * Used by both addTrade and editTrade.
 */
export function isValidTradeTerms(state: GameStateDTO, trade: Trade): boolean {
    // Initiator must own all their offered properties
    for (const pos of trade.initiatorTradeIns) {
        if (state.ownedProperties[pos]?.owner !== trade.initiator) return false;
    }

    // Recipient must own all their offered properties
    for (const pos of trade.recipientTradeIns) {
        if (state.ownedProperties[pos]?.owner !== trade.recipient) return false;
    }

    // Initiator must be able to cover their cash offer
    if (trade.initiatorCashOffer > 0) {
        const balance = getPlayerBalance(state, trade.initiator);
        if (balance < trade.initiatorCashOffer) return false;
    }

    // Recipient must be able to cover their cash offer
    if (trade.recipientCashOffer > 0) {
        const balance = getPlayerBalance(state, trade.recipient);
        if (balance < trade.recipientCashOffer) return false;
    }

    return true;
}
