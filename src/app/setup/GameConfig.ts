import { BoardId } from "./boards/boardRegistry";

export interface GameConfig {
    boardId: BoardId;
    startSalary: number;
    /** Limits players in jail from collecting rent, building houses, and buying properties */
    shouldLimitJailPrivileges: boolean;
    incomeTaxPercentage: number;
    wealthTaxPercentage: number;
}
