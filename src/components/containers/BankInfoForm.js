import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FormComponent from './FormComponent';
import * as Rules from '../../helpers/Rules';
import Input from '../presentation/Input';
import Select from '../presentation/Select';
import Button from '../presentation/Button';
import Dropzone from '../presentation/Dropzone';
import Typography from '../presentation/Typography';
import propTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { 
	EXPENSE_CATEGORIES, 
	CURRENCIES_SIGNS,
	ACCOUNT_TYPES
} from '../../configs/data.config.js';
import { ActionCreators } from '../../data/actionCreators';
import { bindActionCreators } from 'redux';
import cloneDeep from 'lodash/cloneDeep';
import InputMask from 'react-input-mask';
import NumberFormat from 'react-number-format';
const logo = require('../../assets/logo.png');
const PAYMENT_OPTIONS = [
	'Cash', 
	'Online Payment',
	'POS',
	'Bank Transfer'
];

/**
 * component template
 */
let Template = ({
	fn, 
	form, 
	disableSubmit, 
	title, 
	submitLabel, 
	disabled, 
	currentReceipt, 
	selectedReceipt, 
	expensenumber,
	currentBusiness
}) => (
    <form className='vc-expense-form' onSubmit={(ev) => fn.handlSubmit(ev)}>
    	<div className='vc-expense-form-header'>
            <span className='title'>
                { title }
            </span>
            <span className='exp-number'>
            	{ expensenumber }
            </span>
    	</div>
    	<div className='vc-expense-form-body'>
            <div className='form-fields'>
                <div className='form-fields-inner'>
                	<div className='row fields-row'>
                		<div className='col-md-6 mb20'>
                			<label className='input-label'>Bank Name</label>
                            <Input 
                                size='sm'
                                noIcon
                                disabled={disabled}
                                value={form.bankname} 
                                onFocus={() => fn.handleFieldFocus('bankname')}
                                onBlur={() => fn.handleFieldBlur('bankname')}
                                variant={fn.fieldIsTouched('bankname') &&
                                		fn.fieldHasError('bankname') &&
                                		!fn.fieldIsFocused('bankname') 
                                		? 'danger' : 'default'
                                }
                                onChange={(event) => fn.handleFieldValueChange(
                                	'bankname',
                                	event.target.value
                                )}
                            />
                            {
                                fn.fieldHasError('bankname') && 
                                !fn.fieldIsFocused('bankname') && 
                                fn.fieldIsTouched('bankname') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('bankname')}</Typography>
                            }
                		</div>
	            		<div className='col-md-6 mb20'>
	            			<label className='input-label'>Account Name</label>
	                        <Input 
	                            size='sm'
	                            noIcon
	                            disabled={disabled}
	                            value={form.accountname} 
	                            onFocus={() => fn.handleFieldFocus('accountname')}
	                            onBlur={() => fn.handleFieldBlur('accountname')}
	                            variant={fn.fieldIsTouched('accountname') && 
	                            		fn.fieldHasError('accountname') && 
	                            		!fn.fieldIsFocused('accountname') 
	                            		? 'danger' : 'default'
	                            }
	                            onChange={(event) => fn.handleFieldValueChange(
	                            	'accountname', event.target.value
	                            )}
	                        />
	                        {
	                            fn.fieldHasError('accountname') && 
	                            !fn.fieldIsFocused('accountname') && 
	                            fn.fieldIsTouched('accountname') &&
	                            <Typography
	                                size='sm' 
	                                variant='danger'
	                                className='mt0'
	                            >{fn.fieldHasError('accountname')}</Typography>
	                        }
	            		</div>
                	</div>
                	<div className='row fields-row mb20'>
                		<div className='col-md-6 mb20'>
                			<label className='input-label'>Account Number</label>
                            <Input 
                                size='sm'
                                noIcon
                                disabled={disabled}
                                value={form.accountnumber} 
                                onFocus={() => fn.handleFieldFocus('accountnumber')}
                                onBlur={() => fn.handleFieldBlur('accountnumber')}
                                variant={fn.fieldIsTouched('accountnumber') && 
                                		fn.fieldHasError('accountnumber') && 
                                		!fn.fieldIsFocused('accountnumber') 
                                		? 'danger' : 'default'
                                }
                                onChange={(event) => fn.handleFieldValueChange(
                                	'accountnumber', event.target.value
                                )}
                            />
                            {
                                fn.fieldHasError('accountnumber') && 
                                !fn.fieldIsFocused('accountnumber') && 
                                fn.fieldIsTouched('accountnumber') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >
                                	{fn.fieldHasError('accountnumber')}
                                </Typography>
                            }
                		</div>

                		<div className='col-md-6 mb20'>
                			<label 
                				className='input-label'
                			>
                				Account Type
                			</label>
                            <Select 
                                size='sm'
                                disabled={disabled}
                                value={form.accounttype} 
                                onFocus={() => fn.handleFieldFocus(
                                	'accounttype'
                                )}
                                onBlur={() => fn.handleFieldBlur(
                                	'accounttype'
                                )}
                                variant={fn.fieldIsTouched('accounttype') && 
                                		fn.fieldHasError('accounttype') && 
                                		!fn.fieldIsFocused('accounttype') 
                                		? 'danger' : 'default'
                                }
                                options={{
                            		'': 'Select Account Type',
                            		...ACCOUNT_TYPES
                            	}}
                                onChange={
                                	event => fn.handleFieldValueChange(
                                		'accounttype', event.target.value
                                	)
                                }
                            />
                            {
                                fn.fieldHasError('accounttype') && 
                                !fn.fieldIsFocused('accounttype') && 
                                fn.fieldIsTouched('accounttype') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >
                                	{fn.fieldHasError('accounttype')}
                                </Typography>
                            }
                		</div>
                	</div>
                	<div className='row fields-row text-left mb20'>
                		<div className='col-md-6'>
                			<Button 
                				variant='primary'
                				className='ph64'
                				block
                			>
                				Submit
                			</Button>
                		</div>
                	</div>
                </div>
            </div>
    	</div>
        <div className='vc-expense-form-footer'>
        	<span 
        		className='powered-by'
        	>
        		Powered By
        	</span>
        	<img 
        		src={logo}
        		className='brand'
        	/>
        </div>
    </form>
);

class BankInfoForm extends FormComponent {

    static propTypes = {
        setRef: propTypes.func
    };
    
    constructor(props){
        super(props, {
            form: {
                bankname: '',
                accountnumber: '',
                accounttype: '',
                accountname: '',
                isdefault: false
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
	                bankname: this.props.data.bankname || '',
	                accountnumber: this.props.data.accountnumber,
	                accounttype: this.props.data.accounttype,
	                accountname: this.props.data.accountname,
	                isdefault: this.props.data.isdefault == 1 && 1 || 0
                },
                initialForm: {
                	bankname: this.props.data.bankname || '',
	                accountnumber: this.props.data.accountnumber,
	                accounttype: this.props.data.accounttype,
	                accountname: this.props.data.accountname,
	                isdefault: this.props.data.isdefault == 1 && 1 || 0
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
        handleFieldValueChange: (field, value) => this.handleFieldValueChange(
        											field,
        											value
        										),
        handlSubmit: (ev) => this.handlSubmit(ev),
        handleCancelPress: this.props.onCancel ? 
        					() => this.props.onCancel() :
        					null,
    })

    prps = () => ({
        form: this.state.form,
        disableSubmit: this.disableSubmit(),
        disabled: this.props.disabled || false,
        title: this.props.title,
        submitLabel: this.props.submitLabel,
        currentBusiness: this.props.currentBusiness
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
        return Object.assign({}, this.state.form, {
        	Receipt: this.state.selectedReceipt
        });
    }

    validationRules(){
        return {
            bankname: {
                required: Rules.required
            },
            accountname: {
                required: Rules.required,
            },
            accountnumber: {
                required: Rules.required,
                isNumeric: Rules.isNumeric,
            },
            accounttype: {
                required: Rules.required,
                isIn: value => Rules.isIn(
                	Object.keys(ACCOUNT_TYPES), 
                	value
                ),
            }
        }
    }

    validationMessages(){
        return {
            bankname: {
                required: 'Please enter a bank name.'
            },
            accountname: {
                required: 'Please enter an bank account name.',
            },
            accountnumber: {
                required: 'Please enter account number.',
                isNumeric: 'The account number is invalid.',
            },
            accounttype: {
                required: 'Please select account type.',
                isIn: 'Please select an account type from the list.',
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
                	let expenseDate = new Date(formData.Date);
                    this.props.onSubmit(Object.assign({}, {
                    	bankname: formData.bankname,
                    	accountname: formData.accountname,
                    	accountnumber: formData.accountnumber,
                    	accounttype: formData.accounttype,
                    	isdefault: formData.isdefault,
                    }));
                }
            }
        });
    }

    isUpdated(){
        const { data } = this.props;
        const { form, initialForm } = this.state; 
        
        if( data ){
            let dataForm = {
                bankname: data.bankname || '',
                accountname: data.accountname || '',
                accountnumber: data.accountnumber || '',
                accounttype: data.accounttype || '',
                isdefault: data.isdefault == 1 && 1 || 0,
            };
            return !isEqual(dataForm, form);
        }
        
        return !isEqual(initialForm, form);
    }

    reset(){
    	if(this.props.data){
    		return;
    	}
    	this.setState({
    		form: {
    			...this.state.initialForm
    		},
    		touched: []
    	})
    }
}

const mapStateToProps = ({
	userInfo
}) => ({
	userInfo: userInfo.data,
	currentBusiness: userInfo.data && 
					userInfo.data.business && 
					userInfo.data
						.business
						.find(
							item => item.id == userInfo.data.currentbusinessid
						)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
	showSnackbar: ActionCreators.showSnackbar
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)
					  (withRouter(BankInfoForm));