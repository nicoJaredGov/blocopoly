import { GameStateDTO } from "../../GameState";
import { buyOwnableProperty, OwnablePropertyConfig } from "../../../property/OwnableProperty";
import { decreasePlayerBalance, updatedPropertyAndPlayer } from "../utils";
import { boardConfig } from "../../../board/board_configs/boardAccessor";
import { getBlockPositions, getOwnableConfig } from "@/app/setup/BoardConfig";
import { isValidPropertyPurchase } from "./purchaseValidation";

export function buyProperty(
    state: GameStateDTO,
    payload: { playerId: number; propertyPosition: number }
): GameStateDTO {
    const { playerId, propertyPosition } = payload;
    const config = getOwnableConfig(boardConfig, propertyPosition);
    if (!config) return state;

    if (!isValidPropertyPurchase(state, playerId, propertyPosition, config.cost)) {
        return state;
    }

    return buyPropertyForCost(state, playerId, config, config.cost);
}

/** Transfers property to player and reduces their balance by provided cost.
 *
 * Validation does not occur here and should be handled before this is called.
 */
export function buyPropertyForCost(
    state: GameStateDTO,
    playerId: number,
    propertyConfig: OwnablePropertyConfig,
    cost: number
): GameStateDTO {
    const player = decreasePlayerBalance(state, playerId, cost);
    const newProperty = {
        position: propertyConfig.position,
        numHouses: 0,
        isMortgaged: false,
        owner: -1,
        baseRent: propertyConfig.baseRent,
        rent: propertyConfig.baseRent,
        cost: propertyConfig.cost
    };

    const hasWholeBlock = hasWholeBlockCheck(state, propertyConfig.position, playerId);
    const updated = buyOwnableProperty(
        newProperty,
        playerId,
        propertyConfig.baseRent,
        hasWholeBlock
    );

    return updatedPropertyAndPlayer(state, updated, player);
}

function hasWholeBlockCheck(
    state: GameStateDTO,
    propertyPosition: number,
    playerId: number
): boolean {
    const blockPositions = getBlockPositions(boardConfig, propertyPosition);
    return blockPositions.every(
        (pos) => pos === propertyPosition || state.ownedProperties[pos]?.owner === playerId
    );
}
