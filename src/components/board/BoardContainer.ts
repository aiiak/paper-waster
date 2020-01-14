import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { IState } from '../../state/initialState';
import BoardComponent from './BoardComponent';
import { boardActionTypes } from './duck/boardActions';
import { squashActionsArray } from './duck/boardConstants';
import { BoardAction, squashActions } from './duck/types';
import { thunkActions } from '../../state/thunkActions';

type boardActionNoPayload = Exclude<
    boardActionTypes,
    boardActionTypes.TRY_CLEAR_ROW | boardActionTypes.SELECT_CELL | boardActionTypes.CREATE
>;

const keyMap: Map<number, boardActionNoPayload> = new Map([
    [37, boardActionTypes.FOCUS_LEFT],
    [38, boardActionTypes.FOCUS_UP],
    [39, boardActionTypes.FOCUS_RIGHT],
    [40, boardActionTypes.FOCUS_DOWN],
    [13, boardActionTypes.REFILL]
]);

const keyWithCtrlMap: Map<number, boardActionNoPayload> = new Map([
    [37, boardActionTypes.SQUASH_LEFT],
    [38, boardActionTypes.SQUASH_UP],
    [39, boardActionTypes.SQUASH_RIGHT],
    [40, boardActionTypes.SQUASH_DOWN]
]);

const keyWithAltMap: Map<number, boardActionNoPayload> = new Map([
    [37, boardActionTypes.UNDO],
    [39, boardActionTypes.REDO]
]);

const mapStateToProps = (store: IState) => {
    return {
        rows: store.board.rows
    };
};
const mapDispatchToProps = (dispatch: ThunkDispatch<IState, void, BoardAction>) => {
    return {
        keyDown: (event: KeyboardEvent) => {
            if (event.ctrlKey && keyWithCtrlMap.get(event.keyCode)) {
            }
            const actionType = event.ctrlKey
                ? keyWithCtrlMap.get(event.keyCode)
                : event.altKey
                ? keyWithAltMap.get(event.keyCode)
                : keyMap.get(event.keyCode);
            if (actionType) {
                event.preventDefault();
                event.stopPropagation();
                if (_.includes(squashActionsArray, actionType)) {
                    return dispatch(thunkActions.squash(actionType as squashActions));
                }
                if (actionType === boardActionTypes.REFILL) {
                    return dispatch(thunkActions.refillBoard());
                }
                return dispatch({ type: actionType });
            }
        },
        mouseDrag: (xDiff: number, yDiff: number): boolean => {
            const diff = 50;
            xDiff > diff && dispatch(thunkActions.squash(boardActionTypes.SQUASH_RIGHT));
            xDiff < -diff && dispatch(thunkActions.squash(boardActionTypes.SQUASH_LEFT));
            yDiff > diff && dispatch(thunkActions.squash(boardActionTypes.SQUASH_DOWN));
            yDiff < -diff && dispatch(thunkActions.squash(boardActionTypes.SQUASH_UP));

            return Math.abs(xDiff) > diff || Math.abs(yDiff) > diff;
        }
    };
};

const BoardContainer = connect(mapStateToProps, mapDispatchToProps)(BoardComponent);

export default BoardContainer;
