import { GameStateDTO } from "../../GameState";
import { Trade } from "../../../trades/Trade";
import { buyOwnableProperty, OwnablePropertyDTO } from "../../../property/OwnableProperty";
import { getBlockPositions, getOwnableConfig } from "../../../board/board_configs/boardConfig";
import { isValidTradeTerms } from "./tradeValidation";

/**
 * Transfers a property to a new owner and recalculates its rent based on
 * whether the new owner now holds the whole block.
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

/**
 * After a transfer batch, recalculates rent for all properties in the same block
 * as any transferred property, so former whole-block bonuses are removed correctly.
 */
function recalculateBlockRents(
    ownedProperties: Record<number, OwnablePropertyDTO>,
    affectedPositions: number[]
): Record<number, OwnablePropertyDTO> {
    const positionsToRecalculate = new Set<number>();
    for (const pos of affectedPositions) {
        for (const blockPos of getBlockPositions(pos)) {
            positionsToRecalculate.add(blockPos);
        }
    }

    let updated = { ...ownedProperties };
    for (const pos of positionsToRecalculate) {
        const property = updated[pos];
        if (!property || property.owner === undefined) continue;

        const config = getOwnableConfig(pos);
        if (!config) continue;

        const blockPositions = getBlockPositions(pos);
        const hasWholeBlock = blockPositions.every(
            (blockPos) => updated[blockPos]?.owner === property.owner
        );

        const newRent = property.baseRent * (hasWholeBlock ? 2 : 1) * (property.numHouses + 1);
        updated = { ...updated, [pos]: { ...property, rent: newRent } };
    }

    return updated;
}

export function acceptTrade(state: GameStateDTO, payload: { tradeId: number }): GameStateDTO {
    const { tradeId } = payload;

    const trade = state.trades.find((t) => t.id === tradeId);
    if (!isValidAccept(state, trade)) return state;

    // trade is guaranteed non-null past this point
    const {
        initiator,
        recipient,
        initiatorTradeIns,
        initiatorCashOffer,
        recipientTradeIns,
        recipientCashOffer
    } = trade!;

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

    // Step 2: Recalculate rents for all blocks touched by the transfers.
    const allTransferred = [...initiatorTradeIns, ...recipientTradeIns];
    ownedProperties = recalculateBlockRents(ownedProperties, allTransferred);

    // Step 3: Settle cash — net the two cash offers.
    const initiatorBalance =
        state.players[initiator].balance - initiatorCashOffer + recipientCashOffer;
    const recipientBalance =
        state.players[recipient].balance - recipientCashOffer + initiatorCashOffer;

    const players = {
        ...state.players,
        [initiator]: { ...state.players[initiator], balance: initiatorBalance },
        [recipient]: { ...state.players[recipient], balance: recipientBalance }
    };

    // Step 4: Remove the accepted trade.
    const trades = state.trades.filter((t) => t.id !== tradeId);

    return { ...state, ownedProperties, players, trades };
}

function isValidAccept(state: GameStateDTO, trade: Trade | undefined): boolean {
    if (!trade) return false;

    // Re-validate that both parties still meet the trade terms at acceptance time
    return isValidTradeTerms(state, trade);
}
