import produce, { applyPatches, Patch } from 'immer';
import { assertIsDefined } from '../../../common/assertion';
import { boardActionTypes } from './boardActions';
import { actionToDirectionMap, DEFAULT_BOARD_VALUES, squashActionsArray } from './boardConstants';
import BoardHelper from './boardHelper';
import { Board, BoardAction } from './types';
import { enablePatches } from 'immer';

enablePatches();

export const boardInitialState: Board = {
    turn: 0,
    activeCellPosition: { rowIdx: 0, colIdx: 0 },
    canRedo: false,
    canUndo: false,
    rows: BoardHelper.createBoardRows(DEFAULT_BOARD_VALUES),
    cellLeft: DEFAULT_BOARD_VALUES.length,
};

interface IUndoRedoItem {
    redo: Patch[];
    undo: Patch[];
}
let changes: IUndoRedoItem[] = [];
let currentVersion = -1;
const noOfVersionsSupported = 100;

export const boardReducer = (state: Board = boardInitialState, action: BoardAction) => {
    const nextState = produce(
        state,
        (draft: Board) => {
            const turnCounter = draft.turn;
            switch (action.type) {
                case boardActionTypes.CREATE:
                    changes = [];
                    currentVersion = -1;
                    return BoardHelper.createBoard(action.payload);

                case boardActionTypes.SELECT_CELL: {
                    draft.activeCellPosition = { ...action.payload };
                    break;
                }
                case boardActionTypes.FOCUS_UP:
                case boardActionTypes.FOCUS_DOWN:
                case boardActionTypes.FOCUS_LEFT:
                case boardActionTypes.FOCUS_RIGHT: {
                    const direction = actionToDirectionMap.get(action.type);
                    // TODO:  need to improve type resolve to remove that assertion
                    assertIsDefined(direction);

                    const newPos = BoardHelper.findNearest(draft.rows, draft.activeCellPosition, direction);
                    newPos && (draft.activeCellPosition = newPos);
                    break;
                }
                case boardActionTypes.SQUASH_UP:
                case boardActionTypes.SQUASH_DOWN:
                case boardActionTypes.SQUASH_LEFT:
                case boardActionTypes.SQUASH_RIGHT: {
                    const direction = actionToDirectionMap.get(action.type);
                    // TODO:  need to improve type resolve to remove that assertion
                    assertIsDefined(direction);

                    const squashRes = BoardHelper.trySquash(draft.rows, draft.activeCellPosition, direction);
                    draft.rows = squashRes.rows;
                    draft.activeCellPosition = squashRes.activePos;
                    if (squashRes.wasSquashed) {
                        draft.turn++;
                        draft.cellLeft -= 2;
                        draft.canUndo = true;
                        draft.canRedo = false;
                    }
                    break;
                }
                case boardActionTypes.REFILL: {
                    const { rows, cellAddedCount } = BoardHelper.refill(draft.rows);
                    draft.rows = rows;
                    draft.cellLeft += cellAddedCount;
                    draft.turn++;
                    break;
                }
                case boardActionTypes.UNDO:
                    if (!draft.canUndo) return;

                    draft = applyPatches(draft, changes[currentVersion--].undo);
                    draft.canUndo = changes.hasOwnProperty(currentVersion);
                    draft.canRedo = true;
                    draft.turn = turnCounter;
                    break;

                case boardActionTypes.REDO:
                    if (!draft.canRedo) return;

                    draft = applyPatches(draft, changes[++currentVersion].redo);
                    draft.canUndo = true;
                    draft.canRedo = changes.hasOwnProperty(currentVersion + 1);
                    draft.turn = turnCounter;
                    break;
            }
        },
        (patches: Patch[], inversePatches: Patch[]) => {
            if (
                (_.includes(squashActionsArray, action.type) || action.type === boardActionTypes.REFILL) &&
                !_.isEmpty(patches)
            ) {
                currentVersion++;

                changes[currentVersion] = {
                    redo: patches,
                    undo: inversePatches,
                };
            }
            delete changes[currentVersion - noOfVersionsSupported];
        }
    );

    return nextState;
};
