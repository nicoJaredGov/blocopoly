import { GameStateDTO } from "../../GameState";
import { Trade } from "../../../trades/Trade";
import { getPlayerBalance } from "../../utils";
import { getBlockPositions } from "../../../board/board_configs/boardConfig";

/**
 * Returns true if any property in the same block as the given position
 * has at least one house built on it.
 */
function blockHasHouses(state: GameStateDTO, position: number): boolean {
    return getBlockPositions(position).some(
        (pos) => (state.ownedProperties[pos]?.numHouses ?? 0) > 0
    );
}

/**
 * Validates that both parties in a trade still own their offered properties,
 * that no offered property belongs to a block with houses on it,
 * and that both can cover their respective cash offers.
 */
export function isValidTradeTerms(state: GameStateDTO, trade: Trade): boolean {
    // Initiator must own all their offered properties, none in a block with houses
    for (const pos of trade.initiatorTradeIns) {
        if (state.ownedProperties[pos]?.owner !== trade.initiator) return false;
        if (blockHasHouses(state, pos)) return false;
    }

    // Recipient must own all their offered properties, none in a block with houses
    for (const pos of trade.recipientTradeIns) {
        if (state.ownedProperties[pos]?.owner !== trade.recipient) return false;
        if (blockHasHouses(state, pos)) return false;
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
