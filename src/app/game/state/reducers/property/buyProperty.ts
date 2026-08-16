import { GameStateDTO } from "../../GameState";
import { buyOwnableProperty } from "../../../property/OwnableProperty";
import { decreasePlayerBalance, getPlayerBalance, updatedPropertyAndPlayer } from "../../utils";
import { getOwnableConfig, getBlockPositions } from "../../../board/board_configs/boardConfig";

export function buyProperty(
    state: GameStateDTO,
    payload: { playerId: number; propertyPosition: number }
): GameStateDTO {
    const { playerId, propertyPosition } = payload;
    const config = getOwnableConfig(propertyPosition);
    if (!config) return state;

    if (!isValidPurchase(state, playerId, propertyPosition, config.cost)) {
        return state;
    }

    const player = decreasePlayerBalance(state, playerId, config.cost);
    const newProperty = {
        position: propertyPosition,
        numHouses: 0,
        isMortgaged: false,
        owner: undefined,
        baseRent: config.baseRent,
        rent: config.baseRent,
        cost: config.cost
    };
    const hasWholeBlock = hasWholeBlockCheck(state, propertyPosition, playerId);
    const updated = buyOwnableProperty(newProperty, playerId, config.baseRent, hasWholeBlock);

    return updatedPropertyAndPlayer(state, updated, player);
}

function isValidPurchase(
    state: GameStateDTO,
    playerId: number,
    propertyPosition: number,
    cost: number
): boolean {
    // Property must not already be owned
    if (state.ownedProperties[propertyPosition]) return false;

    // Player must be able to afford the property
    const balance = getPlayerBalance(state, playerId);
    if (balance < cost) return false;

    return true;
}

function hasWholeBlockCheck(
    state: GameStateDTO,
    propertyPosition: number,
    playerId: number
): boolean {
    const blockPositions = getBlockPositions(propertyPosition);
    return blockPositions.every(
        (pos) => pos === propertyPosition || state.ownedProperties[pos]?.owner === playerId
    );
}
