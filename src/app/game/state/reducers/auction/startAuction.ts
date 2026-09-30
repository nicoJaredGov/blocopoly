import { GameStateDTO } from "../../GameState";
import { getOwnablePropertyConfig } from "../utils";

export function startAuction(state: GameStateDTO, payload: { propertyId: number }): GameStateDTO {
    const { propertyId } = payload;

    const propertyConfig = getOwnablePropertyConfig(state, propertyId);
    if (!propertyConfig) return state;

    return {
        ...state,
        stage: "AUCTION",
        auction: {
            propertyId,
            propertyCost: propertyConfig.cost,
            bids: {},
            timeRemaining: 30 //TODO fetch from game config
        }
    };
}
