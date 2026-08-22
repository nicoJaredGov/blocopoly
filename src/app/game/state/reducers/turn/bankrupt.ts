import { GameStateDTO } from "../../GameState";
import { getNextAvailablePlayer } from "../utils";

export function bankrupt(state: GameStateDTO, payload: { playerId: number }): GameStateDTO {
    const { playerId } = payload;

    let activePlayer = state.activePlayer;
    let players = state.players;
    players = {
        ...state.players,
        [playerId]: { ...state.players[playerId], stage: "BANKRUPT" }
    };

    // Advance player if active player has bankrupted
    if (state.activePlayer === playerId) {
        const nextId = getNextAvailablePlayer(state);
        activePlayer = nextId;
        players = {
            ...players,
            [nextId]: { ...players[nextId], stage: "ROLL_DICE" }
        };
    }

    const trades = state.trades.filter((t) => t.initiator !== playerId && t.recipient !== playerId);
    const ownedProperties = Object.fromEntries(
        Object.entries(state.ownedProperties).filter(([_, p]) => p.owner !== playerId)
    );

    return {
        ...state,
        players,
        ownedProperties,
        activePlayer,
        trades
    };
}
