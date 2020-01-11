import { action } from 'typesafe-actions';
import { CellPosition } from '../../../common/types';

// use typescript enum rather than action constants
export enum boardActionTypes {
    // mouse
    SELECT_CELL = 'SELECT_CELL',

    //keyboard navigation
    FOCUS_UP = 'BOARD/UP',
    FOCUS_DOWN = 'BOARD/DOWN',
    FOCUS_LEFT = 'BOARD/LEFT',
    FOCUS_RIGHT = 'BOARD/RIGHT',

    //squash
    SQUASH_UP = 'BOARD/SQUASH_UP',
    SQUASH_DOWN = 'BOARD/SQUASH_DOWN',
    SQUASH_LEFT = 'BOARD/SQUASH_LEFT',
    SQUASH_RIGHT = 'BOARD/SQUASH_RIGHT',

    // global
    REFILL = 'BOARD/REFILL',
    TRY_CLEAR_ROW = 'TRY_CLEAR_ROW',
    UNDO = 'BOARD/UNDO',
    REDO = 'BOARD/REDO',
    CREATE = 'BOARD/CREATE'
}

export const boardActions = {
    //mouse
    selectCell: (position: CellPosition) => action(boardActionTypes.SELECT_CELL, position),

    //keyboard navigation
    focusUp: () => action(boardActionTypes.FOCUS_UP),
    focusDown: () => action(boardActionTypes.FOCUS_DOWN),
    focusLeft: () => action(boardActionTypes.FOCUS_LEFT),
    focusRight: () => action(boardActionTypes.FOCUS_RIGHT),

    squashUp: () => action(boardActionTypes.SQUASH_UP),
    squashDown: () => action(boardActionTypes.SQUASH_DOWN),
    squashLeft: () => action(boardActionTypes.SQUASH_LEFT),
    squashRight: () => action(boardActionTypes.SQUASH_RIGHT),

    //global
    tryClearRow: (rowIdx: number) => action(boardActionTypes.TRY_CLEAR_ROW, rowIdx),
    refill: () => action(boardActionTypes.REFILL),
    redo: () => action(boardActionTypes.REDO),
    undo: () => action(boardActionTypes.UNDO),
    create: (seed: string) => action(boardActionTypes.CREATE, seed)
};
