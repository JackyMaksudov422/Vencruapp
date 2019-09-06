import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Validator from '../../modules/Validator';
import { required, isEmail, match, minLength } from '../../helpers/Rules';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import { RESET_PASSWORD, VERIFY_RESET_TOKEN } from '../../configs/api.config';
import AuthPages from '../presentation/AuthPages';
import Input from '../presentation/Input';
import Button from '../presentation/Button';
import Typography from '../presentation/Typography';
import Request from '../../helpers/Request';

let Template = ({
    fn, 
    classes, 
    isFetching, 
    failureMessage, 
    showPassword, 
    form,
    ready,
    confirmErrorMessage
}) => (
    <AuthPages
            pageTitle='Reset Your Password'
            progress={isFetching && 'primary' || null}
        >
            {/* validator component */}
            <Validator rules={fn.rules()}
                messages={fn.messages()} form={form}
                onChange={fn.handleValidatorChange} />

            { typeof failureMessage == 'string' && 
                <Typography 
                    variant='danger' 
                    className='mt10 mb10 spanned' 
                    align='center'
                    onClick={() => fn.resetFailureMessage()}
                >{failureMessage}</Typography>
            }

            { ready && 
                <React.Fragment>
                    <form onSubmit={(event) => fn.handleOnSubmit(event)}>
                        <fieldset 
                            disabled={isFetching ? true : false} 
                            className='clean-fieldset'
                        >

                        <div className='spanned mt10 mb20'>
                            <Input
                                variant={fn.fieldError('password') && !fn.isFocused('password') && fn.isTouched('password') && 'warning' || 'default'}
                                type='password'
                                onChange={(event) => fn.handleOnChange('password', event)}
                                onFocus={(event) => fn.handleOnFocus('password')}
                                onBlur={(event) => fn.handleOnBlur('password')}
                                value={form.password}
                                placeholder='Enter new password'
                                className='mb5'
                            />
                            {
                                fn.fieldError('password') && !fn.isFocused('password') && fn.isTouched('password') &&
                                <Typography
                                    size='sm' 
                                    variant='warning'
                                    className='mt0'
                                >{fn.fieldError('password')}</Typography>
                            }
                        </div>

                        <div className='spanned mb20'>
                            <Input
                                variant={fn.fieldError('password_confirmation') && !fn.isFocused('password_confirmation') && fn.isTouched('password_confirmation') && 'warning' || 'default'}
                                type='password'
                                onChange={(event) => fn.handleOnChange('password_confirmation', event)}
                                onFocus={(event) => fn.handleOnFocus('password_confirmation')}
                                onBlur={(event) => fn.handleOnBlur('password_confirmation')}
                                value={form.password_confirmation}
                                placeholder='Confirm new password'
                                className='mb5'
                            />
                            {
                                fn.fieldError('password_confirmation') && !fn.isFocused('password_confirmation') && fn.isTouched('password_confirmation') &&
                                <Typography
                                    size='sm' 
                                    variant='warning'
                                    className='mt0'
                                >{fn.fieldError('password_confirmation')}</Typography>
                            }
                        </div>

                        <div className='spanned mb30'>
                            <Button type='submit' block>Reset Password</Button>
                        </div>
                        </fieldset>
                    </form>
                    <h4 className='text-center normal-font'>
                        Don't have an account? <Link to='/sign-up'>Sign up</Link>
                    </h4>

                    <h4 className='text-center normal-font mb30'>
                    <Link to='/login'>Log into your account?</Link>
                    </h4>
                </React.Fragment>
            }

            { isFetching && !ready && <Typography align='center'>Please wait...</Typography> }
            { !isFetching && !ready && typeof confirmErrorMessage && 
                <div className='spanned text-center'>
                    <Typography
                        align='center'
                    >
                        { confirmErrorMessage }
                    </Typography>
                    <Button 
                        variant='primary'
                        type='button'
                        onClick={() => fn.confirmToken()}
                        className='mb40'
                    >Try Again</Button>
                </div>
            }


        </AuthPages>
);

class ResetPassword extends React.Component {
    state = {
        validation: {
            valid: false,
            fields: null
        },
        focused: [],
        touched: [],
        form: {
            email: '',
            password: '',
            password_confirmation: '',
        },
        showPassword: false,
        isFetching: false,
        failureMessage: null,
        failed: false,
        confirmErrorMessage: null,
        ready: false,
        verificationFailed: true,
    };

    componentDidMount(){
        let $request = new Request;
        this.userId = $request.get('userid', null);
        this.code = $request.get('code', null);

        if(!this.userId || !this.code){
            this.props.showSnackbar('Please fill and submit this form to receive a password reset link.', {variant: 'error'});
            this.props.history.replace('/forgot-password');
            return;
        }

        this.confirmToken();
    }

    componentWillMount(){
        if(this.props.auth.isAuthenticated){
            this.props.history.replace('/');
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if( !prevState.data &&
            this.state.data
        ){
            this.props.loggedIn(this.state.data);
        }

        if( !prevProps.auth.isAuthenticated &&
            this.props.auth.isAuthenticated
        ){
            this.props.history.push('/');
        }
    }

    render(){
        return <Template 
            {...this.prps()} 
            fn={this.fn()}
        />
    }

    prps = () => ({
        date              : new Date,
        ready             : this.state.ready,
        form              : this.state.form,
        validation        : this.state.validation,
        isFetching        : this.state.isFetching,
        showPassword      : this.state.showPassword,
        failureMessage    : this.state.failureMessage,
        confirmErrorMessage: this.state.confirmErrorMessage,
    })

    fn = () => ({
        rules                   : this.rules,
        isValid                 : this.isValid,
        messages                : this.messages,
        isTouched               : this.isTouched,
        isFocused               : this.isFocused,
        fieldError              : this.fieldError,
        handleOnBlur            : this.handleOnBlur,
        confirmToken            : () => this.confirmToken(),
        handleOnFocus           : this.handleOnFocus,
        disableButton           : this.disableButton,
        handleOnSubmit          : this.handleOnSubmit,
        handleOnChange          : this.handleOnChange,
        resetFailureMessage     : () => this.setState({failureMessage: null}),
        handleValidatorChange   : this.handleValidatorChange,
        handleClickShowPassword : this.handleClickShowPassword,
        handleGoogleLoginSuccess: (data) => this.handleGoogleLoginSuccess(data),
        handleGoogleLoginFailure: (data) => this.handleGoogleLoginFailure(data),
    })

    rules = () => ({
        password: {
            'required': required,
            'min': (value) => minLength(6, value)
        },
        password_confirmation: {
            'match': (value) => match(this.state.form.password, value)
        }
    })

    messages = () => ({
        password: {
            'required': 'Please enter your new password.',
            'min': 'New password must be 6 characters or more.'
        },
        password_confirmation: {
            'match': 'Passwords do not match.'
        }
    })

    fieldError = (field) => {
        const { validation } = this.state;
        if(this.isValid(field)) return false;
        if(this.isFocused(field)) return false;
        if(!this.isTouched(field)) return false;
        return validation.fields[field]['error'];
    }

    isValid = (field) => {
        const { validation } = this.state;
        if(!validation || !validation.fields) return true;
        if(!validation.fields[field]) return true;
        return validation.fields[field]['valid'] ? true : false;
    }

    isTouched = (field) => {
        return this.state.touched.indexOf(field) != -1;
    }

    isFocused = (field) => {
        return this.state.focused.indexOf(field) != -1;
    }

    disableButton = () => {
        return !this.state.validation.valid || this.state.isFetching;
    }

    handleValidatorChange = (validation) => {
        this.setState({validation})
    }

    handleOnFocus = (field) => {
        var {focused} = this.state;
        // add field to focused
        if(focused.indexOf(field) == -1){
            focused.push(field);
        }
        // update component state
        this.setState({focused});
    }

    handleOnBlur = (field) => {
        var {focused} = this.state;
        // add field to focused
        if(focused.indexOf(field) != -1){
            focused.splice(focused.indexOf(field), 1);
        }
        // update component state
        this.setState({focused});
    }

    handleOnChange = (field, event) => {
        var {form, touched} = this.state;
        // add field to touched
        if(!this.isTouched(field)){
            touched.push(field);
        }
        // update form
        var form = Object.assign({}, this.state.form);
        form[field] = event.target.value;
        // update component state
        this.setState({form, touched});
    }

    handleClickShowPassword = () => {
        this.setState(state => ({ showPassword: !state.showPassword }));
    }

    handleOnSubmit = (ev) => {
        ev.preventDefault();
        const { validation, form } = this.state;
        this.setState({
            touched: Object.keys(form)
        }, () => {
            if(!validation.valid) return;
            this.resetPassword(form);
        })
    }

    resetPassword(data){
        this.setState({
            isFetching: true,
            failureMessage: null,
            data: null
        });
        RESET_PASSWORD({
            code: this.code,
            userId: this.userId,
            NewPassword: data.password,
            Confirmpassword: data.password_confirmation,
        }).then( response => {
            this.setState({
                isFetching: false
            }, () => {
                this.props.showSnackbar('Your password has been successfully reset, you can now log into your account.', {variant: 'success'});
                this.props.history.replace('login')
            });

        }).catch( error => {
            this.setState({
                isFetching: false,
                failureMessage: error
            });
        });
    }

    confirmToken(){
        this.setState({
            isFetching: true,
            verificationFailed: false,
            confirmErrorMessage: null
        });

        setTimeout(() => {
            VERIFY_RESET_TOKEN({
                code: this.code,
                userId: this.userId
            })
            .then( response => {
                this.setState({
                    ready: true,
                    isFetching: false,
                    verificationFailed: false,
                })
            }).catch( error => {
                let confirmErrorMessage = 'Whoops! Seems like something went wrong, please ensure you\'re connected to the internet and try again.';
                if(error && typeof error == 'string'){
                    if(error.trim().toLowerCase().indexOf('invalid token') !== -1){
                        this.props.showSnackbar('Your reset link is either expired or invalid.', {variant: 'error'});
                        this.props.history.replace('/forgot-password');
                        return;
                    }
                    if(error.trim().toLowerCase().indexOf('network error') !== -1){
                        confirmErrorMessage = 'An network error occured, please ensure, yout internate'
                    }
                }
                this.setState({
                    isFetching: false,
                    verificationFailed: true,
                    confirmErrorMessage: confirmErrorMessage
                });
            });
        }, 1000);


    }

    handleGoogleLoginSuccess(data){
        console.log(data);   
    }

    handleGoogleLoginFailure(){
        
    }
}

const mapStateToProps = ({ auth }) => {
    return { auth };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        loggedIn: ActionCreators.loggedIn,
        showSnackbar: ActionCreators.showSnackbar
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ResetPassword));