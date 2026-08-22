import { PlayerDTO, sendPlayerToJail } from "@/app/game/player/Player";
import { GameStateDTO } from "../../GameState";
import { addOrUpdatePlayer, getActivePlayer } from "../utils";
import { GO_TO_JAIL_POSITION, VACATION_POSITION } from "../../../constants";

const NUM_BOARD_POSITIONS = 40;
const DOUBLES_LIMIT = 3;

type D6Result = 1 | 2 | 3 | 4 | 5 | 6;

function rollD6(): D6Result {
    return (Math.floor(Math.random() * 6) + 1) as D6Result;
}

function sendToJail(state: GameStateDTO, player: PlayerDTO): GameStateDTO {
    return {
        ...state,
        players: addOrUpdatePlayer(state, sendPlayerToJail(player))
    };
}

function collectVacationMoney(state: GameStateDTO, player: PlayerDTO): GameStateDTO {
    player.isOnVacation = true;
    player.balance += state.vacationBalance;
    return {
        ...state,
        players: addOrUpdatePlayer(state, player),
        vacationBalance: 0
    };
}

export function rollDice(state: GameStateDTO): GameStateDTO {
    const player = getActivePlayer(state);

    if (player.isOnVacation) {
        player.isOnVacation = false;
        return {
            ...state,
            players: addOrUpdatePlayer(state, player)
        };
    }

    const firstDice = rollD6();
    const secondDice = rollD6();
    const elapsedPositions = firstDice + secondDice;

    if (firstDice === secondDice) {
        player.doublesRolled += 1;
        player.stage = "ROLL_AGAIN";
        if (player.doublesRolled === DOUBLES_LIMIT) {
            return sendToJail(state, player);
        }
    } else {
        player.doublesRolled = 0;
        player.stage = "END_TURN";
    }

    player.boardPosition = (player.boardPosition + elapsedPositions) % NUM_BOARD_POSITIONS;

    // TODO Logic for where you land here - unowned property, owned, go-to-jail, vacation, surprise/community chest
    switch (player.boardPosition) {
        case GO_TO_JAIL_POSITION:
            return sendToJail(state, player);
        case VACATION_POSITION:
            return collectVacationMoney(state, player);
    }

    return {
        ...state,
        players: addOrUpdatePlayer(state, player)
    };
}
