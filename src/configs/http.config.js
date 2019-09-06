import axios from 'axios';
import { STORAGE_KEYS } from './storage.config';
import { storageGet } from '../helpers/Storage';
import MessageParser from '../helpers/MessageParser';
import IsJSON from '../helpers/IsJSON';
import { API_URL, DEBUG, URL } from './app.config';
import { stat } from 'fs';

/**
 * default headers for http request
 */
export const HEADERS = { 
};

/**
 * parse error response
 */
function parseError (error) {    
    // error
    if (error !== undefined) {
        if(typeof error == 'string'){
            return Promise.reject( MessageParser(error) );
        }

        if (error.ModelState) {
            let modelErrors = Object.keys(error.ModelState);
            let message = 'An unknown error has occured.';

            if( error.ModelState[modelErrors[0]] &&
                error.ModelState[modelErrors[0]][0]
            ){
                message = error.ModelState[modelErrors[0]][0];
            }

            return Promise.reject( MessageParser(message) )
        }
        
        if (error.constructor ==  Array) {
            return Promise.reject( MessageParser(error[0]) )
        }

        if(error.Message){
            return Promise.reject( MessageParser(error.Message) );
        }

        if(error.message){
            return Promise.reject( MessageParser(error.message) );
        }

    }

    return Promise.reject('An unknown error has occured.');
}

/**
 * parse response
 */
function parseBody (response) {
    if(!response){
        return parseError(new Error('Response is malformed.'));
    }
    
    const { data, status } = response;

    if (data) {   
        return data;
    }

    if(status == 200 && data == ""){
        return "OK"
    }

    return parseError(response.message || 'An unknown error occured, try again in a minute.');
}

let instance = axios.create({
    baseURL: API_URL
});

/**
 * add a response interceptor for axios instace
 */
instance.interceptors.response.use(response => {
    return parseBody(response);
}, error => {
    // return Promise.reject(error)
    if (error.response && error.response.data) {

        // loge error to console if in debug mode
        if( DEBUG ){

            // log exception message if any is found
            if(error.response.data.ExceptionMessage){
                console.error(
                    error.response.data.ExceptionMessage
                );
            }

            // log if there is a response message
            if(error.response.data.Message){
                console.error(
                    error.response.data.Message
                );
            }

            // log if there is a response message detail
            if(error.response.data.MessageDetail){
                console.error(
                    error.response.data.MessageDetail
                );
            }

            // log if there is a model state error
            if(error.response.data.ModelState){
                console.error(
                    error.response.data
                );
            }
        }

        // when there is an exception message
        if( error.response.data.ExceptionMessage &&
            IsJSON(error.response.data.ExceptionMessage)
        ){
            let exceptionMessage = JSON.parse(error.response.data.ExceptionMessage);
            return parseError( exceptionMessage.error_description );
        }

        // When a model state is malformed or inappropriate data is passed
        if(error.response.data.ModelState){
            return parseError(error.response.data);
        }

        // If there is a message detail
        if(error.response.data.MessageDetail){
            return parseError(error.response.data.MessageDetail);
        }

        // if ther is a message
        if(error.response.data.Message){
            return parseError(error.response.data.Message);
        }
        return parseError('An unknown error occured')
    } else {
        return parseError(error)
    }
});

// request header
instance.interceptors.request.use( (config) => {
    try{
        // get stored token and user id
        let token = storageGet(STORAGE_KEYS.ACCESS_TOKEN);
        let userid = storageGet(STORAGE_KEYS.USER_ID);
        let newConfig = Object.assign({}, config);

        // add default headers
        newConfig.headers =  Object.assign({
            // emailurl: URL
        }, HEADERS, newConfig.headers);

        // add token to header if found
        if(token){
            newConfig.headers =  Object.assign({}, newConfig.headers, {
                Authorization: `Bearer ${token}`
            });
        }

        // add user id to data if found
        if(userid){
            if(['get', 'delete'].indexOf(newConfig.method.toLowerCase()) != -1){
                if(!newConfig.headers.noUserId){
                    newConfig.params = Object.assign({}, newConfig.params, {
                        userid: userid
                    });
                }
            }
            if(['post', 'put'].indexOf(newConfig.method.toLowerCase()) != -1){
                if(!newConfig.headers.noUserId){
                	if(newConfig.data instanceof FormData){
                		newConfig.data.append('userid', userid);
                	}
                	else{
	                    newConfig.data = Object.assign({}, newConfig.data, {
	                        userid: userid
	                    });
                	}
                }
            }
        }

        delete newConfig.headers.noUserId

        // newConfig.timeout = 30000;

        // return transformed newConfig
        return newConfig
    } catch(error){
        // reject error if failed
        return Promise.reject(new Error('An error occured, please try again in a moment.'))
        // log error to console if debug is enabed
        if(DEBUG){
            console.log(error);
        }
    }
  }, error => {
        return Promise.reject(error)
        // log error to console if debug is enabled
        if(DEBUG){
            console.log(error);
        }
});

/**
 * export instance as http
 */
export const HTTP = instance;