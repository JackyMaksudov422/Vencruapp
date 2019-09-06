import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FormComponent from './FormComponent';
import * as Rules from '../../helpers/Rules';
import Input from '../presentation/Input';
import Button from '../presentation/Button';
import Typography from '../presentation/Typography';
import propTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

/**
 * component template
 */
let Template = ({fn, form, disableSubmit, title, submitLabel, disabled, addPersonalMessage}) => (
   <div >
        <form onSubmit={(ev) => fn.handlSubmit(ev)}>
            <div className='text-base text-black text-center mb-4'>
                Send to Email
            </div>
            <div className='form-fields'>
                <div className='form-fields-inner payment-form'>
                    <div className='row fields-row md:mb-4'>
                        <div className='col-md-12 mb-6'>
                            <label className='input-label'> Send to Email </label>
                            <Input 
                                size='sm'
                                noIcon
                                className='mb-2'                                
                                value={form.email} 
                                onFocus={() => fn.handleFieldFocus('email')}
                                onBlur={() => fn.handleFieldBlur('email')}
                                variant={fn.fieldIsTouched('email') && fn.fieldHasError('email') && !fn.fieldIsFocused('email') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('email', event.target.value)}
                            />
                            {
                                fn.fieldHasError('email') && !fn.fieldIsFocused('email') && fn.fieldIsTouched('email') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('email')}</Typography>
                            }
                            <div>Send to list</div>
                        </div>
                        {!addPersonalMessage &&
                        <div className='col-md-12 mb-3'>
                            <label className='input-label'> Your personal message  </label>
                            <Input 
                                size='sm'
                                noIcon 
                                placeholder='Write a personal message'                           
                                value={form.personalmessage} 
                                onFocus={() => fn.handleFieldFocus('personalmessage')}
                                onBlur={() => fn.handleFieldBlur('personalmessage')}
                                variant={fn.fieldIsTouched('personalmessage') && fn.fieldHasError('personalmessage') && !fn.fieldIsFocused('personalmessage') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('personalmessage', event.target.value)}
                            />
                            {
                                fn.fieldHasError('personalmessage') && !fn.fieldIsFocused('personalmessage') && fn.fieldIsTouched('personalmessage') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('personalmessage')}</Typography>
                            }
                        </div>
                        }
                    </div>                   
                </div>                
            </div>
            <div className='spanned'>
                <div className='row'>
                    { typeof fn.handleCancelPress == 'function' && 
                        <div className='w-1/2 text-right'>
                            <Button 
                                variant='link-primary'
                                type='button'
                                className='cancel-button'
                                onClick={() => fn.handleCancelPress()}
                            >
                                Cancel
                            </Button>
                        </div>
                    }
                    <div className={`${typeof fn.handleCancelPress == 'function' && 'w-1/2 text-left' || 'col-sm-12 text-center'}`}>
                        <Button disabled={disableSubmit} variant='primary' className='submit-button'>{submitLabel}</Button>
                    </div>
                </div>
            </div>
        </form>
   </div>
);

class EmailForm extends FormComponent {

    static propTypes = {
        setRef: propTypes.func
    }
    
    constructor(){
        super(null, {
            form: {
                email: '',
                personalmessage: ''             
            }
        });
    }

    componentDidMount(){
        if(typeof this.props.setRef == 'function'){
            this.props.setRef(this);
        }
        if(this.props.data){
            this.setState({
                form: {
                    email: this.props.data.email || '',
                    personalmessage: ''                  
                }
            })
        }
    }

    componentWillUnmount(){
        if(typeof this.props.setRef == 'function'){
            this.props.setRef(undefined);
        }
    }

    renderMethod(){
        return <Template 
            {...this.prps()} 
            fn={this.fn()} 
        />;
    }

    fn = () => ({
        // bound functions go here
        fieldHasError: (field) => this.fieldHasError(field),
        fieldIsTouched: (field) => this.fieldIsTouched(field),
        fieldIsFocused: (field) => this.fieldIsFocused(field),
        handleFieldBlur: (field) => this.handleFieldBlur(field),
        handleFieldFocus: (field) => this.handleFieldFocus(field),
        handleFieldValueChange: (field, value) => this.handleFieldValueChange(field, value),
        handlSubmit: (ev) => this.handlSubmit(ev),
        handleCancelPress: this.props.onCancel ? () => this.props.onCancel() : null
    })

    prps = () => ({
        form: this.state.form,
        disableSubmit: this.disableSubmit(),
        disabled: this.props.disabled || false,
        title: this.props.title,
        submitLabel: this.props.submitLabel
    })

    disableSubmit(){
        if(!this.formIsValid()){
            return true;
        }
        // if(this.props.disabled){
        //     return true;
        // }
        return false;
    }

    validationData(){
        return Object.assign({}, this.state.form);
    }

    validationRules(){
        return {
            email: {
                required: Rules.required,
                isemail: Rules.isEmail,
            },
            // personalmessage: {
            //     'min': (value) => Rules.minLength(5, value)
            // }         
        }
    }

    validationMessages(){
        return {
            email: {
                required: 'Please enter the email',
                isemail: 'Please enter a valid email',                
            },
            personalmessage:{
                min: 'Message must be up to five(5) characters'
            }          
        }
    }

    handlSubmit(ev){
        ev.preventDefault();
        let formData = this.state.form && {...this.state.form} || {};
        let fields = Object.keys(formData);
        if(fields.length < 1){
            return;
        }
        this.setState({
            touched: fields
        }, () => {
            if(this.formIsValid()){
                if(typeof this.props.onSubmit == 'function'){
                    this.props.onSubmit(formData);
                }
            }
        });
    }

    isUpdated(){
        const { data } = this.props;
        const { form, initialForm } = this.state; 
        
        if( data ){
            let dataForm = {
                email: data.email || '',
                personalmessage: data.personalmessage || ''             
            };
            return !isEqual(dataForm, form);
        }
        
        return !isEqual(initialForm, form);
    }
}

export default connect()(withRouter(EmailForm));