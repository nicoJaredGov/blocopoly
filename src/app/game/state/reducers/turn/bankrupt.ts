import { GameStateDTO } from "../../GameState";
import { getNextAvailablePlayer } from "../utils";
import { boardConfig } from "../../../board/board_configs/boardAccessor";
import { getOwnableConfig } from "@/app/setup/BoardConfig";
import { PlayerDTO } from "@/app/game/player/Player";
import { OwnablePropertyDTO } from "@/app/game/property/OwnableProperty";

export function bankrupt(state: GameStateDTO, payload: { playerId: number }): GameStateDTO {
    const { playerId } = payload;
    const bankruptPlayer = state.players[playerId];

    let activePlayer = state.activePlayer;
    let players = { ...state.players };
    let ownedProperties = { ...state.ownedProperties };

    // Calculate liquidation value and pay due rent
    players = liquidateAndPayDueRent(playerId, bankruptPlayer, ownedProperties, players);

    // Mark player as bankrupt
    players = {
        ...players,
        [playerId]: { ...players[playerId], stage: "BANKRUPT", balance: 0 }
    };

    // Advance player if active player has bankrupted
    const advanceResult = advancePlayerIfActiveIsBankrupted(state, playerId, activePlayer, players);
    activePlayer = advanceResult.activePlayer;
    players = advanceResult.players;

    // Remove all trades involving this player
    const trades = state.trades.filter((t) => t.initiator !== playerId && t.recipient !== playerId);

    // Remove all properties owned by the bankrupt player
    ownedProperties = Object.fromEntries(
        Object.entries(ownedProperties).filter(([_, p]) => p.owner !== playerId)
    );

    return {
        ...state,
        players,
        ownedProperties,
        activePlayer,
        trades
    };
}

/**
 * Advance player if active player has bankrupted.
 */
function advancePlayerIfActiveIsBankrupted(
    state: GameStateDTO,
    playerId: number,
    activePlayer: number,
    players: Record<number, PlayerDTO>
): { activePlayer: number; players: Record<number, PlayerDTO> } {
    if (state.activePlayer === playerId) {
        const nextId = getNextAvailablePlayer(state);
        return {
            activePlayer: nextId,
            players: {
                ...players,
                [nextId]: { ...players[nextId], stage: "ROLL_DICE" }
            }
        };
    }
    return { activePlayer, players };
}

/**
 * Calculate liquidation value of all player's assets.
 * Then pays off the due rent partially or fully.
 */
function liquidateAndPayDueRent(
    playerId: number,
    bankruptPlayer: PlayerDTO,
    ownedProperties: Record<number, OwnablePropertyDTO>,
    players: Record<number, PlayerDTO>
): Record<number, PlayerDTO> {
    const rentOwed = Math.abs(Math.min(0, bankruptPlayer.balance));
    // Skip this process if no rent is due
    if (rentOwed === 0) {
        return players;
    }

    const playerProperties = Object.values(ownedProperties).filter((p) => p.owner === playerId);
    let liquidationValue = 0;

    for (const property of playerProperties) {
        const config = getOwnableConfig(boardConfig, property.position);
        if (!config) continue;
        liquidationValue += (property.numHouses * config.cost) / 2;
        liquidationValue += config.cost / 2;
    }

    const landedProperty = ownedProperties[bankruptPlayer.boardPosition];
    if (landedProperty && landedProperty.owner !== -1) {
        const rentRecipient = landedProperty.owner;
        const paymentAmount = Math.min(liquidationValue, rentOwed);

        // Transfer payment to the rent recipient
        return {
            ...players,
            [rentRecipient]: {
                ...players[rentRecipient],
                balance: players[rentRecipient].balance + paymentAmount
            }
        };
    }

    return players;
}
