import { GameStateDTO } from "../../GameState";
import { buyOwnableProperty, OwnablePropertyDTO } from "../../../property/OwnableProperty";
import { getBlockPositions, getOwnableConfig } from "../../../board/board_configs/boardConfig";

/**
 * Transfers a property to a new owner and recalculates the whole-block rent bonus.
 * Houses are guaranteed to be 0 on all traded properties (enforced by validation),
 * so no per-house rent recalculation is needed.
 */
function transferProperty(
    ownedProperties: Record<number, OwnablePropertyDTO>,
    position: number,
    newOwnerId: number
): OwnablePropertyDTO {
    const property = ownedProperties[position];
    const config = getOwnableConfig(position);
    if (!property || !config) return property;

    const blockPositions = getBlockPositions(position);
    const hasWholeBlock = blockPositions.every(
        (pos) => pos === position || ownedProperties[pos]?.owner === newOwnerId
    );

    return buyOwnableProperty(property, newOwnerId, config.baseRent, hasWholeBlock);
}

export function acceptTrade(state: GameStateDTO, payload: { tradeId: number }): GameStateDTO {
    const { tradeId } = payload;

    const trade = state.trades.find((t) => t.id === tradeId);
    if (!trade) return state;

    const {
        initiator,
        recipient,
        initiatorTradeIns,
        initiatorCashOffer,
        recipientTradeIns,
        recipientCashOffer
    } = trade;

    // Step 1: Transfer properties — initiator's trade-ins go to recipient, and vice versa.
    let ownedProperties = { ...state.ownedProperties };

    for (const pos of initiatorTradeIns) {
        ownedProperties = {
            ...ownedProperties,
            [pos]: transferProperty(ownedProperties, pos, recipient)
        };
    }
    for (const pos of recipientTradeIns) {
        ownedProperties = {
            ...ownedProperties,
            [pos]: transferProperty(ownedProperties, pos, initiator)
        };
    }

    // Step 2: Settle cash — net the two cash offers.
    const initiatorBalance =
        state.players[initiator].balance - initiatorCashOffer + recipientCashOffer;
    const recipientBalance =
        state.players[recipient].balance - recipientCashOffer + initiatorCashOffer;

    const players = {
        ...state.players,
        [initiator]: { ...state.players[initiator], balance: initiatorBalance },
        [recipient]: { ...state.players[recipient], balance: recipientBalance }
    };

    // Step 3: Remove the accepted trade.
    const trades = state.trades.filter((t) => t.id !== tradeId);

    return { ...state, ownedProperties, players, trades };
}
