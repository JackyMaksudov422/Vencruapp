export default function MessageParser(message, defaultMessage = null){

    if(!message){
        return null;
    }

    let lowercased = new String(message.toLowerCase()).trim();

    if(typeof message == 'string'){

        if(lowercased.indexOf('no action was found on the controller') != -1){
            message =  'Service unavailable, try again in a few minutes.';
        }

        if(lowercased.indexOf('the user name or password is incorrect') != -1){
            message = 'The email or password you entered is incorrect.';
        }

        if(lowercased == 'an error has occurred.' || lowercased == 'an error has occurred'){
            message = 'We can\'t complete your request right now.';
        }

        if(lowercased.indexOf('network error') != -1){
            message = 'Please check your internet connection and try again.';
        }

        if(lowercased.indexOf('timed out') != -1 || lowercased.indexOf('timeout') != -1){
            message = 'The seems to be taking a long time to load, please try again in a moment.';
        }

    }

    return defaultMessage && defaultMessage || message;
}