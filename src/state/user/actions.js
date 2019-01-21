import { createAction } from 'redux-actions';
import * as types from './types';


export const load = createAction(types.LOAD, user => ({ user }));

export const loadError = createAction(types.ERROR, error => error);