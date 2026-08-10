import { GameStateDTO } from "../../GameState";
import { getBlockPositions, getOwnableConfig } from "@/app/game/board/board_configs/boardConfig";

export function sellProperty(
    state: GameStateDTO,
    payload: { playerId: number; propertyPosition: number }
): GameStateDTO {
    const { playerId, propertyPosition } = payload;

    const config = getOwnableConfig(propertyPosition);
    if (!config) return state;

    // Check if there are no houses on whole block
    const blockPositions = getBlockPositions(propertyPosition);
    const hasSomeHouses = blockPositions.some((pos) => state.ownedProperties[pos]?.numHouses > 0);
    if (hasSomeHouses) return state;

    const player = { ...state.players[playerId] };
    player.balance += config.cost;
    const { [propertyPosition]: _, ...remainingProperties } = state.ownedProperties;

    return {
        ...state,
        players: {
            ...state.players,
            [player.id]: player
        },
        ownedProperties: remainingProperties
    };
}
