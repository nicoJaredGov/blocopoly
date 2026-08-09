import { GameStateDTO } from "../GameState";
import { buyHouseOnProperty } from "../../property/OwnableProperty";
import { updateOwnedProperty } from "../utils";

//TODO: Add check for if the player balance is enough to buy where this function is called
export function buyHouse(
    state: GameStateDTO,
    payload: { propertyPosition: number; baseRent: number; hasWholeBlock: boolean }
): GameStateDTO {
    const { propertyPosition, baseRent, hasWholeBlock } = payload;
    const property = state.ownedProperties[propertyPosition];
    const updatedProperty = buyHouseOnProperty(property, hasWholeBlock, baseRent);

    return updateOwnedProperty(state, updatedProperty);
}
