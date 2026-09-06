import { JAIL_POSITION } from "../constants";
import { PlayerStage } from "./PlayerStage";

/**
 * Serialized player state — only mutable fields sent over the wire.
 */
export interface PlayerDTO {
    id: number;
    balance: number;
    /** Number of Get-out-of-jail-free cards */
    numJailFreeCards: number;
    boardPosition: number;
    /** Counts consecutive turns spent in jail; resets on release */
    jailTurnsElapsed: number;
    /** Number of consecutive times a double has been rolled */
    doublesRolled: number;
    stage: PlayerStage;
    isHost: boolean;
}

/**
 * Static display config for a player, provided at session start (lobby/game setup).
 * isHost is on PlayerDTO since the server needs it for authority checks.
 */
export type PlayerConfig = Pick<Player, "id" | "name" | "piece" | "colour">;

/**
 * Client-side view model — merges serialized Player state with static
 * config loaded once at session start (e.g. from lobby/game setup).
 */
export interface Player extends PlayerDTO {
    name: string;
    piece: string;
    colour: string;
}

/**
 * Mutates the player state to be in jail.
 *
 * @returns updated player state
 */
export function mutatePlayerToJail(player: PlayerDTO): PlayerDTO {
    player.stage = "JAIL";
    player.doublesRolled = 0;
    player.boardPosition = JAIL_POSITION;

    return player;
}

/**
 * Clears jail state without changing boardPosition.
 * Caller is responsible for moving the player after release.
 */
export function mutateReleaseFromJail(player: PlayerDTO) {
    player.stage = "END_TURN";
    player.jailTurnsElapsed = 0;
    player.doublesRolled = 0;
}

/**
 *  Mutates the player state to be on vacation and collect the vacation money.
 */
export function mutatePlayerOnVacation(player: PlayerDTO, vacationBalance: number) {
    player.stage = "VACATION";
    player.balance += vacationBalance;
}
