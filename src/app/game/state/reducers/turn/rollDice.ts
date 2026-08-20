import { GameStateDTO } from "../../GameState";
import { addOrUpdatePlayer, getActivePlayer, sendPlayerToJail } from "../utils";

const NUM_BOARD_POSITIONS = 40;
const DOUBLES_LIMIT = 3;
const GO_TO_JAIL = 20;
const VACATION = 30;

type D6Result = 1 | 2 | 3 | 4 | 5 | 6;

function rollD6(): D6Result {
    return (Math.floor(Math.random() * 6) + 1) as D6Result;
}

export function rollDice(state: GameStateDTO): GameStateDTO {
    const player = getActivePlayer(state);

    const firstDice = rollD6();
    const secondDice = rollD6();
    const elapsedPositions = firstDice + secondDice;

    if (firstDice === secondDice) {
        player.doublesRolled += 1;

        if (player.doublesRolled === DOUBLES_LIMIT) {
            return {
                ...state,
                players: sendPlayerToJail(state, player)
            };
        }

        player.stage = "ROLL_AGAIN";
    } else {
        player.doublesRolled = 0;
        player.stage = "END_TURN";
    }

    player.boardPosition = (player.boardPosition + elapsedPositions) % NUM_BOARD_POSITIONS;

    // TODO Logic for where you land here - unowned property, owned, go-to-jail, vacation, surprise/community chest
    switch (player.boardPosition) {
        case GO_TO_JAIL:
    }

    return {
        ...state,
        players: addOrUpdatePlayer(state, player)
    };
}
