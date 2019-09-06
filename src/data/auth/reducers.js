import CreateReducer from '../../helpers/CreateReducer';
import { ActionTypes } from '../actionTypes';

export const auth = CreateReducer(
    {
        isAuthenticated: false,
        failed: false,
        message: false,
    }, 
    {
        [ActionTypes.LOGGED_IN]: (state, action) => Object.assign({}, state, action),
        [ActionTypes.CHECK_AUTH_DONE]: (state, action) => Object.assign({}, state, action),
        [ActionTypes.LOGOUT_SUCCESS]: (state, action, initialState) => initialState,
    }
);

export const checkingAuth = CreateReducer(
    {
        isFetching: false,
        isAuthenticated: false,
        failed: false,
        message: null
    }, 
    {
        [ActionTypes.CHECK_AUTH_REQUEST]: (state, action) => Object.assign({}, state, action),
        [ActionTypes.CHECK_AUTH_DONE]: (state, action) => Object.assign({}, state, action),
    }
);

export const loggingOut = CreateReducer({
    isFetching: false,
    failed: false,
    message: false
}, {
    [ActionTypes.LOGOUT_REQUEST]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.LOGOUT_SUCCESS]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.LOGOUT_FAILURE]: (state, action) => Object.assign({}, state, action),
});