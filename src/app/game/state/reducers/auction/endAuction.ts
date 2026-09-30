import { GameStateDTO } from "../../GameState";
import { buyPropertyForCost } from "../property";
import { findMaxKey, getOwnablePropertyConfig } from "../utils";
import { isValidPropertyPurchase } from "../property/purchaseValidation";

export function endAuction(state: GameStateDTO): GameStateDTO {
    const auction = state.auction;
    if (state.stage !== "AUCTION" || !auction) return state;

    const highestBidder = findMaxKey(auction.bids);
    if (highestBidder === undefined) return resetToNormalStage(state);

    const config = getOwnablePropertyConfig(state, auction.propertyId);
    if (!config) return state;

    // Highest bidder pays the bid amount for the property
    const bid = auction.bids[highestBidder];
    if (!isValidPropertyPurchase(state, highestBidder, auction.propertyId, bid)) {
        return resetToNormalStage(state);
    }
    const updated = buyPropertyForCost(state, highestBidder, config, bid);

    return resetToNormalStage(updated);
}

function resetToNormalStage(state: GameStateDTO): GameStateDTO {
    return {
        ...state,
        stage: "NORMAL",
        auction: null
    };
}
