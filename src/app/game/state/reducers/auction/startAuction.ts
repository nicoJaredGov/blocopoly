import { getOwnableConfig } from "@/app/setup/BoardConfig";
import { GameStateDTO } from "../../GameState";
import { boardConfig } from "@/app/game/board/board_configs/boardAccessor";

export function startAuction(state: GameStateDTO, payload: { propertyId: number }): GameStateDTO {
    const { propertyId } = payload;

    const propertyConfig = getOwnableConfig(boardConfig, propertyId);
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
