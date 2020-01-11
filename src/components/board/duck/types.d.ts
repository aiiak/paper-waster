import { StateType, ActionType } from 'typesafe-actions';
import { CellPosition } from '../../../common/types';
import { boardActionTypes } from './boardActions';

export type cellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Cell = {
    id: string;
    alive: boolean;
    position: CellPosition;
    value: cellValue;
};

export type Row = {
    items: Cell[];
    isRemoved: boolean;
};

export type Board = {
    rows: Row[];
    activeCellPosition: CellPosition;
    canUndo: boolean;
    canRedo: boolean;
    turn: number;
    cellLeft: number;
};

export type squashResult = {
    wasSquashed: boolean;
    rows: Row[];
    activePos: CellPosition;
};

export type refillResult = {
    rows: Row[];
    cellAddedCount: number;
};

export type rowClearResult = {
    wasCleared: boolean;
    rows: Row[];
    rowIdxDif: number;
};

export type squashActions =
    | boardActionTypes.SQUASH_DOWN
    | boardActionTypes.SQUASH_LEFT
    | boardActionTypes.SQUASH_RIGHT
    | boardActionTypes.SQUASH_UP;

export type BoardAction = ActionType<typeof import('./boardActions')>;
export type BoardState = StateType<typeof import('./boardReducer').boardReducer>;
