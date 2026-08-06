import { PlayerDTO } from "../player/Player";
import { OwnablePropertyDTO } from "../property/OwnableProperty";
import { GameStateDTO } from "./GameState";

/**
 * Returns a new state with a single player's record updated.
 */
export function updatePlayer(state: GameStateDTO, player: PlayerDTO): GameStateDTO {
    return {
        ...state,
        players: {
            ...state.players,
            [player.id]: player
        }
    };
}

/**
 * Returns a new state with a single owned property record updated.
 */
export function updateOwnedProperty(
    state: GameStateDTO,
    property: OwnablePropertyDTO
): GameStateDTO {
    return {
        ...state,
        ownedProperties: {
            ...state.ownedProperties,
            [property.position]: property
        }
    };
}

/**
 * Returns all owned properties belonging to a given player.
 * Use this instead of a propertiesOwned array on PlayerDTO.
 */
export function getPropertiesOwnedByPlayer(
    state: GameStateDTO,
    playerId: number
): OwnablePropertyDTO[] {
    return Object.values(state.ownedProperties).filter((p) => p.owner === playerId);
}
