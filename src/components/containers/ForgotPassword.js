import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Validator from '../../modules/Validator';
import { required, isEmail } from '../../helpers/Rules';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import { SEND_RESET_TOKEN } from '../../configs/api.config';
import AuthPages from '../presentation/AuthPages';
import Input from '../presentation/Input';
import Button from '../presentation/Button';
import Typography from '../presentation/Typography';

let Template = ({
    fn,
    isFetching,
    failureMessage,
    disableForm,
    form
}) => (
        <AuthPages
            pageTitle={`Reset Your Account's Password`}
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
                    <Button type='submit' block>Send Reset Token</Button>
                </div>
                </fieldset>
            </form>

            <h4 className='text-center normal-font'>
                Don't have an account? <Link to='/sign-up'>Sign up</Link>
            </h4>

            <h4 className='text-center normal-font mb30'>
               <Link to='/login'>Log into your account?</Link>
            </h4>

        </AuthPages>
    );

class ForgotPassword extends React.Component {
    state = {
        validation: {
            valid: false,
            fields: null
        },
        focused: [],
        touched: [],
        form: {
            email: '',
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
        failureMessage: this.state.failureMessage,
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
        resetFailureMessage: () => this.setState({failureMessage: null})
    })

    rules = () => ({
        email: {
            'required': required,
            'email': isEmail,
        }
    })

    messages = () => ({
        email: {
            'required': 'Your email address is required.',
            'email': 'Please enter a valid email address.',
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
            this.submit(form);
        })
    }

    submit(data) {
        this.setState({
            isFetching: true,
            failureMessage: null,
            data: null
        });

        SEND_RESET_TOKEN({
            Email: data.email
        }).then(response => {
            this.setState({
                isFetching: false,
                touched: [],
                form: {
                    email: ''
                }
            }, () => {
                this.props.showSnackbar('A password reset link has been sent to your email address.', {variant: 'success'});
            });
        }).catch(error => {
            this.setState({
                isFetching: false,
                failureMessage: error
            });
        });
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ForgotPassword));