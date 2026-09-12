/**
 * Temporary singleton accessor used by reducers and the board UI while the
 * game runs in single-player / local-dev mode.
 *
 * TODO: Once the multiplayer backend exists, reducers should receive the
 * BoardConfig (or a BoardId) through GameState rather than importing it as a
 * module-level constant. At that point this file can be deleted and each call
 * site updated to read from state instead.
 */
import { getBoardConfig } from "@/app/setup/boards/boardRegistry";

export const boardConfig = getBoardConfig("custom");
