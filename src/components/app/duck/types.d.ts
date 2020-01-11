import { ActionType } from 'typesafe-actions';

export type AppAction = ActionType<typeof import('./appActions')>;
