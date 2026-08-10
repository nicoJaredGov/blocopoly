import { GameStateDTO } from "../GameState";
import { buyHouseOnProperty } from "../../property/OwnableProperty";
import { updateOwnedProperty } from "../utils";

//TODO
export function sellProperty(
    state: GameStateDTO,
    payload: { playerId: number; propertyPosition: number }
): GameStateDTO {
    const { playerId, propertyPosition } = payload;

    const property = state.ownedProperties[propertyPosition];
    const updatedProperty = buyHouseOnProperty(property);

    return updateOwnedProperty(state, updatedProperty);
}
