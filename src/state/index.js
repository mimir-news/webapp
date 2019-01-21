import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import user from './user';
import watchlists from './watchlists';


const reducer = combineReducers({
    user,
    watchlists
})


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(
    applyMiddleware(thunk, logger)
));


export default store;