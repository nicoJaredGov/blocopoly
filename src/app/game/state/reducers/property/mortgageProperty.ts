import { GameStateDTO } from "../../GameState";
import { getOwnableConfig } from "@/app/game/board/board_configs/boardConfig";
import { increasePlayerBalance, updatedPropertyAndPlayer } from "../../utils";
import { isValidPropertySale } from "./saleValidation";

export function mortgageProperty(
    state: GameStateDTO,
    payload: { playerId: number; propertyPosition: number }
): GameStateDTO {
    const { playerId, propertyPosition } = payload;
    const existing = state.ownedProperties[propertyPosition];
    const config = getOwnableConfig(propertyPosition);
    if (!config) return state;

    if (!isValidPropertySale(state, existing, playerId, propertyPosition)) {
        return state;
    }

    const player = increasePlayerBalance(state, playerId, config.cost / 2);
    const updated = { ...existing, isMortgaged: true };

    return updatedPropertyAndPlayer(state, updated, player);
}
