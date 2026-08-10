import { GameStateDTO } from "../GameState";
import { buyHouseOnProperty } from "../../property/OwnableProperty";
import { updateOwnedProperty } from "../utils";
import { getBlockPositions, getOwnableConfig } from "../../board/board_configs/boardConfig";

export function buyHouse(state: GameStateDTO, propertyPosition: number): GameStateDTO {
    const config = getOwnableConfig(propertyPosition);
    if (!config) return state;

    // Check if player can afford the house
    const playerId = state.activePlayer;
    const balance = state.players[playerId].balance;
    if (balance < config.cost) return state;

    // Check if other properties in block have enough houses (>= current property)
    const existing = state.ownedProperties[propertyPosition];
    const blockPositions = getBlockPositions(propertyPosition);
    const hasEnoughHouses = blockPositions.every(
        (pos) =>
            pos !== propertyPosition && state.ownedProperties[pos]?.numHouses >= existing.numHouses
    );
    if (!hasEnoughHouses) return state;

    const updated = buyHouseOnProperty(existing);
    return updateOwnedProperty(state, updated);
}
