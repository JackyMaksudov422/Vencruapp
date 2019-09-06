import CreateReducer from "../../helpers/CreateReducer";
import { ActionTypes } from "../actionTypes";

export const itemCreate = CreateReducer({
    isFetching: false,
    errorMessage: null,
    data: null
}, {
    [ActionTypes.CREATE_ITEM_REQUEST]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.CREATE_ITEM_SUCCESS]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.CREATE_ITEM_FAILURE]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.LOGOUT_SUCCESS]: (state, action, initialState) => initialState,
});

export const itemUpdate = CreateReducer({
    isFetching: false,
    errorMessage: null
}, {
    [ActionTypes.UPDATE_ITEM_REQUEST]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.UPDATE_ITEM_SUCCESS]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.UPDATE_ITEM_FAILURE]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.LOGOUT_SUCCESS]: (state, action, initialState) => initialState,
});

export const items = CreateReducer({
    isFetching: false,
    errorMessage: null,
    data: []
}, {
    [ActionTypes.GET_ALL_ITEMS_REQUEST]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.GET_ALL_ITEMS_SUCCESS]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.GET_ALL_ITEMS_FAILURE]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.CREATE_ITEM_SUCCESS]: (state, actions) => {
        let items = [...state.data];
        items.push(actions.data);
        return Object.assign({}, state, {
            data: items
        });
    },
    [ActionTypes.LOGOUT_SUCCESS]: (state, action, initialState) => initialState,
});