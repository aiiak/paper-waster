import { action } from 'typesafe-actions';
import { Dispatch } from 'redux';
import { IState } from '../../../state/initialState';
import { boardActionTypes } from '../../board/duck/boardActions';
import { BoardAction } from '../../board/duck/types';
import { AppAction } from './types';
import { KawaiiMood } from 'react-kawaii';

// use typescript enum rather than action constants
export enum appActionTypes {
    START_NEW = 'START_NEW',
    HIDE_STATISTIC = 'HIDE_STATISTIC',
    SHOW_STATISTIC = 'SHOW_STATISTIC',
    RESET = 'RESET',
    CHANGE_MOOD = 'CHANGE_MOOD'
}

export const appActions = {
    showStat: (isWin: boolean) => action(appActionTypes.SHOW_STATISTIC, isWin),
    hideStat: () => action(appActionTypes.HIDE_STATISTIC),
    startNew: (seed: string) => action(appActionTypes.START_NEW, seed),
    changeMood: (cellLeft: number) => action(appActionTypes.CHANGE_MOOD, cellLeft)
};
