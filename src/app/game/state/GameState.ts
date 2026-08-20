import { PlayerDTO } from "../player/Player";
import { Stage } from "./Stage";
import { Trade } from "../trades/Trade";
import { OwnablePropertyDTO } from "../property/OwnableProperty";
import { GameStateAction } from "./GameStateAction";
import {
    rollDice,
    endTurn,
    buyHouse,
    buyProperty,
    sellProperty,
    sellHouse,
    addTrade,
    editTrade,
    removeTrade,
    acceptTrade,
    bankrupt,
    mortgageProperty,
    unmortgageProperty
} from "./reducers";

/**
 * Serialized game state — only mutable data sent over the wire.
 * The board is not included here; it is static config held client-side.
 */
export interface GameStateDTO {
    activePlayer: number;
    /** Mutable player state keyed by player id */
    players: Record<number, PlayerDTO>;
    /** Mutable ownable property state keyed by board position */
    ownedProperties: Record<number, OwnablePropertyDTO>;
    trades: Trade[];
    stage: Stage;
}

export function getInitialState(players: Record<number, PlayerDTO>): GameStateDTO {
    return {
        activePlayer: 0,
        players,
        ownedProperties: {},
        trades: [],
        stage: "NORMAL"
    };
}

type HandlerMap = {
    [K in GameStateAction["type"]]: (
        state: GameStateDTO,
        action: Extract<GameStateAction, { type: K }>
    ) => GameStateDTO;
};

const handlers: HandlerMap = {
    ROLL_DICE: rollDice,
    END_TURN: endTurn,
    BANKRUPT: (state, action) => bankrupt(state, action.payload),
    BUY_PROPERTY: (state, action) => buyProperty(state, action.payload),
    BUY_HOUSE: (state, action) => buyHouse(state, action.payload),
    SELL_PROPERTY: (state, action) => sellProperty(state, action.payload),
    SELL_HOUSE: (state, action) => sellHouse(state, action.payload),
    ADD_TRADE: (state, action) => addTrade(state, action.payload),
    EDIT_TRADE: (state, action) => editTrade(state, action.payload),
    REMOVE_TRADE: (state, action) => removeTrade(state, action.payload),
    ACCEPT_TRADE: (state, action) => acceptTrade(state, action.payload),
    MORTGAGE_PROPERTY: (state, action) => mortgageProperty(state, action.payload),
    UNMORTGAGE_PROPERTY: (state, action) => unmortgageProperty(state, action.payload)
};

export function gameStateReducer(state: GameStateDTO, action: GameStateAction): GameStateDTO {
    const handler = handlers[action.type];
    return handler ? (handler as any)(state, action) : state;
}
