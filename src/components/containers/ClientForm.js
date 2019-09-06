import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FormComponent from './FormComponent';
import * as Rules from '../../helpers/Rules';
import { isValidNumber } from 'libphonenumber-js';
import Input from '../presentation/Input';
import Button from '../presentation/Button';
import Typography from '../presentation/Typography';
import propTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

/**
 * component template
 */
let Template = ({fn, form, disableSubmit, title, submitLabel, disabled}) => (
   <div className='vc-client-form'>
        <form onSubmit={(ev) => fn.handlSubmit(ev)}>
            <h1 className='title'>
                { title }
            </h1>
            <div className='form-fields'>
                <div className='form-fields-inner'>
                    <div className='row fields-row md:mb-4'>
                        <div className='col-md-6'>
                            <Input 
                                size='sm'
                                noIcon
                                disabled={disabled}
                                label='First Name' 
                                value={form.FirstName} 
                                onFocus={() => fn.handleFieldFocus('FirstName')}
                                onBlur={() => fn.handleFieldBlur('FirstName')}
                                variant={fn.fieldIsTouched('FirstName') && fn.fieldHasError('FirstName') && !fn.fieldIsFocused('FirstName') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('FirstName', event.target.value)}
                            />
                            {
                                fn.fieldHasError('FirstName') && !fn.fieldIsFocused('FirstName') && fn.fieldIsTouched('FirstName') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('FirstName')}</Typography>
                            }
                        </div>
                        <div className='col-md-6'>
                            <Input 
                                size='sm'
                                noIcon
                                disabled={disabled}
                                label='Last Name' 
                                value={form.LastName} 
                                onFocus={() => fn.handleFieldFocus('LastName')}
                                onBlur={() => fn.handleFieldBlur('LastName')}
                                variant={fn.fieldIsTouched('LastName') && fn.fieldHasError('LastName') && !fn.fieldIsFocused('LastName') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('LastName', event.target.value)}
                            />
                            {
                                fn.fieldHasError('LastName') && !fn.fieldIsFocused('LastName') && fn.fieldIsTouched('LastName') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('LastName')}</Typography>
                            }
                        </div>
                    </div>
                    <div className='row fields-row md:mb-4'>
                        <div className='col-md-12'>
                            <Input 
                                size='sm'
                                noIcon
                                disabled={disabled}
                                label='Company' 
                                value={form.CompanyName} 
                                onFocus={() => fn.handleFieldFocus('CompanyName')}
                                onBlur={() => fn.handleFieldBlur('CompanyName')}
                                variant={fn.fieldIsTouched('CompanyName') && fn.fieldHasError('CompanyName') && !fn.fieldIsFocused('CompanyName') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('CompanyName', event.target.value)}
                            />
                            {
                                fn.fieldHasError('CompanyName') && !fn.fieldIsFocused('CompanyName') && fn.fieldIsTouched('CompanyName') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('CompanyName')}</Typography>
                            }
                        </div>
                    </div>
                    <div className='row fields-row md:mb-4'>
                        <div className='col-md-6'>
                            <Input 
                                size='sm'
                                noIcon
                                disabled={disabled}
                                label='Email Address' 
                                value={form.CompanyEmail} 
                                onFocus={() => fn.handleFieldFocus('CompanyEmail')}
                                onBlur={() => fn.handleFieldBlur('CompanyEmail')}
                                variant={fn.fieldIsTouched('CompanyEmail') && fn.fieldHasError('CompanyEmail') && !fn.fieldIsFocused('CompanyEmail') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('CompanyEmail', event.target.value)}
                            />
                            {
                                fn.fieldHasError('CompanyEmail') && !fn.fieldIsFocused('CompanyEmail') && fn.fieldIsTouched('CompanyEmail') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('CompanyEmail')}</Typography>
                            }
                        </div>
                        <div className='col-md-6'>
                            <Input 
                                size='sm'
                                noIcon
                                disabled={disabled}
                                label='Phone Number' 
                                value={form.PhoneNumber} 
                                onFocus={() => fn.handleFieldFocus('PhoneNumber')}
                                onBlur={() => fn.handleFieldBlur('PhoneNumber')}
                                variant={fn.fieldIsTouched('PhoneNumber') && fn.fieldHasError('PhoneNumber') && !fn.fieldIsFocused('PhoneNumber') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('PhoneNumber', event.target.value)}
                                placeholder="E.g +234 808 000 0000"
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
                    </div>
                    <div className='row fields-row md:mb-4'>
                        <div className='col-md-12'>
                            <Input 
                                size='sm'
                                noIcon
                                disabled={disabled}
                                label='Address(Street)' 
                                value={form.Street} 
                                onFocus={() => fn.handleFieldFocus('Street')}
                                onBlur={() => fn.handleFieldBlur('Street')}
                                variant={fn.fieldIsTouched('Street') && fn.fieldHasError('Street') && !fn.fieldIsFocused('Street') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('Street', event.target.value)}
                            />
                            {
                                fn.fieldHasError('Street') && !fn.fieldIsFocused('Street') && fn.fieldIsTouched('Street') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('Street')}</Typography>
                            }
                        </div>
                    </div>
                    <div className='row fields-row'>
                        <div className='col-md-6'>
                            <Input 
                                size='sm'
                                noIcon
                                disabled={disabled}
                                label='Address(City)' 
                                value={form.City} 
                                onFocus={() => fn.handleFieldFocus('City')}
                                onBlur={() => fn.handleFieldBlur('City')}
                                variant={fn.fieldIsTouched('City') && fn.fieldHasError('City') && !fn.fieldIsFocused('City') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('City', event.target.value)}
                            />
                            {
                                fn.fieldHasError('City') && !fn.fieldIsFocused('City') && fn.fieldIsTouched('City') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('City')}</Typography>
                            }
                        </div>
                        <div className='col-md-6'>
                            <Input 
                                size='sm'
                                noIcon
                                disabled={disabled}
                                label='Address(Country)' 
                                value={form.Country} 
                                onFocus={() => fn.handleFieldFocus('Country')}
                                onBlur={() => fn.handleFieldBlur('Country')}
                                variant={fn.fieldIsTouched('Country') && fn.fieldHasError('Country') && !fn.fieldIsFocused('Country') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('Country', event.target.value)}
                            />
                            {
                                fn.fieldHasError('Country') && !fn.fieldIsFocused('Country') && fn.fieldIsTouched('Country') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('Country')}</Typography>
                            }
                        </div>
                    </div>
                </div>
                <div
                    className='dotted-background'
                    style={{backgroundImage: `url("${require('../../assets/business-card-dots.png')}")`}}
                ></div>
            </div>
            <div className='spanned'>
                <div className='row'>
                    { typeof fn.handleCancelPress == 'function' && 
                        <div className='col-sm-6 text-right'>
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
                    <div className={`${typeof fn.handleCancelPress == 'function' && 'col-sm-6 text-left' || 'col-sm-12 text-center'}`}>
                        <Button disabled={disableSubmit} variant='primary' className='submit-button'>{submitLabel}</Button>
                    </div>
                </div>
            </div>
        </form>
   </div>
);

class CreateClient extends FormComponent {

    static propTypes = {
        setRef: propTypes.func
    }
    
    constructor(){
        super(null, {
            form: {
                FirstName: '',
                LastName: '',
                CompanyName: '',
                CompanyEmail: '',
                PhoneNumber: '',
                Street: '',
                City: '',
                Country: '',
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
                    FirstName: this.props.data.firstname || '',
                    LastName: this.props.data.lastname || '',
                    CompanyName: this.props.data.companyname || '',
                    CompanyEmail: this.props.data.companyemail || '',
                    PhoneNumber: this.props.data.phonenumber || '',
                    Street: this.props.data.street || '',
                    City: this.props.data.city || '',
                    Country: this.props.data.country || '',
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
        if(this.props.disabled){
            return true;
        }
        return false;
    }

    validationData(){
        return Object.assign({}, this.state.form);
    }

    validationRules(){
        return {
            FirstName: {
                required: Rules.required
            },
            LastName: {
                required: Rules.required
            },
            CompanyName: {
                required: Rules.required
            },
            CompanyEmail: {
                required: Rules.required,
                isEmail: Rules.isEmail
            },
            PhoneNumber: {
                required: Rules.required,
                isPhone: (value) => Rules.sometimes(Rules.isPhone, value)
            }
        }
    }

    validationMessages(){
        return {
            FirstName: {
                required: 'Please enter the client\'s first name.'
            },
            LastName: {
                required: 'Please enter the client\'s last name.'
            },
            CompanyName: {
                required: 'Please enter the company\'s name.'
            },
            CompanyEmail: {
                required: 'Please enter the client\'s email address.',
                isPhone: 'Invalid email address entered.'
            },
            PhoneNumber: {
                required: 'Please enter the client\'s phone number.',
                isPhone: 'Phone number should begin with country code. E.g +234 XX XXX XXXX'
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
                FirstName: data.firstname || '',
                LastName: data.lastname || '',
                CompanyName: data.companyname || '',
                CompanyEmail: data.companyemail || '',
                PhoneNumber: data.phonenumber || '',
                Street: data.street || '',
                City: data.city || '',
                Country: data.country || '',
            };
            return !isEqual(dataForm, form);
        }
        
        return !isEqual(initialForm, form);
    }
}

export default connect()(withRouter(CreateClient));