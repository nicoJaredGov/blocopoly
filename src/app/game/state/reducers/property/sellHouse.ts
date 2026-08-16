import { GameStateDTO } from "../../GameState";
import { OwnablePropertyDTO, sellHouseOnProperty } from "../../../property/OwnableProperty";
import { increasePlayerBalance, updatedPropertyAndPlayer } from "../../utils";
import { getBlockPositions, getOwnableConfig } from "../../../board/board_configs/boardConfig";

export function sellHouse(
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
    const updated = sellHouseOnProperty(existing);

    return updatedPropertyAndPlayer(state, updated, player);
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

    // Must have at least one house to sell
    if (existing.numHouses === 0) return false;

    // Must have an even number of houses across block (<= current property)
    const blockPositions = getBlockPositions(propertyPosition);
    const hasEqualHouses = blockPositions.every(
        (pos) =>
            pos === propertyPosition || state.ownedProperties[pos]?.numHouses <= existing.numHouses
    );
    if (!hasEqualHouses) return false;

    return true;
}
