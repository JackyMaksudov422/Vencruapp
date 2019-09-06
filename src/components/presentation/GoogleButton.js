import React from 'react';
import {GoogleLogin} from 'react-google-login';
import Button from './Button';
import propTypes from 'prop-types';
import { GOOGLE_CLIENT_ID } from '../../configs/app.config'

export default class GoogleButton extends React.Component{

    static propTypes = {
        onSuccess: propTypes.func.isRequired,
        onFailure: propTypes.func,
    }

    state = {
        ready: false
    }

    componentDidMount(){
        if( window && 
            window.gapi &&
            window.gapi.auth2 && 
            typeof window.gapi.auth2.getAuthInstance == 'function'
        ){
            const auth2 = window.gapi.auth2.getAuthInstance()
            if (auth2 != null && 
                typeof auth2.signOut == 'function'
            ){
                auth2.signOut().then( 
                    auth2.disconnect().then( () => {} )
                );
                // return;
            }
            // return;
        }

        this.setState({
            ready: true
        });
    }

    render(){
        if(!this.state.ready){
            return null;
        }
        return (
            <GoogleLogin
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Login"
                onSuccess={response => this.responseGoogle(response)}
                onFailure={response => this.responseGoogle(response)}
                render={({onClick}) => (
                    <Button 
                        variant='google-signin' 
                        onClick={() => onClick()} 
                        block className='mb20'
                    />
                )}
            />
        );
    }

    responseGoogle(response){
        if( response &&
            response.profileObj &&
            typeof this.props.onSuccess == 'function'
        ){
            this.props.onSuccess(Object.assign({}, response.profileObj));
            return;
        }

        if( response.error &&
            typeof this.props.onFailure == 'function'
        ){
            this.props.onFailure(response);
            return;
        }
    }

}