/**
 * Plain data interface representing a player in the game.
 * No methods — all mutations happen in the reducer.
 */
export interface Player {
    id: number;
    name: string;
    /** The shape identifier of the player's chosen piece */
    piece: string;
    /** The hex colour of the player's chosen piece */
    colour: string;
    balance: number;
    boardPosition: number;
    isHost: boolean;
    inJail: boolean;
    /** Counts consecutive turns spent in jail (0–2); resets on release */
    jailTurnsElapsed: number;
    isBankrupt: boolean;
    /** Array of board positions of properties owned by this player */
    propertiesOwned: number[];
}
