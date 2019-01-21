import * as types from './types';

const initalState = {
    loaded: false,
    error: null,
    id: null,
    email: null,
    role: null,
    createdAt: null
}

const reducer = (state = initalState, action = {}) => {
    switch (action.type) {
        case types.ERROR:
            return {
                ...state,
                error: action.payload
            };
        case types.LOAD:
            const { id, email, role, createdAt } = action.payload.user;
            return {
                ...state,
                id,
                email,
                role,
                createdAt,
                loaded: true,
                error: null
            }
        default:
            return state;
    }

};

export default reducer;