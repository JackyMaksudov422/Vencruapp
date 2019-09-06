import CreateReducer from "../../helpers/CreateReducer";
import { ActionTypes } from "../actionTypes";

export const expenseCreate = CreateReducer({
    isFetching: false,
    errorMessage: null,
    data: null
}, {
    [ActionTypes.CREATE_EXPENSE_REQUEST]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.CREATE_EXPENSE_SUCCESS]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.CREATE_EXPENSE_FAILURE]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.LOGOUT_SUCCESS]: (state, action, initialState) => initialState,
});

export const expenseUpdate = CreateReducer({
    isFetching: false,
    errorMessage: null
}, {
    [ActionTypes.UPDATE_EXPENSE_REQUEST]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.UPDATE_EXPENSE_SUCCESS]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.UPDATE_EXPENSE_FAILURE]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.LOGOUT_SUCCESS]: (state, action, initialState) => initialState,
});