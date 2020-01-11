import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IState } from '../../state/initialState';
import { appActionTypes } from '../app/duck/appActions';
import { AppAction } from '../app/duck/types';
import { boardActionTypes } from '../board/duck/boardActions';
import { BoardAction } from '../board/duck/types';
import ToolbarComponent from './ToolbarComponent';
import { ThunkDispatch } from 'redux-thunk';
import { thunkActions } from '../../state/thunkActions';

const mapStateToProps = (store: IState) => {
    return {
        seed: store.app.seed,
        turn: store.board.turn,
        canUndo: store.board.canUndo,
        canRedo: store.board.canRedo,
        cellLeft: store.board.cellLeft
    };
};
const mapDispatchToProps = (dispatch: ThunkDispatch<IState, void, AppAction | BoardAction>) => ({
    concede: () => dispatch({ type: appActionTypes.SHOW_STATISTIC, payload: false }),
    next: () => dispatch(thunkActions.refillBoard()),
    undo: () => dispatch({ type: boardActionTypes.UNDO }),
    redo: () => dispatch({ type: boardActionTypes.REDO })
});

const ToolbarContainer = connect(mapStateToProps, mapDispatchToProps)(ToolbarComponent);

export default ToolbarContainer;
