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
let Template = ({fn, form, disableSubmit, title, submitLabel, disabled}) => (
   <div >
        <form onSubmit={(ev) => fn.handlSubmit(ev)}>
            <div className='text-base text-black text-center mb-4'>
                Send to WhatsApp
            </div>
            <div className='form-fields'>
                <div className='form-fields-inner payment-form'>
                    <div className='row fields-row md:mb-4'>
                        <div className='col-md-12 mb-3'>
                            <label className='input-label'> Send to WhatsApp </label>
                            <Input 
                                size='sm'
                                noIcon
                                disabled={disabled.phonenumber}                                
                                value={form.PhoneNumber} 
                                onFocus={() => fn.handleFieldFocus('PhoneNumber')}
                                onBlur={() => fn.handleFieldBlur('PhoneNumber')}
                                variant={fn.fieldIsTouched('PhoneNumber') && fn.fieldHasError('PhoneNumber') && !fn.fieldIsFocused('PhoneNumber') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('PhoneNumber', event.target.value)}
                            />
                            {
                                fn.fieldHasError('PhoneNumber') && !fn.fieldIsFocused('PhoneNumber') && fn.fieldIsTouched('PhoneNumber') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('PhoneNumber')}</Typography>
                            }
                        </div>
                        <span className='ml-3 mb-2'>
                            International format only. Omit any zeroes, brackets or dashes. e.g <span className='text-black'>NG:</span> 2348062178900, <span className='text-black'>US:</span> 15551234567, <span className='text-black'>UK:</span> 447981555555
                        </span>
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

class WhatsAppForm extends FormComponent {

    static propTypes = {
        setRef: propTypes.func
    }
    
    constructor(){
        super(null, {
            form: {
                PhoneNumber: '',               
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
                    PhoneNumber: this.props.data.phonenumber || '',                  
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
            PhoneNumber: {
                required: Rules.required,
                numeric: Rules.isNumeric,
            }          
        }
    }

    validationMessages(){
        return {
            PhoneNumber: {
                required: 'Please enter the phone number.',
                numeric: 'Phone number must be a number.',                
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
                PhoneNumber: data.phonenumber || '',               
            };
            return !isEqual(dataForm, form);
        }
        
        return !isEqual(initialForm, form);
    }
}

export default connect()(withRouter(WhatsAppForm));