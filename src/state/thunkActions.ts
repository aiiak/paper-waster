import { Dispatch, AnyAction } from 'redux';
import { squashActions, BoardAction } from '../components/board/duck/types';
import { IState } from './initialState';
import { AppAction } from '../components/app/duck/types';
import { appActionTypes } from '../components/app/duck/appActions';
import { boardActionTypes } from '../components/board/duck/boardActions';
import { CELL_LIMIT } from '../components/board/duck/boardConstants';
import { ThunkAction } from 'redux-thunk';

export const squash = (action: squashActions) => {
    return (dispatch: Dispatch<AppAction | BoardAction>, getState: () => IState) => {
        dispatch({ type: action });
        const state = getState();

        if (!state.board.cellLeft) {
            dispatch({ type: appActionTypes.SHOW_STATISTIC, payload: true });
        } else {
            dispatch({ type: appActionTypes.CHANGE_MOOD, payload: state.board.cellLeft });
        }
    };
};

export const refillBoard = () => {
    return (dispatch: Dispatch<AppAction | BoardAction>, getState: () => IState) => {
        dispatch({ type: boardActionTypes.REFILL });
        const state = getState();
        if (state.board.cellLeft >= CELL_LIMIT) {
            dispatch({ type: appActionTypes.SHOW_STATISTIC, payload: false });
        } else {
            dispatch({ type: appActionTypes.CHANGE_MOOD, payload: state.board.cellLeft });
        }
    };
};

export const restart = (action: appActionTypes.RESET | appActionTypes.START_NEW, seed: string) => {
    return (dispatch: Dispatch<AppAction | BoardAction>) => {
        switch (action) {
            case appActionTypes.RESET:
                dispatch({ type: appActionTypes.HIDE_STATISTIC });
                break;
            case appActionTypes.START_NEW:
                dispatch({ type: appActionTypes.START_NEW, payload: seed });
        }
        dispatch<BoardAction>({ type: boardActionTypes.CREATE, payload: seed });
    };
};

export const thunkActions = {
    squash,
    refillBoard,
    restart
};

export type PWThunkAction = ThunkAction<void, IState, null, AppAction | BoardAction> | AnyAction;
