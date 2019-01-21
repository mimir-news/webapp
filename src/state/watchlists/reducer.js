import _ from 'lodash';
import * as types from './types';

const reducer = (state = {}, action = {}) => {
    switch (action.type) {
        case types.LOAD_ALL:
            return {
                ...state,
                ...keyWatchlistsById(action.payload.watchlists)
            }
        default:
            return state;
    }

};

export default reducer;

const mapWatchlist = watchlist => ({
    ...watchlist,
    stocks: _.map(watchlist.stocks, stock => stock.symbol)
});

const mapWatchlists = watchlists => _.map(watchlists, mapWatchlist);

const keyWatchlistsById = watchlists => _.keyBy(mapWatchlists(watchlists), 'id')