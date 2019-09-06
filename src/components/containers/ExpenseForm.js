import * as React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
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
import { EXPENSE_CATEGORIES, CURRENCIES_SIGNS } from '../../configs/data.config.js';
import { ActionCreators } from '../../data/actionCreators';
import { bindActionCreators } from 'redux';
import { DEBUG } from '../../configs/app.config';
import NumberFormat from 'react-number-format';
import moment from 'moment';
const logo = require('../../assets/logo.png');
const PAYMENT_OPTIONS = ['Cash', 'Online Payment', 'POS', 'Bank Transfer'];

function NumberFormatCustom(props) {
	const { inputRef, onChange, prefix, ...other } = props;

	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={values => {
				onChange({
					target: {
						value: values.value,
					},
				});
			}}
			thousandSeparator
			prefix={prefix || '$'}
		/>
	);
}

NumberFormatCustom.propTypes = {
	inputRef: propTypes.func.isRequired,
	onChange: propTypes.func.isRequired,
};

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
	currentBusiness,
	image,
	goBack,
}) => (
	<form className="w-full max-w-md" onSubmit={ev => fn.handlSubmit(ev)}>
		<div className="mb-8 md:mb-0 md:invisible">
			<NavLink className="expenses__create--cancel" to="/expenses">
				<span className="text-lg text-brand-blue font-bold">x</span>
			</NavLink>
			<span
				style={{ cursor: 'pointer' }}
				id="expenses__create--save"
				className="text-lg text-brand-blue font-bold float-right"
				onClick={ev => fn.handlSubmit(ev)}
			>
				Save
			</span>
		</div>
		<div className="mb-8 md:visible">
			<span className="text-lg text-brand-blue font-bold">{title}</span>
			<span className="text-lg text-brand-blue font-semibold uppercase float-right">
				{expensenumber}
				{/* {this.props.data.image} */}

				{/* <img src={image}/> */}
			</span>
		</div>
		<div className="flex flex-col md:flex-row">
			<div className="flex flex-wrap w-full md:w-2/3 md:mr-6">
				<div className="w-full mb-2 md:mb-0">
					<label className="block tracking-wide text-grey text-xs mb-2">Description</label>
					<Input
						size="sm"
						noIcon
						disabled={disabled}
						value={form.Description}
						onFocus={() => fn.handleFieldFocus('Description')}
						onBlur={() => fn.handleFieldBlur('Description')}
						variant={
							fn.fieldIsTouched('Description') &&
							fn.fieldHasError('Description') &&
							!fn.fieldIsFocused('Description')
								? 'danger'
								: 'default'
						}
						onChange={event => fn.handleFieldValueChange('Description', event.target.value)}
					/>
					{fn.fieldHasError('Description') &&
						!fn.fieldIsFocused('Description') &&
						fn.fieldIsTouched('Description') && (
							<Typography size="sm" variant="danger" className="mt0">
								{fn.fieldHasError('Description')}
							</Typography>
						)}
				</div>
				<div className="flex flex-wrap -mx-6 mb-2">
					<div className="w-full md:w-1/2 px-4 mb-2 md:mb-0">
						<label className="block tracking-wide text-grey text-xs mb-2">Category</label>
						<Select
							size="sm"
							options={EXPENSE_CATEGORIES}
							disabled={disabled}
							value={form.Category}
							onFocus={() => fn.handleFieldFocus('Category')}
							onBlur={() => fn.handleFieldBlur('Category')}
							variant={
								fn.fieldIsTouched('Category') &&
								fn.fieldHasError('Category') &&
								!fn.fieldIsFocused('Category')
									? 'danger'
									: 'default'
							}
							onChange={event => fn.handleFieldValueChange('Category', event.target.value)}
						/>
						{fn.fieldHasError('Category') &&
							!fn.fieldIsFocused('Category') &&
							fn.fieldIsTouched('Category') && (
								<Typography size="sm" variant="danger" className="mt0">
									{fn.fieldHasError('Category')}
								</Typography>
							)}
					</div>
					<div className="w-full md:w-1/2 px-4">
						<label className="block tracking-wide text-grey text-xs mb-2">Date</label>
						<Input
							size="sm"
							noIcon
							type="date"
							disabled={disabled}
							value={fn.convertExpenseDate(form.Date)}
							onFocus={() => fn.handleFieldFocus('Date')}
							onBlur={() => fn.handleFieldBlur('Date')}
							variant={
								fn.fieldIsTouched('Date') && fn.fieldHasError('Date') && !fn.fieldIsFocused('Date')
									? 'danger'
									: 'default'
							}
							onChange={value => fn.handleFieldValueChange('Date', value)}
						/>
						{fn.fieldHasError('Date') && !fn.fieldIsFocused('Date') && fn.fieldIsTouched('Date') && (
							<Typography size="sm" variant="danger" className="mt0">
								{fn.fieldHasError('Date')}
							</Typography>
						)}
					</div>
				</div>
				<div className="flex flex-wrap -mx-6 mb-2">
					<div className="w-full md:w-1/2 px-4 mb-2 md:mb-0">
						<label className="block tracking-wide text-grey text-xs mb-2">Vendor</label>
						<Input
							size="sm"
							noIcon
							disabled={disabled}
							value={form.Vendor}
							onFocus={() => fn.handleFieldFocus('Vendor')}
							onBlur={() => fn.handleFieldBlur('Vendor')}
							variant={
								fn.fieldIsTouched('Vendor') &&
								fn.fieldHasError('Vendor') &&
								!fn.fieldIsFocused('Vendor')
									? 'danger'
									: 'default'
							}
							onChange={event => fn.handleFieldValueChange('Vendor', event.target.value)}
						/>
						{fn.fieldHasError('Vendor') && !fn.fieldIsFocused('Vendor') && fn.fieldIsTouched('Vendor') && (
							<Typography size="sm" variant="danger" className="mt0">
								{fn.fieldHasError('Vendor')}
							</Typography>
						)}
					</div>
					<div className="w-full md:w-1/2 px-4">
						<label className="block tracking-wide text-grey text-xs mb-2">Paid with</label>
						<Select
							size="sm"
							options={PAYMENT_OPTIONS}
							disabled={disabled}
							value={form.PaidWith}
							onFocus={() => fn.handleFieldFocus('PaidWith')}
							onBlur={() => fn.handleFieldBlur('PaidWith')}
							variant={
								fn.fieldIsTouched('PaidWith') &&
								fn.fieldHasError('PaidWith') &&
								!fn.fieldIsFocused('PaidWith')
									? 'danger'
									: 'default'
							}
							onChange={event => fn.handleFieldValueChange('PaidWith', event.target.value)}
						/>
						{fn.fieldHasError('PaidWith') &&
							!fn.fieldIsFocused('PaidWith') &&
							fn.fieldIsTouched('PaidWith') && (
								<Typography size="sm" variant="danger" className="mt0">
									{fn.fieldHasError('PaidWith')}
								</Typography>
							)}
					</div>
				</div>
				<div className="w-full mb-2 md:mb-0">
					<label className="block tracking-wide text-grey text-xs mb-2">Total Amount</label>
					<Input
						size="sm"
						noIcon
						disabled={disabled}
						value={form.TotalAmount}
						onFocus={() => fn.handleFieldFocus('TotalAmount')}
						onBlur={() => fn.handleFieldBlur('TotalAmount')}
						variant={
							fn.fieldIsTouched('TotalAmount') &&
							fn.fieldHasError('TotalAmount') &&
							!fn.fieldIsFocused('TotalAmount')
								? 'danger'
								: 'default'
						}
						onChange={event => fn.handleFieldValueChange('TotalAmount', event.target.value)}
						component={props =>
							NumberFormatCustom({
								...props,
								prefix: currentBusiness ? CURRENCIES_SIGNS[currentBusiness.currency] : null,
							})
						}
					/>
					{fn.fieldHasError('TotalAmount') &&
						!fn.fieldIsFocused('TotalAmount') &&
						fn.fieldIsTouched('TotalAmount') && (
							<Typography size="sm" variant="danger" className="mt0">
								{fn.fieldHasError('TotalAmount')}
							</Typography>
						)}
				</div>
			</div>
			<div className="flex flex-wrap w-full md:w-1/3">
				<div className="receipt-selector">
					<label className="input-label">
						{selectedReceipt || currentReceipt ? 'Change Your Receipt' : 'Upload Your Receipt'}
					</label>
					<Dropzone
						classes={{
							container: 'mb-6 md:mb-18',
						}}
						imagespath={form.Image}
						selected={selectedReceipt || currentReceipt}
						cancelable={selectedReceipt ? true : false}
						onChange={fn.handleFileSelected}
						onCancel={fn.clearSelectedImage}
					/>

					<Button
						block
						variant="primary"
						size="sm"
						className="submit-button"
						type="submit"
						// disabled={disableSubmit}
					>
						{submitLabel}
					</Button>
				</div>
			</div>
		</div>
		{/* <div className='vc-expense-form-footer'>
        	<span className='powered-by'>Powered By</span>
			<img 
				src={logo} 
				className='brand'
				alt='logo'
			/>
        </div> */}
	</form>
);

class ExpenseForm extends FormComponent {
	static propTypes = {
		setRef: propTypes.func,
	};

	file = null;

	constructor() {
		super(null, {
			form: {
				Description: '',
				Category: EXPENSE_CATEGORIES[0],
				Date: '',
				Vendor: '',
				PaidWith: PAYMENT_OPTIONS[0],
				TotalAmount: '0',
				Image: '',
			},
			selectedReceipt: null,
			currentReceipt: null,
		});
	}

	componentDidMount() {
		if (typeof this.props.setRef == 'function') {
			this.props.setRef(this);
		}
		if (this.props.data) {
			this.setState({
				form: {
					Description: this.props.data.description || '',
					Category: this.props.data.category || '',
					Date: this.props.data.expensedate || '',
					Vendor: this.props.data.vendor || '',
					PaidWith: this.props.data.paidwith || '',
					TotalAmount: this.props.data.totalamount || '',
					Image: this.props.data.image,
				},
				currentReceipt: this.props.data.receiptimageurl || null,
			});
		}
	}

	componentWillUnmount() {
		if (typeof this.props.setRef == 'function') {
			this.props.setRef(undefined);
		}
	}

	renderMethod() {
		return <Template {...this.prps()} fn={this.fn()} />;
	}

	fn = () => ({
		// bound functions go here
		fieldHasError: field => this.fieldHasError(field),
		fieldIsTouched: field => this.fieldIsTouched(field),
		fieldIsFocused: field => this.fieldIsFocused(field),
		handleFieldBlur: field => this.handleFieldBlur(field),
		handleFieldFocus: field => this.handleFieldFocus(field),
		handleFieldValueChange: (field, value) => this.handleFieldValueChange(field, value),
		handlSubmit: ev => this.handlSubmit(ev),
		handleCancelPress: this.props.onCancel ? () => this.props.onCancel() : null,
		setImageSelector: ref => this.setImageSelector(ref),
		handleFileSelected: event => this.handleFileSelected(event),
		clearSelectedImage: () => this.clearSelectedImage(),
		convertExpenseDate: date => this.convertExpenseDate(date),
	});

	prps = () => ({
		form: this.state.form,
		disableSubmit: this.disableSubmit(),
		disabled: this.props.disabled || false,
		title: this.props.title,
		submitLabel: this.props.submitLabel,
		currentReceipt: this.state.currentReceipt,
		selectedReceipt: this.state.selectedReceipt,
		expensenumber: this.props.expenseNumber,
		currentBusiness: this.props.currentBusiness,
		image: this.props.image,
		goBack: this.props.history.push,
	});

	setImageSelector(ref) {
		this.imageSelector = ref;
	}

	handleFileSelected(event) {
		if (!event || !event.target || !event.target.files || event.target.files.length < 1) {
			this.clearSelectField();
			return;
		}

		// get the selected file
		let file = event.target.files[0];

		// cehck file type
		if (['image/png', 'image/jpg', 'image/jpeg'].indexOf(file.type) === -1) {
			this.clearSelectField();
			this.props.showSnackbar('Receipt must be jpeg or png in format.', {
				variant: 'warning',
			});
			return;
		}

		// cehck file size
		if (file.size / 1024 >= 1025) {
			this.clearSelectField();
			this.props.showSnackbar('Receipt image file size must be 1mb or less.', {
				variant: 'warning',
			});
			return;
		}

		// instantiate file reader
		let fr = new FileReader();

		// read selected file as data url
		fr.readAsDataURL(file);

		// handle when file conversion is successful
		fr.onload = event => {
			this.setState(
				{
					selectedReceipt: event.currentTarget.result,
				},
				() => {
					this.file = file;
					this.clearSelectField();
				}
			);
		};

		// handle when file conversion fails
		fr.onerror = error => {
			if (DEBUG) {
				console.error(error);
			}
			this.clearSelectField();
			this.props.showSnackbar('Unable to select file, please tray gain in a moment.', {
				variant: 'warning',
			});
		};
	}

	clearSelectField() {
		if (this.imageSelector) {
			this.imageSelector.value = '';
		}
	}

	clearSelectedImage() {
		this.setState(
			{
				selectedReceipt: '',
			},
			() => this.file == null
		);
	}

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
		return Object.assign({}, this.state.form, {
			Receipt: this.state.selectedReceipt,
		});
	}

	validationRules() {
		return {
			Description: {
				required: Rules.required,
			},
			Category: {
				required: Rules.required,
				isIn: value => Rules.isIn(EXPENSE_CATEGORIES, value),
			},
			Date: {
				required: Rules.required,
				isDate: Rules.isDate,
			},
			Vendor: {
				required: Rules.required,
			},
			PaidWith: {
				required: Rules.required,
				isIn: value => Rules.isIn(PAYMENT_OPTIONS, value),
			},
			TotalAmount: {
				required: Rules.required,
				isNumeric: Rules.isNumeric,
			},
			Receipt: {
				isBase64Image: value => Rules.sometimes(Rules.isBase64Image.bind(null, ['png', 'jpg', 'jpeg']), value),
			},
		};
	}

	validationMessages() {
		return {
			Description: {
				required: 'Please enter expense description.',
			},
			Category: {
				required: 'Please select a category.',
				isIn: 'Invalid category selected.',
			},
			Date: {
				required: 'Please select a date',
				isDate: 'Please enter a valid date E.g. 21/08/2018',
			},
			Vendor: {
				required: 'Please enter vendor.',
			},
			PaidWith: {
				required: 'Please select a payment method.',
				isIn: 'Invalid payment method selected.',
			},
			TotalAmount: {
				required: 'Please enter a total amount.',
				isNumeric: 'Total amount must be numeric.',
			},
			Receipt: {
				isBase64Image: 'Please select another image.',
			},
		};
	}

	handlSubmit(ev) {
		ev.preventDefault();
		let formData = this.state.form ? { ...this.state.form } : {};
		let fields = Object.keys(formData);
		if (fields.length < 1) {
			return;
		}
		this.setState(
			{
				touched: fields,
			},
			() => {
				if (this.formIsValid()) {
					if (typeof this.props.onSubmit == 'function') {
						let expenseDate = moment(formData.Date[0]).format('DD/MM/YYYY')
						
						this.props.onSubmit(
							Object.assign(
								{},
								{
									description: formData.Description,
									category: formData.Category,
									expensedate: expenseDate,
									vendor: formData.Vendor,
									paidwith: formData.PaidWith,
									totalamount: formData.TotalAmount,
									image: this.state.selectedReceipt
										? this.state.selectedReceipt.split(',')[1]
										: undefined, //this.state.selectedReceipt.split(',')[1] : undefined
								}
							)
						);
					}
				}
			}
		);
	}

	isUpdated() {
		const { data } = this.props;
		const { form, initialForm } = this.state;

		if (data) {
			let dataForm = {
				Description: data.description || '',
				Category: data.category || '',
				Date: data.expensedate || '',
				Vendor: data.vendor || '',
				PaidWith: data.paidwith || '',
				TotalAmount: data.totalamount || '',
				Receipt: data.receipt || null,
			};
			return !isEqual(dataForm, form);
		}

		return !isEqual(initialForm, form);
	}

	convertExpenseDate(expensedate) {
		let date = new Date(expensedate);
		if (date.getTime() === 'Invalid Date' || !date.getTime()) {
			return '';
		}
		return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
	}
}

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			showSnackbar: ActionCreators.showSnackbar,
		},
		dispatch
	);

export default connect(
	null,
	mapDispatchToProps
)(withRouter(ExpenseForm));
