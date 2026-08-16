import { GameStateDTO } from "../../GameState";
import { OwnablePropertyDTO } from "../../../property/OwnableProperty";
import { getBlockPositions, getOwnableConfig } from "@/app/game/board/board_configs/boardConfig";
import { addOrUpdatePlayer, increasePlayerBalance, removeOwnedProperty } from "../../utils";

export function sellProperty(
    state: GameStateDTO,
    payload: { playerId: number; propertyPosition: number }
): GameStateDTO {
    const { playerId, propertyPosition } = payload;
    const existing = state.ownedProperties[propertyPosition];
    const config = getOwnableConfig(propertyPosition);
    if (!config) return state;

    if (!isValidSell(state, existing, playerId, propertyPosition)) {
        return state;
    }

    const player = increasePlayerBalance(state, playerId, config.cost / 2);

    return {
        ...state,
        players: addOrUpdatePlayer(state, player),
        ownedProperties: removeOwnedProperty(state, propertyPosition)
    };
}

function isValidSell(
    state: GameStateDTO,
    existing: OwnablePropertyDTO | undefined,
    playerId: number,
    propertyPosition: number
): boolean {
    // Property must exist and be owned by this player
    if (!existing) return false;
    if (existing.owner !== playerId) return false;

    // No houses may exist on any property in the block
    const blockPositions = getBlockPositions(propertyPosition);
    const hasSomeHouses = blockPositions.some((pos) => state.ownedProperties[pos]?.numHouses > 0);
    if (hasSomeHouses) return false;

    return true;
}
