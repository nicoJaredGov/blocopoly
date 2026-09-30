import { GameStateDTO } from "../../GameState";
import {
    getOwnablePropertyConfig,
    increasePlayerBalance,
    updatedPropertyAndPlayer
} from "../utils";
import { isValidPropertySale } from "./saleValidation";
import { payRent } from "../payRent";

export function mortgageProperty(
    state: GameStateDTO,
    payload: { playerId: number; propertyPosition: number }
): GameStateDTO {
    const { playerId, propertyPosition } = payload;
    const existing = state.ownedProperties[propertyPosition];
    const config = getOwnablePropertyConfig(state, propertyPosition);
    if (!config) return state;

    if (!isValidPropertySale(state, existing, playerId, propertyPosition)) {
        return state;
    }

    const prevBalance = state.players[playerId]?.balance;
    const player = increasePlayerBalance(state, playerId, config.cost / 2);
    const updatedProperty = { ...existing, isMortgaged: true };
    const updated = updatedPropertyAndPlayer(state, updatedProperty, player);

    if (prevBalance < 0) {
        const property = state.ownedProperties[player.boardPosition];
        return payRent(updated, player, property, Math.abs(prevBalance));
    }

    return updated;
}
