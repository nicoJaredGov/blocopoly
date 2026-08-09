import { GameStateDTO } from "../GameState";
import { buyHouseOnProperty } from "../../property/OwnableProperty";
import { updateOwnedProperty } from "../utils";

//TODO: Add check for if the player balance is enough to buy where this function is called
export function buyHouse(state: GameStateDTO, propertyPosition: number): GameStateDTO {
    const property = state.ownedProperties[propertyPosition];
    const updatedProperty = buyHouseOnProperty(property);

    return updateOwnedProperty(state, updatedProperty);
}
