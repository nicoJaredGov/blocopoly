import { PlayerDTO } from "../../player/Player";
import { OwnablePropertyDTO } from "../../property/OwnableProperty";
import { GameStateDTO } from "../GameState";

const JAIL_POSITION = 10;

/**
 * Returns a clone of the current active player.
 */
export function getActivePlayer(state: GameStateDTO): PlayerDTO {
    const playerId = state.activePlayer;
    return { ...state.players[playerId] };
}

/**
 * Returns a new state with a single player's record updated.
 */
export function addOrUpdatePlayer(
    state: GameStateDTO,
    player: PlayerDTO
): Record<number, PlayerDTO> {
    return {
        ...state.players,
        [player.id]: player
    };
}

/**
 * Returns new players record with single player set to jail attributes.
 */
export function sendPlayerToJail(
    state: GameStateDTO,
    player: PlayerDTO
): Record<number, PlayerDTO> {
    player.stage = "JAIL";
    player.doublesRolled = 0;
    player.boardPosition = JAIL_POSITION;

    return {
        ...state.players,
        [player.id]: player
    };
}

/**
 * Returns an updated record of owned properties with a single property added.
 */
export function addOrUpdateOwnedProperty(
    state: GameStateDTO,
    property: OwnablePropertyDTO
): Record<number, OwnablePropertyDTO> {
    return {
        ...state.ownedProperties,
        [property.position]: property
    };
}

/**
 * Returns an updated record of owned properties with a single property removed.
 */
export function removeOwnedProperty(
    state: GameStateDTO,
    propertyPosition: number
): Record<number, OwnablePropertyDTO> {
    const { [propertyPosition]: _, ...remainingProperties } = state.ownedProperties;
    return remainingProperties;
}

/**
 * Returns a new state with a single player's record updated.
 */
export function updatedPropertyAndPlayer(
    state: GameStateDTO,
    property: OwnablePropertyDTO,
    player: PlayerDTO
): GameStateDTO {
    return {
        ...state,
        players: addOrUpdatePlayer(state, player),
        ownedProperties: addOrUpdateOwnedProperty(state, property)
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

/**
 * Returns player updated with increased balance.
 */
export function increasePlayerBalance(
    state: GameStateDTO,
    playerId: number,
    money: number
): PlayerDTO {
    const player = { ...state.players[playerId] };
    player.balance += money;
    return player;
}

/**
 * Returns player updated with decreased balance.
 */
export function decreasePlayerBalance(
    state: GameStateDTO,
    playerId: number,
    money: number
): PlayerDTO {
    const player = { ...state.players[playerId] };
    player.balance -= money;
    return player;
}

/**
 * Returns player's balance from state.
 */
export function getPlayerBalance(state: GameStateDTO, playerId: number): number {
    return state.players[playerId].balance;
}
