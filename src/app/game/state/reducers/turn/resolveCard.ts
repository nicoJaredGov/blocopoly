import { GameStateDTO } from "../../GameState";
import { CardTypeValue, CardType } from "@/app/game/cards/CardType";
import {
    getActivePlayer,
    updatePlayerState,
    getPlayerById,
    updateMultiplePlayerStates,
    getPropertiesOwnedByPlayer,
    getOtherExistingPlayers
} from "../utils";
import { mutatePlayerToJail } from "@/app/game/player/Player";
import { payBank } from "../payBank";
import { GO_TO_JAIL_POSITION, NUM_BOARD_POSITIONS } from "@/app/game/constants";
import { resolveLanding } from "./resolveLanding";

/**
 * Interface for card data passed to resolvers.
 * Different card types use different fields.
 */
export interface CardData {
    /** Amount of money for PAY, EARN, COLLECT_FROM_EVERYONE, PAY_EVERYONE */
    amount?: number;
    /** Target board position for GO_TO */
    position?: number;
    /** Number of spaces to go back for GO_BACK */
    spaces?: number;
    /** Cost per house for HOUSE_REPAIRS */
    costPerHouse?: number;
    /** Cost per hotel for HOUSE_REPAIRS */
    costPerHotel?: number;
}

/**
 * Main resolver that dispatches to specific card type handlers.
 */
export function resolveCard(
    cardType: CardTypeValue,
    cardData: CardData,
    state: GameStateDTO
): GameStateDTO {
    switch (cardType) {
        case CardType.PAY:
            return resolvePay(cardData.amount || 0, state);
        case CardType.EARN:
            return resolveEarn(cardData.amount || 0, state);
        case CardType.GO_TO:
            return resolveGoTo(cardData.position || 0, state);
        case CardType.JAIL_FREE_CARD:
            return resolveJailFreeCard(state);
        case CardType.GO_TO_JAIL:
            return resolveGoToJail(state);
        case CardType.COLLECT_FROM_EVERYONE:
            return resolveCollectFromEveryone(cardData.amount || 0, state);
        case CardType.HOUSE_REPAIRS:
            return resolveHouseRepairs(
                cardData.costPerHouse || 0,
                cardData.costPerHotel || 0,
                state
            );
        case CardType.GO_BACK:
            return resolveGoBack(cardData.spaces || 0, state);
        case CardType.PAY_EVERYONE:
            return resolvePayEveryone(cardData.amount || 0, state);
        default:
            console.warn(`Unknown card type: ${cardType}`);
            return state;
    }
}

/**
 * PAY: Active player pays the specified amount to the bank (or vacation pot).
 */
function resolvePay(amount: number, state: GameStateDTO): GameStateDTO {
    const player = getActivePlayer(state);
    return payBank(state, player, amount);
}

/**
 * EARN: Active player receives the specified amount from the bank.
 */
function resolveEarn(amount: number, state: GameStateDTO): GameStateDTO {
    const player = getActivePlayer(state);
    player.balance += amount;
    return updatePlayerState(state, player);
}

/**
 * GO_TO: Active player moves to the specified board position.
 * Collects salary if passing GO.
 */
function resolveGoTo(position: number, state: GameStateDTO): GameStateDTO {
    const player = getActivePlayer(state);
    const prevPosition = player.boardPosition;

    player.boardPosition = position % NUM_BOARD_POSITIONS;

    const shouldCollectSalary =
        position !== GO_TO_JAIL_POSITION && player.boardPosition < prevPosition;

    if (shouldCollectSalary) {
        player.balance += state.startSalary;
    }

    return resolveLanding(state, player);
}

/**
 * JAIL_FREE_CARD: Active player receives a Get Out of Jail Free card.
 */
function resolveJailFreeCard(state: GameStateDTO): GameStateDTO {
    const player = getActivePlayer(state);
    player.numJailFreeCards += 1;
    return updatePlayerState(state, player);
}

/**
 * GO_TO_JAIL: Active player is sent to jail immediately.
 */
function resolveGoToJail(state: GameStateDTO): GameStateDTO {
    const player = getActivePlayer(state);
    mutatePlayerToJail(player);
    return updatePlayerState(state, player);
}

/**
 * COLLECT_FROM_EVERYONE: Active player collects the specified amount from every other player.
 * Players who cannot afford the full amount pay what they can.
 */
function resolveCollectFromEveryone(amount: number, state: GameStateDTO): GameStateDTO {
    const activePlayer = getActivePlayer(state);
    const updatedPlayers = [activePlayer];

    // Collect from all other non-bankrupt players
    for (const playerId in state.players) {
        const id = parseInt(playerId);
        if (id === activePlayer.id) continue;

        const otherPlayer = getPlayerById(state, id);
        if (otherPlayer.stage === "BANKRUPT" || otherPlayer.stage === "LEFT_GAME") {
            continue;
        }

        // Transfer money (player pays what they can afford)
        const payment = Math.min(amount, otherPlayer.balance);
        otherPlayer.balance -= payment;
        activePlayer.balance += payment;

        updatedPlayers.push(otherPlayer);
    }

    return updateMultiplePlayerStates(state, updatedPlayers);
}

/**
 * HOUSE_REPAIRS: Active player pays for repairs on all their properties.
 * Cost is per house/hotel owned.
 */
function resolveHouseRepairs(
    costPerHouse: number,
    costPerHotel: number,
    state: GameStateDTO
): GameStateDTO {
    const player = getActivePlayer(state);
    const properties = getPropertiesOwnedByPlayer(state, player.id);

    let totalCost = 0;
    for (const property of properties) {
        if (property.numHouses === 5) {
            // Hotel (5 houses = 1 hotel in Monopoly)
            totalCost += costPerHotel;
        } else {
            totalCost += property.numHouses * costPerHouse;
        }
    }

    return payBank(state, player, totalCost);
}

/**
 * GO_BACK: Active player moves backward the specified number of spaces.
 * Does not collect salary (moving backwards never passes GO in the forward direction).
 */
function resolveGoBack(spaces: number, state: GameStateDTO): GameStateDTO {
    const player = getActivePlayer(state);

    player.boardPosition =
        (player.boardPosition - spaces + NUM_BOARD_POSITIONS) % NUM_BOARD_POSITIONS;

    return resolveLanding(state, player);
}

/**
 * PAY_EVERYONE: Active player pays the specified amount to every other player.
 * If the player cannot afford to pay everyone, their balance is split across all players
 */
function resolvePayEveryone(amount: number, state: GameStateDTO): GameStateDTO {
    const activePlayer = getActivePlayer(state);
    const updatedPlayers = [activePlayer];

    const otherExistingPlayers = getOtherExistingPlayers(state).map((p) => p.id);
    if (otherExistingPlayers.length === 0) return state;

    const allowancePerPerson = Math.round(activePlayer.balance / otherExistingPlayers.length);
    const payment = Math.min(amount, allowancePerPerson);

    // Pay to all other non-bankrupt players
    for (const playerId of otherExistingPlayers) {
        const otherPlayer = getPlayerById(state, playerId);
        activePlayer.balance -= payment;
        otherPlayer.balance += payment;
        updatedPlayers.push(otherPlayer);
    }

    return updateMultiplePlayerStates(state, updatedPlayers);
}
