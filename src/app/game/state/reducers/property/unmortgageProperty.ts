import { GameStateDTO } from "../../GameState";
import { getOwnableConfig } from "@/app/game/board/board_configs/boardConfig";
import { decreasePlayerBalance, updatedPropertyAndPlayer } from "../utils";
import { isValidPropertyPurchase } from "./purchaseValidation";

export function unmortgageProperty(
    state: GameStateDTO,
    payload: { playerId: number; propertyPosition: number }
): GameStateDTO {
    const { playerId, propertyPosition } = payload;
    const existing = state.ownedProperties[propertyPosition];
    const config = getOwnableConfig(propertyPosition);
    if (!config) return state;

    if (!isValidPropertyPurchase(state, playerId, propertyPosition, config.cost)) {
        return state;
    }

    const player = decreasePlayerBalance(state, playerId, config.cost);
    const updated = { ...existing, isMortgaged: false };

    return updatedPropertyAndPlayer(state, updated, player);
}
