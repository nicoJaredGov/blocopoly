import { PlayerDTO, mutatePlayerToJail } from "@/app/game/player/Player";
import { GameStateDTO } from "../../GameState";
import { addOrUpdatePlayer, getActivePlayer } from "../utils";
import { GO_TO_JAIL_POSITION, VACATION_POSITION } from "../../../constants";

const NUM_BOARD_POSITIONS = 40;
const DOUBLES_LIMIT = 3;

type D6Result = 1 | 2 | 3 | 4 | 5 | 6;

function rollD6(): D6Result {
    return (Math.floor(Math.random() * 6) + 1) as D6Result;
}

function updatePlayerState(state: GameStateDTO, player: PlayerDTO): GameStateDTO {
    return {
        ...state,
        players: addOrUpdatePlayer(state, player)
    };
}

function mutatePlayerOnVacation(player: PlayerDTO, vacationBalance: number) {
    player.stage = "VACATION";
    player.balance += vacationBalance;
}

function shouldCollectSalary(player: PlayerDTO, elapsed: number): boolean {
    return player.stage !== "JAIL" && player.boardPosition + elapsed >= NUM_BOARD_POSITIONS;
}

export function rollDice(state: GameStateDTO): GameStateDTO {
    const player = getActivePlayer(state);

    // Skip and reset if player is on vacation
    if (player.stage === "VACATION") {
        player.stage = "WAITING";
        return updatePlayerState(state, player);
    }

    // Roll dice
    const firstDice = rollD6();
    const secondDice = rollD6();
    const elapsed = firstDice + secondDice;

    // Handle doubles roll
    if (firstDice === secondDice) {
        player.doublesRolled += 1;
        player.stage = "ROLL_AGAIN";
        if (player.doublesRolled === DOUBLES_LIMIT) {
            return updatePlayerState(state, mutatePlayerToJail(player));
        }
    } else {
        player.doublesRolled = 0;
        player.stage = "END_TURN";
    }

    // Logic based on where the player lands
    player.boardPosition = (player.boardPosition + elapsed) % NUM_BOARD_POSITIONS;
    let updated = { ...state };
    // TODO Logic for where you land here - unowned property, owned, go-to-jail, vacation, surprise/community chest
    switch (player.boardPosition) {
        case GO_TO_JAIL_POSITION:
            mutatePlayerToJail(player);
            break;
        case VACATION_POSITION:
            mutatePlayerOnVacation(player, state.vacationBalance);
            updated.vacationBalance = 0;
            break;
    }

    if (shouldCollectSalary(player, elapsed)) {
        player.balance += state.startSalary;
    }

    return {
        ...updated,
        players: addOrUpdatePlayer(state, player)
    };
}
