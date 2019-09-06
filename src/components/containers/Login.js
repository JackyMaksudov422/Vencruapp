import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Validator from '../../modules/Validator';
import { required, isEmail } from '../../helpers/Rules';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import { LOGIN, GOOGLE_LOGIN } from '../../configs/api.config';
import AuthPages from '../presentation/AuthPages';
import Input from '../presentation/Input';
import Button from '../presentation/Button';
import Typography from '../presentation/Typography';
import GoogleButton from '../presentation/GoogleButton';
import MessageParser from '../../helpers/MessageParser';
import { DEBUG } from '../../configs/app.config';

let Template = ({
    fn,
    classes,
    isFetching,
    failureMessage,
    disableForm,
    form
}) => (
        <AuthPages
            pageTitle='Log into your Business Manager'
            progress={isFetching ? 'primary' : null}
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

            <form onSubmit={(event) => fn.handleOnSubmit(event)}>
                <fieldset 
                    disabled={isFetching ? true : false} 
                    className='clean-fieldset'
                >
                <div className='spanned mt10 mb10'>
                    <Input
                        variant={fn.fieldError('email') && !fn.isFocused('email') && fn.isTouched('email') && 'danger' || 'default'}
                        type='text'
                        onChange={(event) => fn.handleOnChange('email', event)}
                        onFocus={(event) => fn.handleOnFocus('email')}
                        onBlur={(event) => fn.handleOnBlur('email')}
                        value={form.email}
                        placeholder='Enter your email address'
                        className='mb5'
                    />
                    {
                        fn.fieldError('email') && !fn.isFocused('email') && fn.isTouched('email') &&
                        <Typography
                            size='sm' 
                            variant='danger'
                            className='mt0'
                        >{fn.fieldError('email')}</Typography>
                    }
                </div>

                <div className='spanned mb30'>
                    <Input
                        variant={fn.fieldError('password') && !fn.isFocused('password') && fn.isTouched('password') && 'warning' || 'default'}
                        type='password'
                        onChange={(event) => fn.handleOnChange('password', event)}
                        onFocus={(event) => fn.handleOnFocus('password')}
                        onBlur={(event) => fn.handleOnBlur('password')}
                        value={form.password}
                        placeholder='Enter your password'
                        passwordToggle
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

                <div className='spanned mb30'>
                    <Button type='submit' block>Sign In</Button>
                </div>
                </fieldset>
            </form>

            <h4 className='text-center normal-font'>
                Don't have an account? <Link to='/sign-up'>Sign Up</Link>
            </h4>

            <h4 className='text-center normal-font mb30'>
               <Link to='/forgot-password'>Forgot Password?</Link>
            </h4>

            <GoogleButton
                disabled={isFetching}
                onSuccess={(data) => fn.handleGoogleLoginSuccess(data)}
                onfailure={(data) => fn.handleGoogleLoginFailure(data)}
            />

        </AuthPages>
    );

class Login extends React.Component {
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
        },
        isFetching: false,
        failureMessage: null,
        date: null
    };

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.data &&
            this.state.data
        ) {
            this.props.loggedIn(this.state.data);
        }
    }

    render() {
        return <Template
            {...this.prps()}
            fn={this.fn()}
        />
    }

    prps = () => ({
        date: new Date,
        auth: this.props.auth,
        form: this.state.form,
        validation: this.state.validation,
        isFetching: this.state.isFetching,
        failureMessage: MessageParser(this.state.failureMessage),
        disableForm: this.disableForm(),
    })

    fn = () => ({
        rules: this.rules,
        isValid: this.isValid,
        messages: this.messages,
        isTouched: this.isTouched,
        isFocused: this.isFocused,
        fieldError: this.fieldError,
        handleOnBlur: this.handleOnBlur,
        handleOnFocus: this.handleOnFocus,
        handleOnSubmit: this.handleOnSubmit,
        handleOnChange: this.handleOnChange,
        handleValidatorChange: this.handleValidatorChange,
        resetFailureMessage: () => this.setState({failureMessage: null}),
        handleGoogleLoginSuccess: (data) => this.handleGoogleLoginSuccess(data),
        handleGoogleLoginFailure: (data) => this.handleGoogleLoginFailure(data),
    })

    rules = () => ({
        email: {
            'required': required,
            'email': isEmail,
        },
        password: {
            'required': required
        }
    })

    messages = () => ({
        email: {
            'required': 'Your email address is required.',
            'email': 'Please enter a valid email address.',
        },
        password: {
            'required': 'Please enter a password.'
        }
    })

    fieldError = (field) => {
        const { validation } = this.state;
        if (this.isValid(field)) return false;
        if (this.isFocused(field)) return false;
        if (!this.isTouched(field)) return false;
        return validation.fields[field]['error'];
    }

    isValid = (field) => {
        const { validation } = this.state;
        if (!validation || !validation.fields) return true;
        if (!validation.fields[field]) return true;
        return validation.fields[field]['valid'] ? true : false;
    }

    isTouched = (field) => {
        return this.state.touched.indexOf(field) != -1;
    }

    isFocused = (field) => {
        return this.state.focused.indexOf(field) != -1;
    }

    disableForm = () => {
        return !this.state.validation.valid || this.state.isFetching;
    }

    handleValidatorChange = (validation) => {
        this.setState({ validation })
    }

    handleOnFocus = (field) => {
        var { focused } = this.state;
        // add field to focused
        if (focused.indexOf(field) == -1) {
            focused.push(field);
        }
        // update component state
        this.setState({ focused });
    }

    handleOnBlur = (field) => {
        var { focused } = this.state;
        // add field to focused
        if (focused.indexOf(field) != -1) {
            focused.splice(focused.indexOf(field), 1);
        }
        // update component state
        this.setState({ focused });
    }

    handleOnChange = (field, event) => {
        var { form, touched } = this.state;
        // add field to touched
        if (!this.isTouched(field)) {
            touched.push(field);
        }
        // update form
        var form = Object.assign({}, this.state.form);
        form[field] = event.target.value;
        // update component state
        this.setState({ form, touched });
    }

    handleOnSubmit = (ev) => {
        ev.preventDefault();
        const { validation, form } = this.state;
        this.setState({
            touched: Object.keys(form)
        }, () => {
            if (!validation.valid) return;
            this.login(form);
        })
    }

    login(data) {
        this.setState({
            isFetching: true,
            failureMessage: null,
            data: null
        });

        LOGIN({
            email: data.email,
            password: data.password
        }).then(response => {
            if ((typeof response.userId == "string" || typeof response.userId == 'number') &&
                typeof response.access_token == "string" &&
                typeof response[".expires"] == "string"
            ) {
                this.setState({
                    isFetching: false,
                    data: response
                });
                return;
            }

            if (DEBUG) {
                console.log(new Error('Sign in response is malformed.'));
            }

            this.setState({
                isFetching: false,
                failureMessage: 'Email address or password is incorrect.'
            });
        }).catch(error => {
            this.setState({
                isFetching: false,
                failureMessage: error
            });
        });
    }

    googleLogin(data) {
        this.setState({
            isFetching: true,
            data: null
        });

        GOOGLE_LOGIN({
            LoginProvider: 'google',
            Email: data.email,
            Password: data.googleId
        }).then(response => {
            if ((typeof response.userId == "string" || typeof response.userId == 'number') &&
                typeof response.access_token == "string" &&
                typeof response[".expires"] == "string"
            ) {
                this.setState({
                    isFetching: false,
                    data: response
                });
                return;
            }

            if (DEBUG) {
                console.log(new Error('Sign in response is malformed.'));
            }

            this.props.showSnackbar('An error occure, please try again.', {variant: 'error'});

            this.setState({
                isFetching: false
            });
        }).catch(error => {
            let errorMessage = typeof error == 'string' && error || 'An error occure, please try again.';
            if(errorMessage.toLowerCase().trim().indexOf('email or password you entered') != -1){
                errorMessage = 'That email address is in use by another account.';
            }
            this.props.showSnackbar(errorMessage, {variant: 'error'});
            this.setState({
                isFetching: false
            });
        });
    }

    handleGoogleLoginSuccess(data){
        this.googleLogin({
            googleId: data && data.googleId || undefined,
            email: data && data.email || undefined
        })
    }

    handleGoogleLoginFailure(data){
        
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));