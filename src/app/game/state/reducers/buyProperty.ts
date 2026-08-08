import { GameStateDTO } from "../GameState";
import { buyOwnableProperty } from "../../property/OwnableProperty";

export function buyProperty(
    state: GameStateDTO,
    playerId: number,
    propertyPosition: number,
    marketCap: number,
    baseRentWeighting: number
): GameStateDTO {
    const property = state.ownedProperties[propertyPosition];
    const ownedProperty = buyOwnableProperty(property, playerId, marketCap, baseRentWeighting);

    return {
        ...state,
        ownedProperties: {
            ...state.ownedProperties,
            [property.position]: ownedProperty
        }
    };
}
