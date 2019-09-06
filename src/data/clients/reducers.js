import CreateReducer from "../../helpers/CreateReducer";
import { ActionTypes } from "../actionTypes";

export const clientCreate = CreateReducer({
    isFetching: false,
    errorMessage: null,
    data: null
}, {
    [ActionTypes.CREATE_CLIENT_REQUEST]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.CREATE_CLIENT_SUCCESS]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.CREATE_CLIENT_FAILURE]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.LOGOUT_SUCCESS]: (state, action, initialState) => initialState,
});

export const clientUpdate = CreateReducer({
    isFetching: false,
    errorMessage: null
}, {
    [ActionTypes.UPDATE_CLIENT_REQUEST]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.UPDATE_CLIENT_SUCCESS]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.UPDATE_CLIENT_FAILURE]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.LOGOUT_SUCCESS]: (state, action, initialState) => initialState,
});

export const clients = CreateReducer({
    isFetching: false,
    errorMessage: null,
    data: []
}, {
    [ActionTypes.GET_ALL_CLIENTS_REQUEST]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.GET_ALL_CLIENTS_SUCCESS]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.GET_ALL_CLIENTS_FAILURE]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.CREATE_CLIENT_SUCCESS]: (state, actions) => {
        let clients = [...state.data];
        clients.push(actions.data);
        return Object.assign({}, state, {
            data: clients
        });
    },
    [ActionTypes.LOGOUT_SUCCESS]: (state, action, initialState) => initialState,
});