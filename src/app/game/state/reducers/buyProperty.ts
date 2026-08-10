import { GameStateDTO } from "../GameState";
import { buyOwnableProperty } from "../../property/OwnableProperty";
import { updateOwnedProperty } from "../utils";
import { getOwnableConfig, getBlockPositions } from "../../board/board_configs/boardConfig";

//TODO: Add check for if the player balance is enough to buy where this function is called
export function buyProperty(
    state: GameStateDTO,
    payload: { playerId: number; propertyPosition: number }
): GameStateDTO {
    const { playerId, propertyPosition } = payload;

    const config = getOwnableConfig(propertyPosition);
    if (!config) return state;

    const blockPositions = getBlockPositions(propertyPosition);
    const hasWholeBlock = blockPositions.every(
        (pos) => pos === propertyPosition || state.ownedProperties[pos]?.owner === playerId
    );

    const existing = state.ownedProperties[propertyPosition];
    const updated = buyOwnableProperty(existing, playerId, config.baseRent, hasWholeBlock);
    return updateOwnedProperty(state, updated);
}
