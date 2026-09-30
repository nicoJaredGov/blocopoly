import { BidType, BidTypeValue } from "@/app/game/auction/BidType";
import { GameStateDTO } from "../../GameState";
import { getPlayerBalance } from "../utils";

export function increaseBid(
    state: GameStateDTO,
    payload: { playerId: number; bidType: BidTypeValue }
): GameStateDTO {
    const { playerId, bidType } = payload;
    if (state.stage !== "AUCTION" || !state.auction) return state;

    const bidAmount = calculateBidAmount(bidType, state.auction.propertyCost);
    const playerBalance = getPlayerBalance(state, playerId);
    const playerCurrentBid = state.auction.bids[playerId] ?? 0;
    if (playerBalance < playerCurrentBid + bidAmount) return state;

    return {
        ...state,
        auction: {
            ...state.auction,
            bids: {
                ...state.auction.bids,
                [playerId]: playerCurrentBid + bidAmount
            }
        }
    };
}

function calculateBidAmount(bidType: BidTypeValue, cost: number): number {
    let amount = 0;

    switch (bidType) {
        case BidType.TEN:
            amount = cost * 0.1;
            break;
        case BidType.FIFTY:
            amount = cost * 0.5;
            break;
        case BidType.HUNDRED:
            amount = cost;
            break;
    }

    amount = Math.round(amount);
    amount = Math.max(1, amount);
    return amount;
}
