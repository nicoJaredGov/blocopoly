import { GameStateDTO } from "../../GameState";
import { boardConfig } from "@/app/game/board/board_configs/boardAccessor";
import { getOwnableConfig } from "@/app/setup/BoardConfig";
import { addOrUpdatePlayer, increasePlayerBalance, removeOwnedProperty } from "../utils";
import { isValidPropertySale } from "./saleValidation";

export function sellProperty(
    state: GameStateDTO,
    payload: { playerId: number; propertyPosition: number }
): GameStateDTO {
    const { playerId, propertyPosition } = payload;
    const existing = state.ownedProperties[propertyPosition];
    const config = getOwnableConfig(boardConfig, propertyPosition);
    if (!config) return state;

    if (!isValidPropertySale(state, existing, playerId, propertyPosition)) {
        return state;
    }

    const player = increasePlayerBalance(state, playerId, config.cost / 2);

    return {
        ...state,
        players: addOrUpdatePlayer(state, player),
        ownedProperties: removeOwnedProperty(state, propertyPosition)
    };
}
