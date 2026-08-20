import { GameStateDTO } from "../../GameState";
import { buyOwnableProperty } from "../../../property/OwnableProperty";
import { decreasePlayerBalance, updatedPropertyAndPlayer } from "../utils";
import { getOwnableConfig, getBlockPositions } from "../../../board/board_configs/boardConfig";
import { isValidPropertyPurchase } from "./purchaseValidation";

export function buyProperty(
    state: GameStateDTO,
    payload: { playerId: number; propertyPosition: number }
): GameStateDTO {
    const { playerId, propertyPosition } = payload;
    const config = getOwnableConfig(propertyPosition);
    if (!config) return state;

    if (!isValidPropertyPurchase(state, playerId, propertyPosition, config.cost)) {
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
