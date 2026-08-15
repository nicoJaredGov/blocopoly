import { GameStateDTO } from "../../GameState";
import { getBlockPositions, getOwnableConfig } from "@/app/game/board/board_configs/boardConfig";
import { addOrUpdatePlayer, increasePlayerBalance, removeOwnedProperty } from "../../utils";

export function sellProperty(
    state: GameStateDTO,
    payload: { playerId: number; propertyPosition: number }
): GameStateDTO {
    const { playerId, propertyPosition } = payload;

    // Check that the owner is selling their own property
    if (state.ownedProperties[propertyPosition]?.owner !== playerId) return state;

    const config = getOwnableConfig(propertyPosition);
    if (!config) return state;

    // Check if there are no houses on whole block
    const blockPositions = getBlockPositions(propertyPosition);
    const hasSomeHouses = blockPositions.some((pos) => state.ownedProperties[pos]?.numHouses > 0);
    if (hasSomeHouses) return state;

    const player = increasePlayerBalance(state, playerId, config.cost / 2);

    return {
        ...state,
        players: addOrUpdatePlayer(state, player),
        ownedProperties: removeOwnedProperty(state, propertyPosition)
    };
}
