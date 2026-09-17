import { PlayerDTO, mutatePlayerToJail, mutateReleaseFromJail } from "@/app/game/player/Player";
import { GameStateDTO } from "../../GameState";
import { getActivePlayer, updatePlayerState } from "../utils";
import {
    DOUBLES_LIMIT,
    JAIL_FINE,
    MAX_JAIL_TURNS,
    NUM_BOARD_POSITIONS
} from "@/app/game/constants";
import { resolveLanding } from "./resolveLanding";
import { getPropertyConfig } from "@/app/setup/BoardConfig";
import { boardConfig } from "@/app/game/board/board_configs/boardAccessor";
import { PropertyType } from "@/app/game/property/PropertyType";

type D6Result = 1 | 2 | 3 | 4 | 5 | 6;

function rollD6(): D6Result {
    return (Math.floor(Math.random() * 6) + 1) as D6Result;
}

export function rollDice(state: GameStateDTO): GameStateDTO {
    const player = getActivePlayer(state);

    if (player.isOnVacation) return handleVacationRoll(state, player);
    if (player.isInJail) return handleJailRoll(state, player);

    return handleNormalRoll(state, player);
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
 * Standard roll for a player who is neither in Jail nor on Vacation.
 */
function handleNormalRoll(state: GameStateDTO, player: PlayerDTO): GameStateDTO {
    const firstDice = rollD6();
    const secondDice = rollD6();
    const elapsed = firstDice + secondDice;

    if (firstDice === secondDice) {
        player.doublesRolled += 1;
        if (player.doublesRolled === DOUBLES_LIMIT) {
            mutatePlayerToJail(player);
            return updatePlayerState(state, player);
        }
        player.stage = "ROLL_DICE";
    } else {
        player.doublesRolled = 0;
        player.stage = "END_TURN";
    }

    return releaseAndMove(state, player, elapsed);
}

function advancePlayer(player: PlayerDTO, elapsed: number): void {
    player.boardPosition = (player.boardPosition + elapsed) % NUM_BOARD_POSITIONS;
}

function releaseAndMove(state: GameStateDTO, player: PlayerDTO, elapsed: number): GameStateDTO {
    const prevPosition = player.boardPosition;
    advancePlayer(player, elapsed);

    if (shouldCollectSalary(prevPosition, player.boardPosition, elapsed)) {
        player.balance += state.startSalary;
    }

    return resolveLanding(state, player);
}

function shouldCollectSalary(
    prevPosition: number,
    currentPosition: number,
    elapsed: number
): boolean {
    const propertyType = getPropertyConfig(boardConfig, currentPosition)?.type;
    const hasPassedGo = prevPosition + elapsed >= NUM_BOARD_POSITIONS;
    return hasPassedGo && propertyType !== PropertyType.GO_TO_JAIL;
}
