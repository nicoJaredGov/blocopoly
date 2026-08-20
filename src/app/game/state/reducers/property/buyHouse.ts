import { GameStateDTO } from "../../GameState";
import { buyHouseOnProperty, OwnablePropertyDTO } from "../../../property/OwnableProperty";
import { decreasePlayerBalance, getPlayerBalance, updatedPropertyAndPlayer } from "../utils";
import { getBlockPositions, getOwnableConfig } from "../../../board/board_configs/boardConfig";

export function buyHouse(state: GameStateDTO, payload: { propertyPosition: number }): GameStateDTO {
    const { propertyPosition } = payload;
    const config = getOwnableConfig(propertyPosition);
    if (!config) return state;

    const playerId = state.activePlayer;
    const existing = state.ownedProperties[propertyPosition];

    if (!isValidPurchase(state, existing, config.cost, propertyPosition)) {
        return state;
    }

    const player = decreasePlayerBalance(state, playerId, config.cost);
    const updated = buyHouseOnProperty(existing);

    return updatedPropertyAndPlayer(state, updated, player);
}

function isValidPurchase(
    state: GameStateDTO,
    existing: OwnablePropertyDTO,
    cost: number,
    propertyPosition: number
): boolean {
    if (!existing) return false;
    if (existing.owner !== state.activePlayer) return false;

    // Validate player can afford house
    const balance = getPlayerBalance(state, state.activePlayer);
    if (balance < cost) return false; // TODO need to figure out house pricing

    // Must have less than maximum number of houses
    if (existing.numHouses === 5) return false;

    // Must have an even number of houses across block (>= current property)
    const blockPositions = getBlockPositions(propertyPosition);
    const hasEvenlySpreadHouses = blockPositions.every(
        (pos) =>
            pos === propertyPosition || state.ownedProperties[pos]?.numHouses >= existing.numHouses
    );
    if (!hasEvenlySpreadHouses) return false;

    return true;
}
