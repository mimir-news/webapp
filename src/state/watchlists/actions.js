import { createAction } from 'redux-actions';
import * as types from './types';


export const loadAll = createAction(types.LOAD_ALL, watchlists => ({ watchlists }));
