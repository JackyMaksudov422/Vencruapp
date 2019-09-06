import { ActionTypes } from "../actionTypes";
import { CREATE_EXPENSE, UPDATE_EXPENSE } from "../../configs/api.config";

export const createExpenseRequest = () => ({
    type: ActionTypes.CREATE_EXPENSE_REQUEST,
    isFetching: true,
    errorMessage: null,
    data: null
});

export const createExpenseSuccess = (data) => ({
    type: ActionTypes.CREATE_EXPENSE_SUCCESS,
    isFetching: false,
    errorMessage: null,
    data: data
});

export const createExpenseFailure = (errorMessage) => ({
    type: ActionTypes.CREATE_EXPENSE_FAILURE,
    isFetching: false,
    errorMessage: errorMessage || null,
    data: null
});


export const doCreateExpense = (reqData, config) => dispatch => {
    dispatch(createExpenseRequest());
    setTimeout(() => {
        CREATE_EXPENSE(reqData, config).then(newExpense => {
            dispatch(createExpenseSuccess(newExpense));
        }).catch(error => {
            let errorMessage = typeof error == 'string' && 
                                error.trim().length > 0 && 
                                error || 'An unknown error occured';
            dispatch(createExpenseFailure(errorMessage));
        });
    }, 400);
};


export const updateExpenseRequest = () => ({
    type: ActionTypes.UPDATE_EXPENSE_REQUEST,
    isFetching: true,
    errorMessage: null,
    data: null
});

export const updateExpenseSuccess = (data) => ({
    type: ActionTypes.UPDATE_EXPENSE_SUCCESS,
    isFetching: false,
    errorMessage: null,
    data: data
});

export const updateExpenseFailure = (errorMessage) => ({
    type: ActionTypes.UPDATE_EXPENSE_FAILURE,
    isFetching: false,
    errorMessage: errorMessage || null,
    data: null
});


export const doUpdateExpense = (data, config) => dispatch => {
    dispatch(updateExpenseRequest());
    setTimeout(() => {
        UPDATE_EXPENSE(data, config).then(expense => {
            dispatch(updateExpenseSuccess(expense));
        }).catch(error => {
            let errorMessage = typeof error == 'string' &&
                                error.trim().length > 0 && 
                                error || 'An unknown error occured';
            dispatch(updateExpenseFailure(errorMessage));
        });
    }, 400);
};