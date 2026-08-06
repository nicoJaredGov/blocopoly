import { PlayerStage } from "./PlayerStage";

/**
 * Serialized player state — only mutable fields sent over the wire.
 * Static config (name, piece, colour, isHost) lives in PlayerVM.
 */
export interface PlayerDTO {
    id: number;
    balance: number;
    boardPosition: number;
    /** Counts consecutive turns spent in jail (0–2); resets on release */
    jailTurnsElapsed: number;
    /** Number of consecutive times a double has been rolled */
    doublesRolled: number;
    /** Array of board positions of properties owned by this player */
    propertiesOwned: number[];
    stage: PlayerStage;
    isHost: boolean;
}

/**
 * Client-side view model — merges serialized Player state with static
 * config loaded once at session start (e.g. from lobby/game setup).
 */
export interface Player extends PlayerDTO {
    name: string;
    piece: string;
    colour: string;
}
