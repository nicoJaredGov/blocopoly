import { GameStateDTO } from "../GameState";
import { buyOwnableProperty } from "../../property/OwnableProperty";
import { updateOwnedProperty } from "../utils";

//TODO: Add check for if the player balance is enough to buy where this function is called
export function buyProperty(
    state: GameStateDTO,
    payload: {
        playerId: number;
        propertyPosition: number;
        baseRent: number;
        hasWholeBlock: boolean;
    }
): GameStateDTO {
    const { playerId, propertyPosition, baseRent, hasWholeBlock } = payload;
    const property = state.ownedProperties[propertyPosition];
    const ownedProperty = buyOwnableProperty(property, playerId, baseRent, hasWholeBlock);

    return updateOwnedProperty(state, ownedProperty);
}
