import { GameStateDTO } from "../GameState";

export function bankrupt(state: GameStateDTO, payload: { playerId: number }): GameStateDTO {
    const { playerId } = payload;

    let activePlayer = state.activePlayer;
    let players = { ...state.players };

    // Advance player if active player has bankrupted
    if (state.activePlayer === playerId) {
        const nextId = (playerId + 1) % Object.keys(state.players).length;
        activePlayer = nextId;
        players = {
            ...players,
            [nextId]: { ...players[nextId], stage: "ROLL_DICE" }
        };
    }

    const { [playerId]: _, ...remainingPlayers } = players;

    const trades = state.trades.filter((t) => t.initiator !== playerId && t.recipient !== playerId);
    const ownedProperties = Object.fromEntries(
        Object.entries(state.ownedProperties).filter(([_, p]) => p.owner !== playerId)
    );

    return {
        ...state,
        players: remainingPlayers,
        ownedProperties,
        activePlayer,
        trades
    };
}
