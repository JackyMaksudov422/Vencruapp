import { ActionTypes } from "../actionTypes";
import { CREATE_CLIENT, UPDATE_CLIENT, GET_CLIENTS } from "../../configs/api.config";

export const createClientRequest = () => ({
    type: ActionTypes.CREATE_CLIENT_REQUEST,
    isFetching: true,
    errorMessage: null,
    data: null
});

export const createClientSuccess = (data) => ({
    type: ActionTypes.CREATE_CLIENT_SUCCESS,
    isFetching: false,
    errorMessage: null,
    data: data
});

export const createClientFailure = (errorMessage) => ({
    type: ActionTypes.CREATE_CLIENT_FAILURE,
    isFetching: false,
    errorMessage: errorMessage || null,
    data: null
});

export const doCreateClient = ({
    FirstName,
    LastName,
    CompanyName,
    PhoneNumber,
    CompanyEmail,
    Street,
    City,
    Country,
    BusinessId
}) => dispatch => {
    dispatch(createClientRequest());
    setTimeout(() => {
        CREATE_CLIENT({
            FirstName,
            LastName,
            CompanyName,
            PhoneNumber,
            CompanyEmail,
            Street,
            City,
            Country,
            BusinessId
        }).then(newClient => {
            dispatch(createClientSuccess(newClient));
        }).catch(error => {
            let errorMessage = typeof error == 'string' && error.trim().length > 0 && error || 'An unknown error occured';
            dispatch(createClientFailure(errorMessage));
        });
    }, 400);
};

export const updateClientRequest = () => ({
    type: ActionTypes.UPDATE_CLIENT_REQUEST,
    isFetching: true,
    errorMessage: null,
    data: null
});

export const updateClientSuccess = (data) => ({
    type: ActionTypes.UPDATE_CLIENT_SUCCESS,
    isFetching: false,
    errorMessage: null,
    data: data
});

export const updateClientFailure = (errorMessage) => ({
    type: ActionTypes.UPDATE_CLIENT_FAILURE,
    isFetching: false,
    errorMessage: errorMessage || null,
    data: null
});

export const doUpdateClient = ({
    FirstName,
    LastName,
    CompanyName,
    PhoneNumber,
    CompanyEmail,
    Street,
    City,
    Country,
    BusinessId,
    Id
}) => dispatch => {
    dispatch(updateClientRequest());
    setTimeout(() => {
        UPDATE_CLIENT({
            FirstName,
            LastName,
            CompanyName,
            PhoneNumber,
            CompanyEmail,
            Street,
            City,
            Country,
            BusinessId,
            Id
        }).then(client => {
            dispatch(updateClientSuccess(client));
        }).catch(error => {
            let errorMessage = typeof error == 'string' && error.trim().length > 0 && error || 'An unknown error occured';
            dispatch(updateClientFailure(errorMessage));
        });
    }, 400);
};

const getAllClientsRequest = () => ({
    type: ActionTypes.GET_ALL_CLIENTS_REQUEST,
    isFetching: true,
    errorMessage: null,
});

const getAllClientsSuccess = (data) => ({
    type: ActionTypes.GET_ALL_CLIENTS_SUCCESS,
    isFetching: false,
    errorMessage: null,
    data: data
});

const getAllClientsFailure = (errorMessage) => ({
    type: ActionTypes.GET_ALL_CLIENTS_FAILURE,
    isFetching: false,
    errorMessage: errorMessage || null,
});

export const getAllClients = () => {
    return (dispatch, getState) => {
        const { currentBusiness } = getState();
        
        if(!currentBusiness.data){
            return;
        }

        dispatch( getAllClientsRequest() );

        setTimeout(() => {
            GET_CLIENTS({
                businessId: currentBusiness.data.id || null,
                page: 1,
                fromDate: undefined,
                toDate: undefined,
                sortBy:  'name',
                sortOrder:  'asc',
                searchQuery: '',
                limit: 1000000,
                filter: undefined
            }).then(response => {
                dispatch( getAllClientsSuccess(response.clients) );
            }).catch(error => {
                dispatch( 
                    getAllClientsFailure(
                        typeof error == 'string' && error || 'Failed to load clients.'
                    )
                );
            });
        }, 100)
    };
}