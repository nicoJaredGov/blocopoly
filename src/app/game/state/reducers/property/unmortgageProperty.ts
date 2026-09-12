import { GameStateDTO } from "../../GameState";
import { boardConfig } from "@/app/game/board/board_configs/boardAccessor";
import { getOwnableConfig } from "@/app/setup/BoardConfig";
import { decreasePlayerBalance, updatedPropertyAndPlayer } from "../utils";
import { isValidPropertyPurchase } from "./purchaseValidation";

export function unmortgageProperty(
    state: GameStateDTO,
    payload: { playerId: number; propertyPosition: number }
): GameStateDTO {
    const { playerId, propertyPosition } = payload;
    const existing = state.ownedProperties[propertyPosition];
    const config = getOwnableConfig(boardConfig, propertyPosition);
    if (!config) return state;

    if (!isValidPropertyPurchase(state, playerId, propertyPosition, config.cost)) {
        return state;
    }

    const player = decreasePlayerBalance(state, playerId, config.cost);
    const updated = { ...existing, isMortgaged: false };

    return updatedPropertyAndPlayer(state, updated, player);
}
