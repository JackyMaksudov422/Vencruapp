import { ActionTypes } from "../actionTypes";
import { GET_BANKS } from "../../configs/api.config";

const getBankAccountsRequest = () => ({
    type: ActionTypes.GET_BANK_ACCOUNTS_REQUEST,
    isFetching: true,
    errorMessage: null,
});

const getBankAccountsSuccess = (data) => ({
    type: ActionTypes.GET_BANK_ACCOUNTS_SUCCESS,
    isFetching: false,
    errorMessage: null,
    data: data
});

const getBankAccountsFailure = (errorMessage) => ({
    type: ActionTypes.GET_BANK_ACCOUNTS_FAILURE,
    isFetching: false,
    errorMessage: errorMessage || null,
});

export const getBankAccounts = () => {
    return (dispatch, getState) => {
        const { currentBusiness } = getState();
        
        if(!currentBusiness.data){
            return;
        }

        dispatch( getBankAccountsRequest() );

        setTimeout(() => {
            GET_BANKS(
                currentBusiness.data.id 
            ).then(response => {
                dispatch( 
                    getBankAccountsSuccess(
                        response.banks
                    )
                );
            }).catch(error => {
                dispatch( 
                    getBankAccountsFailure(
                        typeof error == 'string' && error || 'Failed to load clients.'
                    )
                );
            });
        }, 100)
    };
}

export const addNewBankAccount = (bankAccount) => ({
    type: ActionTypes.ADD_NEW_BANK_ACCOUNT,
    data: bankAccount
});