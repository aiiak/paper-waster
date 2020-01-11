import { Board } from '../components/board/duck/types';
import { boardInitialState } from '../components/board/duck/boardReducer';
import { KawaiiMood } from 'react-kawaii';

export interface IAppSettings {
    seed: string;
    mood: KawaiiMood;
    isWin: boolean;
    isStatShown: boolean;
}

export interface IState {
    app: IAppSettings;
    board: Board;
}

export const initialState: IState = {
    app: { seed: 'initial', mood: 'excited', isWin: false, isStatShown: false },
    board: boardInitialState
};
