import produce from 'immer';
import { IAppSettings, initialState } from '../../../state/initialState';
import { appActionTypes } from './appActions';
import { AppAction } from './types';
import appHelper from './appHelper';
import { CELL_COUNT_DEFAULT } from '../../board/duck/boardConstants';

export const appReducer = produce((draft: IAppSettings, action: AppAction) => {
    switch (action.type) {
        case appActionTypes.SHOW_STATISTIC:
            draft.isStatShown = true;
            draft.isWin = action.payload;
            break;

        case appActionTypes.HIDE_STATISTIC:
            draft.isStatShown = false;
            break;

        case appActionTypes.START_NEW:
            draft.isStatShown = false;
            draft.seed = action.payload;
            draft.mood = appHelper.getMood(CELL_COUNT_DEFAULT);
            break;

        case appActionTypes.CHANGE_MOOD:
            draft.mood = appHelper.getMood(action.payload);
            break;
    }
}, initialState.app);
