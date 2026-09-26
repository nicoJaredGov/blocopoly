import { GameStateDTO } from "../../GameState";

export function startAuction(state: GameStateDTO): GameStateDTO {
    return {
        ...state,
        stage: "AUCTION"
    };
}
