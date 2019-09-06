import CreateReducer from "../../helpers/CreateReducer";
import { ActionTypes } from "../actionTypes";

export const bankAccounts = CreateReducer({
    isFetching: false,
    errorMessage: null,
    data: []
}, {
    [ActionTypes.GET_BANK_ACCOUNTS_REQUEST]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.GET_BANK_ACCOUNTS_SUCCESS]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.GET_BANK_ACCOUNTS_FAILURE]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.ADD_NEW_BANK_ACCOUNT]: (state, actions) => {
        let banksAccounts = [...state.data];
        banksAccounts.push(actions.data);
        return Object.assign({}, state, {
            data: banksAccounts
        });
    },
    [ActionTypes.LOGOUT_SUCCESS]: (state, action, initialState) => initialState,
});