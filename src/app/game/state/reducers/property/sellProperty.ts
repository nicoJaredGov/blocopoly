import { GameStateDTO } from "../../GameState";
import { boardConfig } from "@/app/game/board/board_configs/boardAccessor";
import { getOwnableConfig } from "@/app/setup/BoardConfig";
import { addOrUpdatePlayer, increasePlayerBalance, removeOwnedProperty } from "../utils";
import { isValidPropertySale } from "./saleValidation";
import { payRent } from "../payRent";

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

    const prevBalance = state.players[playerId]?.balance;
    const player = increasePlayerBalance(state, playerId, config.cost / 2);
    const updated = {
        ...state,
        players: addOrUpdatePlayer(state, player),
        ownedProperties: removeOwnedProperty(state, propertyPosition)
    };

    if (prevBalance < 0) {
        const property = state.ownedProperties[player.boardPosition];
        return payRent(updated, player, property, Math.abs(prevBalance));
    }

    return updated;
}
