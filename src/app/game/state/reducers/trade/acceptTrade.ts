import { GameStateDTO } from "../../GameState";
import { buyOwnableProperty, OwnablePropertyDTO } from "../../../property/OwnableProperty";
import { getBlockPropertyPositions, getOwnablePropertyConfig } from "../utils";
import { payRent } from "../payRent";

/**
 * Transfers a property to a new owner and recalculates the whole-block rent bonus.
 * Houses are guaranteed to be 0 on all traded properties (enforced by validation),
 * so no per-house rent recalculation is needed.
 */
function transferProperty(
    state: GameStateDTO,
    ownedProperties: Record<number, OwnablePropertyDTO>,
    position: number,
    newOwnerId: number
): OwnablePropertyDTO {
    const property = ownedProperties[position];
    const config = getOwnablePropertyConfig(state, position);
    if (!property || !config) return property;

    const blockPositions = getBlockPropertyPositions(state, position);
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
            [pos]: transferProperty(state, ownedProperties, pos, recipient)
        };
    }
    for (const pos of recipientTradeIns) {
        ownedProperties = {
            ...ownedProperties,
            [pos]: transferProperty(state, ownedProperties, pos, initiator)
        };
    }

    // Step 2: Settle cash — net the two cash offers.
    const initiatorPlayer = { ...state.players[initiator] };
    const recipientPlayer = { ...state.players[recipient] };

    const initiatorPrevBalance = initiatorPlayer.balance;
    const recipientPrevBalance = recipientPlayer.balance;
    initiatorPlayer.balance = initiatorPrevBalance - initiatorCashOffer + recipientCashOffer;
    recipientPlayer.balance = recipientPrevBalance - recipientCashOffer + initiatorCashOffer;

    const players = {
        ...state.players,
        [initiator]: initiatorPlayer,
        [recipient]: recipientPlayer
    };

    // Step 3: Remove the accepted trade.
    const trades = state.trades.filter((t) => t.id !== tradeId);

    let updated: GameStateDTO = { ...state, ownedProperties, players, trades };

    // Step 4: If either player was in NEGATIVE_BALANCE, apply their trade proceeds
    // toward the outstanding rent debt.
    if (initiatorPrevBalance < 0) {
        const property = state.ownedProperties[initiatorPlayer.boardPosition];
        updated = payRent(updated, initiatorPlayer, property, Math.abs(initiatorPrevBalance));
    }
    if (recipientPrevBalance < 0) {
        const property = state.ownedProperties[recipientPlayer.boardPosition];
        updated = payRent(updated, recipientPlayer, property, Math.abs(recipientPrevBalance));
    }

    return updated;
}
