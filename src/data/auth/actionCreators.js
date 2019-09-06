import { ActionTypes } from '../actionTypes';
import { 
	storageRemove, 
	storageGet, 
	storageStore
} from '../../helpers/Storage';
import { STORAGE_KEYS } from '../../configs/storage.config';
import { DEBUG } from '../../configs/app.config';
import { LOGOUT } from "../../configs/api.config"


// checkAuth request action
const checkAuthRequest = () =>{
	return {
		type: ActionTypes.CHECK_AUTH_REQUEST,
		isFetching: true,
		message: null,
		failed: false
	};
}
// receive checkAuth action
const checkAuthComplete = ( token, userid ) =>{
	return {
		type: ActionTypes.CHECK_AUTH_DONE,
		isFetching: false,
		isAuthenticated: token && userid ? true : false,
	};
}
// receive checkAuth action
const checkAuthFailure = () =>{
	return {
		type: ActionTypes.CHECK_AUTH_DONE,
		isFetching: false,
		isAuthenticated: false,
		failed: true
	};
}

// log user in
export const checkAuth = () => {
	return dispatch => {
		dispatch( checkAuthRequest() );

		setTimeout(() => {
			try{
				let token = storageGet( STORAGE_KEYS.ACCESS_TOKEN );
				let userid = storageGet( STORAGE_KEYS.USER_ID );
				let expiryTime = storageGet( STORAGE_KEYS.TOKEN_EXPIRY_DATE );
				if( typeof expiryTime != 'string' ){
					dispatch( checkAuthComplete() );
				}

				let now = new Date();
				let expDate = new Date(expiryTime);

				if( now.getTime() > expDate.getTime() ){
					dispatch( checkAuthComplete() );
					dispatch( logout() );
					return;
				}

				dispatch( checkAuthComplete(token, userid) );
			} catch(error){
				if(DEBUG){
					console.log(error);
				}
				dispatch( checkAuthFailure() );
			}
			
		}, 500);
	}
}

// logout request action
const logoutRequest = () =>{
	return {
		type: ActionTypes.LOGOUT_REQUEST,
		isFetching: true,
		failed: false,
		message: null
	};
}
// receive logout action
const logoutSuccess = () =>{
	return {
		type: ActionTypes.LOGOUT_SUCCESS,
		isAuthenticated: false,
		isFetching: false
	};
}
// logout error action
const logoutFailure = (message) =>{
	return {
		type: ActionTypes.LOGOUT_FAILURE,
		message: message,
		failed: true,
		isFetching:false
	};
}

// log user out
export const logout = () => {
	return dispatch => {
		// request to logout
		dispatch( logoutRequest() );
		setTimeout(() => {
			LOGOUT().then((res) => {
				console.log('success');
				storageRemove(STORAGE_KEYS.ACCESS_TOKEN);
				storageRemove(STORAGE_KEYS.USER_ID);
				storageRemove(STORAGE_KEYS.TOKEN_EXPIRY_DATE);
				dispatch( logoutSuccess() );
			}).catch((error) => {
				if(DEBUG){
					console.log(error);
				}
				//dispatch(logoutSuccess())
				dispatch( logoutFailure('An error occured, please try again in a moment') );
			})	
				
		}, 1500);
	}
}

export const loggedIn = (data) => {
	return dispatch => {
		storeLoggedin(
			data.access_token,
			data.userId,
			data[".expires"]
		);
		dispatch({
			type: ActionTypes.LOGGED_IN,
			isAuthenticated: true,
		});
	}
};

const storeLoggedin = (access_token, userId, expiryTime) => {
	storageStore( STORAGE_KEYS.TOKEN_EXPIRY_DATE, expiryTime );
	storageStore( STORAGE_KEYS.ACCESS_TOKEN, access_token );
	storageStore( STORAGE_KEYS.USER_ID, userId );
};