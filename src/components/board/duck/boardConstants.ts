import { Direction } from '../../../common/types';
import { boardActionTypes } from './boardActions';
import { cellValue, squashActions } from './types';

export const ROW_LENGTH = 9;
export const CELL_LIMIT = 400;
export const CELL_COUNT_DEFAULT = 27;

export const DEFAULT_BOARD_VALUES: cellValue[] = _.concat(
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 1, 1, 2, 1, 3, 1, 4, 1],
    [5, 1, 6, 1, 7, 1, 8, 1, 9]
) as cellValue[];

export const TEST_BOARD_VALUES = [1, 2, 2, 1] as cellValue[];

export const BOARD_SEED = new Map<string, cellValue[]>([
    ['initial', DEFAULT_BOARD_VALUES],
    ['test', TEST_BOARD_VALUES]
]);

export const actionToDirectionMap = new Map<boardActionTypes, Direction>([
    [boardActionTypes.FOCUS_UP, Direction.UP],
    [boardActionTypes.FOCUS_DOWN, Direction.DOWN],
    [boardActionTypes.FOCUS_LEFT, Direction.LEFT],
    [boardActionTypes.FOCUS_RIGHT, Direction.RIGHT],

    [boardActionTypes.SQUASH_UP, Direction.UP],
    [boardActionTypes.SQUASH_DOWN, Direction.DOWN],
    [boardActionTypes.SQUASH_LEFT, Direction.LEFT],
    [boardActionTypes.SQUASH_RIGHT, Direction.RIGHT]
]);

export const squashActionsArray = [
    boardActionTypes.SQUASH_DOWN,
    boardActionTypes.SQUASH_LEFT,
    boardActionTypes.SQUASH_RIGHT,
    boardActionTypes.SQUASH_UP
] as squashActions[];
