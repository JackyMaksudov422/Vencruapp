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
let Template = ({ fn, form, disableSubmit, title, submitLabel, disabled }) => (
    <div className='vc-item-form'>
        <form onSubmit={(ev) => fn.handleSubmit(ev)}>
            <h1 className='title'>
                {title}
            </h1>
            <div className='form-fields'>
                <div className='form-fields-inner'>
                    <div className='row fields-row md:mb-4'>
                        <div className='col-md-6'>
                            <label className='input-label'>Stock Number</label>
                            <Input
                                size='sm'
                                noIcon
                                disabled={disabled}
                                value={form.stockNumber}
                                onFocus={() => fn.handleFieldFocus('stockNumber')}
                                onBlur={() => fn.handleFieldBlur('stockNumber')}
                                variant={fn.fieldIsTouched('stockNumber') && fn.fieldHasError('stockNumber') && !fn.fieldIsFocused('stockNumber') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('stockNumber', event.target.value)}
                            />
                            {
                                fn.fieldHasError('stockNumber') && !fn.fieldIsFocused('stockNumber') && fn.fieldIsTouched('stockNumber') &&
                                <Typography
                                    size='sm'
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('stockNumber')}</Typography>
                            }
                        </div>
                        <div className='col-md-6'>
                            <label className='input-label'>Item</label>
                            <Input
                                size='sm'
                                placeholder='E.g. Chocolate Cake'
                                noIcon
                                disabled={disabled}
                                value={form.productName}
                                onFocus={() => fn.handleFieldFocus('productName')}
                                onBlur={() => fn.handleFieldBlur('productName')}
                                variant={fn.fieldIsTouched('productName') && fn.fieldHasError('productName') && !fn.fieldIsFocused('productName') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('productName', event.target.value)}
                            />
                            {
                                fn.fieldHasError('productName') && !fn.fieldIsFocused('productName') && fn.fieldIsTouched('productName') &&
                                <Typography
                                    size='sm'
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('productName')}</Typography>
                            }
                        </div>
                    </div>
                    <div className='row fields-row md:mb-4'>
                        <div className='col-md-12'>
                            <label className='input-label'>Description</label>
                            <Input
                                size='sm'
                                noIcon
                                disabled={disabled}
                                value={form.description}
                                onFocus={() => fn.handleFieldFocus('description')}
                                onBlur={() => fn.handleFieldBlur('description')}
                                variant={fn.fieldIsTouched('description') && fn.fieldHasError('description') && !fn.fieldIsFocused('description') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('description', event.target.value)}
                            />
                            {
                                fn.fieldHasError('description') && !fn.fieldIsFocused('description') && fn.fieldIsTouched('description') &&
                                <Typography
                                    size='sm'
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('description')}</Typography>
                            }
                        </div>
                    </div>
                    <div className='row fields-row'>
                        <div className='col-md-6'>
                            <label className='input-label'>Unit Price</label>
                            <Input
                                size='sm'
                                noIcon
                                disabled={disabled}
                                value={form.unitPrice}
                                onFocus={() => fn.handleFieldFocus('unitPrice')}
                                onBlur={() => fn.handleFieldBlur('unitPrice')}
                                variant={fn.fieldIsTouched('unitPrice') && fn.fieldHasError('unitPrice') && !fn.fieldIsFocused('unitPrice') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('unitPrice', event.target.value)}
                            />
                            {
                                fn.fieldHasError('unitPrice') && !fn.fieldIsFocused('unitPrice') && fn.fieldIsTouched('unitPrice') &&
                                <Typography
                                    size='sm'
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('unitPrice')}</Typography>
                            }
                        </div>
                        <div className='col-md-6 mb-4 md:mb-0'>
                            <label className='input-label'>Unit Cost</label>
                            <Input
                                size='sm'
                                noIcon
                                disabled={disabled}
                                value={form.costOfItem}
                                onFocus={() => fn.handleFieldFocus('costOfItem')}
                                onBlur={() => fn.handleFieldBlur('costOfItem')}
                                variant={fn.fieldIsTouched('costOfItem') && fn.fieldHasError('costOfItem') && !fn.fieldIsFocused('costOfItem') ? 'danger' : 'default'}
                                onChange={(event) => fn.handleFieldValueChange('costOfItem', event.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='spanned'>
                <div className='row'>
                    {typeof fn.handleCancelPress == 'function' &&
                        <div className='col-sm-6 text-right'>
                            <Button
                                variant='link-gray'
                                type='button'
                                className='cancel-button'
                                onClick={() => fn.handleCancelPress()}
                            >
                                Cancel
                            </Button>
                        </div>
                    }
                    <div className={`${typeof fn.handleCancelPress == 'function' && 'col-sm-6 text-left' || 'col-sm-12 text-center'}`}>
                        <Button /*disabled={disableSubmit}*/ variant='primary' className='submit-button'>{submitLabel}</Button>
                     
                    </div>
                </div>
            </div>
        </form>
    </div >
);

class CreateItem extends FormComponent {

    static propTypes = {
        setRef: propTypes.func
    }

    constructor() {
        super(null, {
            form: {
                stockNumber: '',
                productName: '',
                description: '',
                unitPrice: '',
                costOfItem: '',
            }
        });
    }

    componentDidMount() {
        if (typeof this.props.setRef == 'function') {
            this.props.setRef(this);
        }
        if (this.props.data) {
            this.setState({
                form: {
                    stockNumber: this.props.data.stocknumber || '',
                    productName: this.props.data.productname || '',
                    description: this.props.data.description || '',
                    unitPrice: this.props.data.unitprice || '',
                    costOfItem: this.props.data.costofitem || '',
                }
            })
        }
    }

    componentWillUnmount() {
        if (typeof this.props.setRef == 'function') {
            this.props.setRef(undefined);
        }
    }

    renderMethod() {
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
        handleSubmit: (ev) => this.handleSubmit(ev),
        handleCancelPress: this.props.onCancel ? () => this.props.onCancel() : null
    })

    prps = () => ({
        form: this.state.form,
        disableSubmit: this.disableSubmit(),
        disabled: this.props.disabled || false,
        title: this.props.title,
        submitLabel: this.props.submitLabel
    })

    disableSubmit() {
        if (!this.formIsValid()) {
            return true;
        }
        if (this.props.disabled) {
            return true;
        }
        return false;
    }

    validationData() {
        return Object.assign({}, this.state.form);
    }

    validationRules() {
        return {
            stockNumber: {
                required: Rules.required
            },
            productName: {
                required: Rules.required
            },
            unitPrice: {
                required: Rules.required,
                numeric: Rules.isNumeric,
            }
        }
    }

    validationMessages() {
        return {
            stockNumber: {
                required: 'Please enter item stock number.'
            },
            productName: {
                required: 'Please enter item name.'
            },
            unitPrice: {
                required: 'Please enter item unit price.',
                numeric: 'Unit price must be a number.',
            }
        }
    }

    handleSubmit(ev) {
        ev.preventDefault();
        let formData = this.state.form && { ...this.state.form } || {};        
        let fields = Object.keys(formData);
        if (fields.length < 1) {
            return;
        }
        this.setState({
            touched: fields
        }, () => {
            if (this.formIsValid()) {
                if (typeof this.props.onSubmit == 'function') {
                    this.props.onSubmit({
                        stocknumber: formData.stockNumber,
                        productname: formData.productName,
                        description: formData.description,
                        unitprice: formData.unitPrice,
                        costofitem: formData.costOfItem
                    });
                }
            }
        });
    }

    isUpdated() {
        const { data } = this.props;
        const { form, initialForm } = this.state;

        if (data) {
            let dataForm = {
                stockNumber: data.stocknumber || '',
                productName: data.productname || '',
                description: data.description || '',
                unitPrice: data.unitprice || '',
                costOfItem: data.costofitem || '',
            };
            return !isEqual(dataForm, form);
        }

        return !isEqual(initialForm, form);
    }
}

export default connect()(withRouter(CreateItem));