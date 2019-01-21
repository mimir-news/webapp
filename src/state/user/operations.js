import { flatMap } from 'lodash';
import { makeGetRequest, createDirectoryUrl } from "../../services/api";
import { loadAllWatchlists } from '../watchlists';
import * as actions from "./actions";

export const loadUser = user => dispatch => {
    dispatch(actions.load(user));
    dispatch(loadAllWatchlists(user.watchlists));
    const stocks = getUserStocks(user);
    console.log(stocks);
};

export const fetchUser = userId => async dispatch => {
    const { response, error } = await makeGetRequest({ url: createDirectoryUrl(`v1/users/${userId}`) });
    if (error) {
        console.error(error);
        dispatch(actions.loadError(error.message));
        return;
    }

    dispatch(loadUser(response));
};

const getUserStocks = user => flatMap(user.watchlists, watchlist => watchlist.stocks);