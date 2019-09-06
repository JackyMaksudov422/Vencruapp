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
import Select from '../presentation/Select';
import moment from 'moment';

const PAYMENT_OPTIONS = ['Cash', 'Online Payment', 'POS', 'Bank Transfer'];
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
                <div className='form-fields-inner payment-form'>
                    <div className='row fields-row md:mb-4'>
                        <div className='col-md-12 mb-3'>
                            <label className='input-label'> Total Amount </label>
                            <Input 
                                size='sm'
                                noIcon
                                disabled={disabled.totalamount}                                
                                value={form.TotalAmount} 
                                onFocus={() => fn.handleFieldFocus('TotalAmount')}
                                onBlur={() => fn.handleFieldBlur('TotalAmount')}
                                variant={fn.fieldIsTouched('TotalAmount') && fn.fieldHasError('TotalAmount') && !fn.fieldIsFocused('TotalAmount') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('TotalAmount', event.target.value)}
                            />
                            {
                                fn.fieldHasError('TotalAmount') && !fn.fieldIsFocused('TotalAmount') && fn.fieldIsTouched('TotalAmount') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('TotalAmount')}</Typography>
                            }
                        </div>
                        <div className='col-md-12'>
                            <label className='input-label'>Deposit Paid</label>
                            <Input 
                                size='sm'
                                noIcon
                                disabled={disabled.depositpaid}                                
                                value={form.DepositPaid} 
                                onFocus={() => fn.handleFieldFocus('DepositPaid')}
                                onBlur={() => fn.handleFieldBlur('DepositPaid')}
                                variant={fn.fieldIsTouched('DepositPaid') && fn.fieldHasError('DepositPaid') && !fn.fieldIsFocused('DepositPaid') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('DepositPaid', event.target.value)}
                            />
                            {
                                fn.fieldHasError('DepositPaid') && !fn.fieldIsFocused('DepositPaid') && fn.fieldIsTouched('DepositPaid') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('DepositPaid')}</Typography>
                            }
                        </div>
                    </div>

                    <div className='row fields-row md:mb-4'>
                        
                        <div className='col-md-6'>
                            <label className='input-label'>Payment Date</label>
                            <Input 
                                size='sm'
                                noIcon
                                disabled={disabled.paymentdate}
                                type="date"
                                value={form.PaymentDate} 
                                onFocus={() => fn.handleFieldFocus('PaymentDate')}
                                onBlur={() => fn.handleFieldBlur('PaymentDate')}
                                variant={fn.fieldIsTouched('PaymentDate') && fn.fieldHasError('PaymentDate') && !fn.fieldIsFocused('PaymentDate') ? 'danger' : 'default'}
                                onChange={(value) => fn.handleFieldValueChange('PaymentDate', value)}
                            />
                            {
                                fn.fieldHasError('PaymentDate') && !fn.fieldIsFocused('PaymentDate') && fn.fieldIsTouched('PaymentDate') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('PaymentDate')}</Typography>
                            }
                        </div>

                        <div className='col-md-6'>
                            <label className='input-label'>Paid With</label>
                            <Select 
                                size='sm'
                                options={PAYMENT_OPTIONS}
                                disabled={disabled.paidwith}
                                value={form.PaidWith} 
                                onFocus={() => fn.handleFieldFocus('PaidWith')}
                                onBlur={() => fn.handleFieldBlur('PaidWith')}
                                variant={fn.fieldIsTouched('PaidWith') && fn.fieldHasError('PaidWith') && !fn.fieldIsFocused('PaidWith') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('PaidWith', event.target.value)}
                            />
                            {
                                fn.fieldHasError('PaidWith') && !fn.fieldIsFocused('PaidWith') && fn.fieldIsTouched('PaidWith') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('PaidWith')}</Typography>
                            }
                        </div>
                       
                    </div>
                                      
                </div>                
            </div>
            <div className='spanned'>
                <div className='row'>
                    { typeof fn.handleCancelPress == 'function' && 
                        <div className='col-6 text-right'>
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
                    <div className={`${typeof fn.handleCancelPress == 'function' && 'col-6 text-left' || 'col-sm-12 text-center'}`}>
                        <Button disabled={disableSubmit} variant='primary' className='submit-button'>{submitLabel}</Button>
                    </div>
                </div>
            </div>
        </form>
   </div>
);

class PaymentForm extends FormComponent {

    static propTypes = {
        setRef: propTypes.func
    }
    
    constructor(){
        super(null, {
            form: {
                TotalAmount: '',
                DepositPaid: '',
                PaymentDate: '',
                PaidWith: PAYMENT_OPTIONS[0],                
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
                    TotalAmount: this.props.data.totalamount || '',
                    DepositPaid: this.props.data.depositpaid || '',
                    PaymentDate: this.props.data.paymentdate || '',
                    PaidWith: this.props.data.paidwith || PAYMENT_OPTIONS[0],                    
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
            TotalAmount: {
                required: Rules.required,
                numeric: Rules.isNumeric,
            },
            DepositPaid: {
                required: Rules.required,
                numeric: Rules.isNumeric,
            },
            PaymentDate: {
                required: Rules.required
            },
            PaidWith: {
                required: Rules.required,
                isIn: (value) => Rules.isIn(PAYMENT_OPTIONS, value),
        },            
        }
    }

    validationMessages(){
        return {
            TotalAmount: {
                required: 'Please enter the total amount.',
                numeric: 'Total amount must be a number.',                
            },
            DepositPaid: {
                required: 'Please enter the deposit paid.',
                numeric: 'Deposit paid must be a number.',                
            },
            PaymentDate: {
                required: 'Please enter the payment date.'
            },
            PaidWith: {
                required: 'Please enter the payment method.',  
                isIn: 'Invalid payment method selected.',              
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
                    // Change date format
                    formData.PaymentDate = moment(formData.PaymentDate[0]).format('DD/MM/YYYY');

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
                TotalAmount: data.totalamount || '',
                DepositPaid: data.depositpaid || '',
                PaymentDate: data.paymentdate || '',
                PaidWith: data.paidwith || '',                
            };
            return !isEqual(dataForm, form);
        }
        
        return !isEqual(initialForm, form);
    }
}

export default connect()(withRouter(PaymentForm));