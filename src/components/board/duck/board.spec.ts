import produce from 'immer';
import { applyMiddleware, createStore } from 'redux';
import configureMockStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { CellPosition } from '../../../common/types';
import { initialState, IState } from '../../../state/initialState';
import rootReducer from '../../../state/reducer';
import { thunkActions } from '../../../state/thunkActions';
import { appActionTypes } from '../../app/duck/appActions';
import { AppAction } from '../../app/duck/types';
import { boardActions, boardActionTypes } from './boardActions';
import { CELL_LIMIT, ROW_LENGTH } from './boardConstants';
import BoardHelper from './boardHelper';
import { BoardAction, cellValue } from './types';

const mockStoreConf = configureMockStore<IState, ThunkDispatch<IState, void, AppAction | BoardAction>>([thunk]);

function createTestStore(state: IState = _.cloneDeep(initialState)) {
    return createStore(rootReducer, state, applyMiddleware(thunk));
}

describe('Board reducer', () => {
    let store = createTestStore();

    beforeEach(() => {
        store = createTestStore();
    });

    it('State should be freezed outside of reducer', () => {
        const newState = store.getState();
        expect(() => {
            newState.board.rows = [];
        }).toThrow(TypeError);
        expect(() => {
            newState.board.rows[0].items[0].alive = false;
        }).toThrow(TypeError);
    });

    it('SQUASH in different direction', () => {
        const randomSeedValues = _.times(100, () => 1) as cellValue[];
        const valuesLength = randomSeedValues.length;
        const randomState = produce(initialState, draft => {
            draft.board.rows = BoardHelper.createBoardRows(randomSeedValues);
            draft.board.cellLeft = valuesLength;
        });

        let pos = { rowIdx: 5, colIdx: 5 };
        store = createTestStore(randomState);
        store.dispatch(boardActions.selectCell(pos));
        store.dispatch(boardActions.squashDown());
        expect(store.getState().board.rows[pos.rowIdx].items[pos.colIdx].alive).toBeFalsy();
        expect(store.getState().board.rows[pos.rowIdx + 1].items[pos.colIdx].alive).toBeFalsy();

        store = createTestStore(randomState);
        store.dispatch(boardActions.selectCell(pos));
        store.dispatch(boardActions.squashUp());
        expect(store.getState().board.rows[pos.rowIdx].items[pos.colIdx].alive).toBeFalsy();
        expect(store.getState().board.rows[pos.rowIdx - 1].items[pos.colIdx].alive).toBeFalsy();

        store = createTestStore(randomState);
        store.dispatch(boardActions.selectCell(pos));
        store.dispatch(boardActions.squashLeft());
        expect(store.getState().board.rows[pos.rowIdx].items[pos.colIdx].alive).toBeFalsy();
        expect(store.getState().board.rows[pos.rowIdx].items[pos.colIdx - 1].alive).toBeFalsy();

        store = createTestStore(randomState);
        store.dispatch(boardActions.selectCell(pos));
        store.dispatch(boardActions.squashRight());
        expect(store.getState().board.rows[pos.rowIdx].items[pos.colIdx].alive).toBeFalsy();
        expect(store.getState().board.rows[pos.rowIdx].items[pos.colIdx + 1].alive).toBeFalsy();
    });

    it("Trying to SQUASH cells that doesn't met condition shouldn't modify state", () => {
        store.dispatch(boardActions.squashLeft());
        expect(store.getState()).toEqual(initialState);
        store.dispatch(boardActions.squashRight());
        expect(store.getState()).toEqual(initialState);
        store.dispatch(boardActions.squashUp());
        expect(store.getState()).toEqual(initialState);
    });

    it('Dispatching Squash should dispatch SQUASH - CHANGE_MOOD action chain ', () => {
        const initialStateCount = store.getState().board.cellLeft;
        const mockStore = mockStoreConf(() => store.getState());
        mockStore.dispatch(thunkActions.squash(boardActionTypes.SQUASH_DOWN));
        const actions = mockStore.getActions();
        expect(actions[0]?.type).toEqual(boardActionTypes.SQUASH_DOWN);
        expect(actions[1]?.type).toEqual(appActionTypes.CHANGE_MOOD);
        actions.forEach(a => store.dispatch(a));

        const resultState = store.getState();
        expect(resultState.board.rows[0].items[0].alive).toBeFalsy();
        expect(resultState.board.rows[1].items[0].alive).toBeFalsy();
        expect(resultState.board.cellLeft).toBe(initialStateCount - 2);
    });

    it('Dispatch FOCUS_RIGHT should change active cell position ', () => {
        expect(store.getState().board.activeCellPosition.colIdx).toEqual(0);
        expect(store.getState().board.activeCellPosition.rowIdx).toEqual(0);
        store.dispatch({ type: boardActionTypes.FOCUS_RIGHT });
        expect(store.getState().board.activeCellPosition.colIdx).toEqual(1);
        expect(store.getState().board.activeCellPosition.rowIdx).toEqual(0);
    });

    it('Move focus RIGHT for last cell in row should select first cell in next row', () => {
        store.dispatch(boardActions.selectCell({ rowIdx: 0, colIdx: 8 }));
        expect(store.getState().board.activeCellPosition).toEqual({ rowIdx: 0, colIdx: 8 });

        store.dispatch(boardActions.focusRight());
        expect(store.getState().board.activeCellPosition).toEqual({ rowIdx: 1, colIdx: 0 });
    });

    it('Move focus RIGHT UP LEFT DOWN four times in any sequence should return active position to initial state ', () => {
        const actions = [boardActions.focusDown, boardActions.focusUp, boardActions.focusLeft, boardActions.focusRight];
        //refill first to double row count
        store.dispatch(boardActions.refill());

        //get random cell in middle row, cause to ensure UP/DOWN perform correct
        const cellPosition: CellPosition = { rowIdx: _.random(2, 4), colIdx: _.random(0, 8) };
        store.dispatch(boardActions.selectCell(cellPosition));
        _(actions)
            .shuffle()
            .forEach(action => store.dispatch(action()));

        expect(store.getState().board.activeCellPosition).toEqual(cellPosition);
    });

    it('REFILL should double count of existing cell', () => {
        const randomSeedValues = _.times(_.random(10, 50), () => _.random(1, 9)) as cellValue[];
        const valuesLength = randomSeedValues.length;
        const randomState: IState = {
            app: { ...initialState.app },
            board: {
                ...initialState.board,
                rows: BoardHelper.createBoardRows(randomSeedValues),
                cellLeft: valuesLength
            }
        };

        store = createTestStore(randomState);

        //Check that all required action was called
        const mockStore = mockStoreConf(_.cloneDeep(randomState));
        mockStore.dispatch(thunkActions.refillBoard());
        const actions = mockStore.getActions();
        expect(actions.length).toEqual(2);
        expect(actions[0]?.type).toEqual(boardActionTypes.REFILL);
        expect(actions[1]?.type).toEqual(appActionTypes.CHANGE_MOOD);

        actions.forEach(a => store.dispatch(a));

        const resultState = store.getState();

        //check resulted state
        expect(resultState.board.cellLeft).toBe(2 * valuesLength);
        expect(resultState.board.rows[0].items[0].value).toEqual(
            resultState.board.rows[~~(valuesLength / ROW_LENGTH)]?.items[valuesLength % ROW_LENGTH].value
        );
        expect(_.flatMap(resultState.board.rows, row => row.items).length).toBe(2 * valuesLength);
    });

    it('REFILL should populate only alive cells', () => {
        const initialStateCount = initialState.board.cellLeft;
        const randomState = produce(initialState, draft => {
            draft.board.rows[0].items[0].alive = false;
        });
        store = createTestStore(randomState);
        store.dispatch({ type: boardActionTypes.REFILL });
        const resultState = store.getState();
        expect(resultState.board.cellLeft).toBe(2 * initialStateCount - 1);
        expect(_.flatMap(resultState.board.rows, row => row.items).length).toBe(2 * initialStateCount - 1);
    });

    it('Undo should rollback previous SQUASH or REFILL action, without turn decremental', () => {
        store.dispatch(boardActions.create('initial'));

        const state = store.getState();
        const initialStateCount = state.board.cellLeft;
        store.dispatch(boardActions.squashDown());

        const stateAfterSquash = store.getState();

        expect(store.getState().board.cellLeft).toBe(initialStateCount - 2);
        expect(store.getState().board.turn).toBe(1);

        store.dispatch(boardActions.undo());
        expect(store.getState()).toEqual(
            produce(state, draft => {
                draft.board.turn = 1;
                draft.board.canRedo = true;
            })
        );

        store.dispatch(boardActions.redo());
        expect(store.getState()).toEqual(stateAfterSquash);

        store.dispatch(boardActions.refill());
        const stateAfterRefill = store.getState();

        expect(store.getState().board.cellLeft).toBe((initialStateCount - 2) * 2);
        expect(store.getState().board.turn).toBe(2);

        store.dispatch(boardActions.undo());
        expect(store.getState()).toEqual(
            produce(stateAfterSquash, draft => {
                draft.board.turn = 2;
                draft.board.canRedo = true;
            })
        );

        store.dispatch(boardActions.redo());
        expect(store.getState()).toEqual(stateAfterRefill);
    });

    it('After squash, if all cell in completed row are marked as squashed, row should be marked as removed ', () => {
        const randomSeedValues = _.times(12, () => 1) as cellValue[];
        const valuesLength = randomSeedValues.length;
        const randomState = produce(initialState, draft => {
            const rows = BoardHelper.createBoardRows(randomSeedValues);
            rows[0].items.forEach((cell, i) => (cell.alive = i === 0 || i > 9));
            draft.board.rows = rows;
            draft.board.cellLeft = valuesLength;
        });

        store = createTestStore(randomState);

        expect(store.getState().board.rows[0].isRemoved).toBeFalsy();
        store.dispatch(boardActions.squashDown());
        expect(store.getState().board.rows[0].isRemoved).toBeTruthy();
    });

    it('Game should considered as loosed if cell count exceeded  CELL_LIMIT', () => {
        const randomSeedValues = _.times(2 + CELL_LIMIT / 2, () => _.random(1, 9)) as cellValue[];
        const valuesLength = randomSeedValues.length;
        const randomState = produce(initialState, draft => {
            draft.board.rows = BoardHelper.createBoardRows(randomSeedValues);
            draft.board.cellLeft = valuesLength;
        });

        store = createTestStore(randomState);

        //Check that all required action was called
        const mockStore = mockStoreConf(_.cloneDeep(randomState));
        mockStore.dispatch(thunkActions.refillBoard());
        const actions = mockStore.getActions();
        expect(actions.length).toEqual(2);
        expect(actions[0]?.type).toEqual(boardActionTypes.REFILL);
        //expect(actions[1]?.type).toEqual(appActionTypes.SHOW_STATISTIC);

        actions.forEach(a => store.dispatch(a));

        const resultState = store.getState();
        //check resulted state
        expect(resultState.board.cellLeft).toBe(2 * valuesLength);
        //expect(resultState.app.isWin).toBeFalsy();
        //expect(resultState.app.isStatShown).toBeTruthy();
    });

    it('Game should considered as won if all cell cleared', () => {
        // Start with seed, contained  [1, 2, 2, 1] values

        store.dispatch<any>(thunkActions.restart(appActionTypes.START_NEW, 'test'));
        store.dispatch(boardActions.selectCell({ rowIdx: 0, colIdx: 1 }));
        store.dispatch<any>(thunkActions.squash(boardActionTypes.SQUASH_RIGHT));

        store.dispatch<any>(thunkActions.squash(boardActionTypes.SQUASH_RIGHT));
        store.dispatch<any>(thunkActions.squash(boardActionTypes.SQUASH_LEFT));

        const resultState = store.getState();

        expect(resultState.board.cellLeft).toBe(0);
        expect(resultState.app.isWin).toBeTruthy();
        expect(resultState.app.isStatShown).toBeTruthy();
    });
});
