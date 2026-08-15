import { GameStateDTO } from "../../GameState";
import { sellHouseOnProperty } from "../../../property/OwnableProperty";
import { increasePlayerBalance, updatedPropertyAndPlayer } from "../../utils";
import { getBlockPositions, getOwnableConfig } from "../../../board/board_configs/boardConfig";

export function sellHouse(
    state: GameStateDTO,
    payload: { playerId: number; propertyPosition: number }
): GameStateDTO {
    const { playerId, propertyPosition } = payload;
    const existing = state.ownedProperties[propertyPosition];

    // Check that the owner is selling their own property's house
    if (state.ownedProperties[propertyPosition]?.owner !== playerId) return state;

    // Check if any houses exist to sell
    if (existing.numHouses === 0) return state;

    const config = getOwnableConfig(propertyPosition);
    if (!config) return state;

    // Check that there is an even number of houses across block (<= current property)
    const blockPositions = getBlockPositions(propertyPosition);
    const hasEqualHouses = blockPositions.every(
        (pos) =>
            pos === propertyPosition || state.ownedProperties[pos]?.numHouses <= existing.numHouses
    );
    if (!hasEqualHouses) return state;

    const player = increasePlayerBalance(state, playerId, config.cost / 2);
    const updated = sellHouseOnProperty(existing);

    return updatedPropertyAndPlayer(state, updated, player);
}
