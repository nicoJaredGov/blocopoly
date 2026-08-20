import { GameStateDTO } from "../../GameState";
import { getPlayerBalance } from "../utils";

/**
 * Validates the purchase (or unmortgage) of a property.
 */
export function isValidPropertyPurchase(
    state: GameStateDTO,
    playerId: number,
    propertyPosition: number,
    cost: number
): boolean {
    // Property must not be owned by anyone else
    const property = state.ownedProperties[propertyPosition];
    if (property && property.owner !== playerId) return false;

    // Player must be able to afford the property
    const balance = getPlayerBalance(state, playerId);
    if (balance < cost) return false;

    return true;
}
