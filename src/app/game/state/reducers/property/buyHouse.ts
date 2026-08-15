import { GameStateDTO } from "../../GameState";
import { buyHouseOnProperty } from "../../../property/OwnableProperty";
import { decreasePlayerBalance, getPlayerBalance, updatedPropertyAndPlayer } from "../../utils";
import { getBlockPositions, getOwnableConfig } from "../../../board/board_configs/boardConfig";

export function buyHouse(state: GameStateDTO, propertyPosition: number): GameStateDTO {
    const config = getOwnableConfig(propertyPosition);
    if (!config) return state;

    const playerId = state.activePlayer;
    const existing = state.ownedProperties[propertyPosition];

    // Check if maximum houses reached
    if (existing.numHouses === 5) return state;

    // Check if player can afford the house
    const balance = getPlayerBalance(state, playerId);
    if (balance < config.cost) return state; // TODO need to figure out house pricing

    // Check if other properties in block have enough houses (>= current property)
    const blockPositions = getBlockPositions(propertyPosition);
    const hasEnoughHouses = blockPositions.every(
        (pos) =>
            pos === propertyPosition || state.ownedProperties[pos]?.numHouses >= existing.numHouses
    );
    if (!hasEnoughHouses) return state;

    const player = decreasePlayerBalance(state, playerId, config.cost);
    const updated = buyHouseOnProperty(existing);

    return updatedPropertyAndPlayer(state, updated, player);
}
