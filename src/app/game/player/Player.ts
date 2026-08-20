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
    /** Counts consecutive turns spent in jail (0–2); resets on release */
    jailTurnsElapsed: number;
    /** Counts consecutive turns spent on vacation (0-1); */
    vacationTurnsElapsed: number;
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
