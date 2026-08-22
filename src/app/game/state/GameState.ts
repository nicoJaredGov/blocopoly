import { Player, PlayerDTO } from "../player/Player";
import { Stage } from "../Stage";
import { Trade } from "../trades/Trade";
import { OwnableProperty, OwnablePropertyDTO } from "../property/OwnableProperty";
import { Property } from "../property/Property";

/**
 * Serialized game state — only mutable data sent over the wire.
 * The board is not included here; it is static config held client-side.
 */
export interface GameStateDTO {
    /** The player who is playing their turn now. */
    activePlayer: number;
    /** Mutable player state keyed by player id */
    players: Record<number, PlayerDTO>;
    /** Mutable ownable property state keyed by board position */
    ownedProperties: Record<number, OwnablePropertyDTO>;
    trades: Trade[];
    stage: Stage;
}

/**
 * Client-side view of the full game — combines lean serialized state with
 * static board config so UI components have everything in one place.
 */
export interface GameState extends GameStateDTO {
    /** The current player on this client device. */
    currentPlayer: number;
    /**
     * Full board — static Property/OwnablePropertyConfig cells hydrated with
     * mutable OwnablePropertyDTO state where available.
     */
    board: (Property | OwnableProperty)[];
}
