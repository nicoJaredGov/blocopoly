import { GameStateDTO } from "../../GameState";
import { buyHouseOnProperty, OwnablePropertyDTO } from "../../../property/OwnableProperty";
import { decreasePlayerBalance, getPlayerBalance, updatedPropertyAndPlayer } from "../../utils";
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

    const blockPositions = getBlockPositions(propertyPosition);
    const balance = getPlayerBalance(state, state.activePlayer);

    const playerCanAfford = balance >= cost; // TODO need to figure out house pricing
    const hasMaxHouses = existing.numHouses === 5;
    // Check if other properties in block have enough houses (>= current property)
    const hasEvenlySpreadHouses = blockPositions.every(
        (pos) =>
            pos === propertyPosition || state.ownedProperties[pos]?.numHouses >= existing.numHouses
    );

    return playerCanAfford && !hasMaxHouses && hasEvenlySpreadHouses;
}
