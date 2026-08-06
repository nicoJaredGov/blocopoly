import { GameStateDTO } from "../GameState";
import { updatePlayer } from "../utils";

const NUM_BOARD_POSITIONS = 40;
const DOUBLES_LIMIT = 3;
const JAIL_POSITION = 10;

type D6Result = 1 | 2 | 3 | 4 | 5 | 6;

function rollD6(): D6Result {
    return (Math.floor(Math.random() * 6) + 1) as D6Result;
}

export function rollDice(state: GameStateDTO, playerId: number): GameStateDTO {
    const player = { ...state.players[playerId] };

    const firstDice = rollD6();
    const secondDice = rollD6();
    const elapsedPositions = firstDice + secondDice;

    if (firstDice === secondDice) {
        player.doublesRolled += 1;

        if (player.doublesRolled === DOUBLES_LIMIT) {
            player.stage = "JAIL";
            player.doublesRolled = 0;
            player.boardPosition = JAIL_POSITION;
            return updatePlayer(state, player);
        }

        player.stage = "ROLL_AGAIN";
    } else {
        player.doublesRolled = 0;
        player.stage = "END_TURN";
    }

    player.boardPosition = (player.boardPosition + elapsedPositions) % NUM_BOARD_POSITIONS;

    return updatePlayer(state, player);
}
