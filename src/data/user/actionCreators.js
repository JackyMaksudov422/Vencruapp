import { ActionTypes } from '../actionTypes';
import { GET_USER_INFO, SAVE_ONBOARDING_INFO } from '../../configs/api.config';
import { getAllClients } from '../clients/actionCreators';
import { getBankAccounts } from '../banks/actionCreators';

// onboarding request action
const onboardingRequest = () =>{
	return {
		type: ActionTypes.ONBOARDING_REQUEST,
		isFetching: true,
		failed: false,
		message: null,
		data: null
	};
}
// receive onboarding action
const onboardingSuccess = (data) =>{
	return {
		type: ActionTypes.ONBOARDING_SUCCESS,
		isFetching: false,
		data: data
	};
}
// onboarding error action
const onboardingFailure = (message) =>{
	return {
		type: ActionTypes.ONBOARDING_FAILURE,
		isFetching: false,
		message: message,
		failed: true
	};
}

// sign up user
export const doOnboarding = (data) => {
	return (dispatch, getState) => {
		let { onboarding } = getState();

		// step if already fetching
		if(onboarding.isFetching){
			return;
		}

		dispatch( onboardingRequest() );

		SAVE_ONBOARDING_INFO(data).then( data => {
			dispatch( onboardingSuccess(data) );
		}).catch( error => {
			dispatch( onboardingFailure( error ) );
		});
	}
}

const getUserInfoRequest = () => ({
	type: ActionTypes.GET_USER_INFO_REQUEST,
	isFetching: true,
	failed: false,
	message: null, 
});

const getUserInfoSuccess = (data) => ({
	type: ActionTypes.GET_USER_INFO_SUCCESS,
	isFetching: false,
	data: data
});

const getUserInfoFailure = (message = null) => ({
	type: ActionTypes.GET_USER_INFO_FAILURE,
	isFetching: false,
	failed: true,
	message: message, 
});

export const getUserInfo = () => {
	return dispatch => {
		dispatch( getUserInfoRequest() )
		GET_USER_INFO().then( response => {					
			const business = response.business.find(item => item.id == response.currentbusinessid)			
            if(response.business && response.business.constructor == Array){
            	dispatch(setCurrentBusiness(business));
            }
            dispatch( getUserInfoSuccess(response) );
            dispatch( getAllClients() );
            dispatch( getBankAccounts() );
        }).catch(error => {
            dispatch( getUserInfoFailure(error) )
        });
	}
}

// sets the user info
export const setUserInfo = (data) => ({
	type: ActionTypes.SET_USER_INFO,
	data: data
});

// sets the current business info
export const setCurrentBusiness = (data) => ({
	type: ActionTypes.SET_CURRENT_BUSINESS,
	data: data
});

// update business setup state
const setBusinessSetupState = ({done}) =>{
	return {
		type: ActionTypes.BUSINESS_SETUP_STATE,
		done: done
	};
}