import { GameStateDTO } from "../../GameState";
import { buyHouseOnProperty } from "../../../property/OwnableProperty";
import { updateOwnedProperty } from "../../utils";
import { getBlockPositions, getOwnableConfig } from "@/app/game/board/board_configs/boardConfig";

export function sellProperty(
    state: GameStateDTO,
    payload: { playerId: number; propertyPosition: number }
): GameStateDTO {
    const { playerId, propertyPosition } = payload;

    const config = getOwnableConfig(propertyPosition);
    if (!config) return state;

    // Check if player now owns the whole block
    const blockPositions = getBlockPositions(propertyPosition);
    const hasWholeBlock = blockPositions.every(
        (pos) => pos === propertyPosition || state.ownedProperties[pos]?.owner === playerId
    );

    const property = state.ownedProperties[propertyPosition];
    const updatedProperty = buyHouseOnProperty(property);

    return updateOwnedProperty(state, updatedProperty);
}
