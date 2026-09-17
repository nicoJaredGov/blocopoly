import {
    PlayerDTO,
    mutatePlayerOnVacation,
    mutatePlayerToJail,
    mutateReleaseFromJail
} from "@/app/game/player/Player";
import { GameStateDTO } from "../../GameState";
import { getActivePlayer, updatePlayerState } from "../utils";
import { boardConfig } from "@/app/game/board/board_configs/boardAccessor";
import { getPropertyConfig } from "@/app/setup/BoardConfig";
import { OWNABLE_PROPERTY_TYPES, PropertyType } from "@/app/game/property/PropertyType";
import { payRent } from "../payRent";

const NUM_BOARD_POSITIONS = 40;
const DOUBLES_LIMIT = 3;
const JAIL_FINE = 50;
const MAX_JAIL_TURNS = 2;

type D6Result = 1 | 2 | 3 | 4 | 5 | 6;

function rollD6(): D6Result {
    return (Math.floor(Math.random() * 6) + 1) as D6Result;
}

function shouldCollectSalary(prevPosition: number, elapsed: number): boolean {
    return prevPosition + elapsed >= NUM_BOARD_POSITIONS;
}

function advancePlayer(player: PlayerDTO, elapsed: number): void {
    player.boardPosition = (player.boardPosition + elapsed) % NUM_BOARD_POSITIONS;
}

function releaseAndMove(state: GameStateDTO, player: PlayerDTO, elapsed: number): GameStateDTO {
    const prevPosition = player.boardPosition;
    advancePlayer(player, elapsed);
    return resolveLanding(state, player, prevPosition, elapsed);
}

/**
 * Applies landing-cell effects after the player's boardPosition has been updated.
 * Handles GO_TO_JAIL, VACATION, and salary collection for passing GO.
 * TODO: add unowned property, owned property, surprise/community chest handling.
 */
function resolveLanding(
    state: GameStateDTO,
    player: PlayerDTO,
    prevPosition: number,
    elapsed: number
): GameStateDTO {
    let updated = { ...state };
    const propertyType = getPropertyConfig(boardConfig, player.boardPosition)?.type;

    if (shouldCollectSalary(prevPosition, elapsed) && propertyType !== PropertyType.GO_TO_JAIL) {
        player.balance += state.startSalary;
    }

    switch (propertyType) {
        case PropertyType.GO_TO_JAIL:
            mutatePlayerToJail(player);
            return updatePlayerState(updated, player);

        case PropertyType.VACATION:
            mutatePlayerOnVacation(player, state.vacationBalance);
            updated.vacationBalance = 0;
            break;

        case OWNABLE_PROPERTY_TYPES:
            const property = state.ownedProperties[player.boardPosition];
            if (!property || property.owner === -1 || property.isMortgaged) {
                break;
            }
            if (player.id !== property.owner) {
                return payRent(updated, player, property, property.rent);
            }
            break;

        case PropertyType.CHANCE:
            // TODO
            break;

        case PropertyType.COMMUNITY_CHEST:
            // TODO
            break;

        case PropertyType.INCOME_TAX:
            // TODO
            break;

        case PropertyType.WEALTH_TAX:
    }

    return updatePlayerState(updated, player);
}

/**
 * Handles a roll when the active player is in Jail.
 *
 * - Doubles: released from jail, move normally, turn ends (no extra roll).
 * - No doubles + jailTurnsElapsed < MAX_JAIL_TURNS: increment counter, stay in jail.
 * - No doubles + jailTurnsElapsed === MAX_JAIL_TURNS: pay fine, release, move normally.
 */
function handleJailRoll(state: GameStateDTO, player: PlayerDTO): GameStateDTO {
    const firstDice = rollD6();
    const secondDice = rollD6();
    const elapsed = firstDice + secondDice;
    const isDoubles = firstDice === secondDice;

    if (isDoubles) {
        mutateReleaseFromJail(player);
        return releaseAndMove(state, player, elapsed);
    }

    if (player.jailTurnsElapsed < MAX_JAIL_TURNS) {
        player.jailTurnsElapsed += 1;
        player.stage = "END_TURN";
        return updatePlayerState(state, player);
    }

    player.balance -= JAIL_FINE;
    mutateReleaseFromJail(player);
    return releaseAndMove(state, player, elapsed);
}

/**
 * Handles the roll when the active player previously landed on Vacation.
 * The vacation turn is simply skipped; the player returns to a normal roll_dice stage.
 */
function handleVacationRoll(state: GameStateDTO, player: PlayerDTO): GameStateDTO {
    player.isOnVacation = false;
    return updatePlayerState(state, player);
}

/**
 * Standard roll for a player who is neither in Jail nor on Vacation.
 */
function handleNormalRoll(state: GameStateDTO, player: PlayerDTO): GameStateDTO {
    const firstDice = rollD6();
    const secondDice = rollD6();
    const elapsed = firstDice + secondDice;

    if (firstDice === secondDice) {
        player.doublesRolled += 1;
        if (player.doublesRolled === DOUBLES_LIMIT) {
            player.stage = "WAITING";
            return updatePlayerState(state, mutatePlayerToJail(player));
        }
        player.stage = "ROLL_DICE";
    } else {
        player.doublesRolled = 0;
        player.stage = "END_TURN";
    }

    return releaseAndMove(state, player, elapsed);
}

export function rollDice(state: GameStateDTO): GameStateDTO {
    const player = getActivePlayer(state);

    if (player.isOnVacation) return handleVacationRoll(state, player);
    if (player.isInJail) return handleJailRoll(state, player);

    return handleNormalRoll(state, player);
}
