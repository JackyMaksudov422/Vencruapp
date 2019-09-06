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
const goals_green = require('../../assets/goals_green.png');

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
	<div>
		<div className='text-center mb-6'>
			<img className='w-16' src={goals_green} />
		</div>
		<div className='text-brand-blue text-center text-xl mb-3'>
			Set your business goals
		</div>
		<p className='mb-12 text-center text-grey italic'>Setting your business goals will motivate you to achieve them</p>
		<form className="w-full"  onSubmit={ev => fn.handleSubmit(ev)}>
			<div className='text-black'>
				<div className='mb-16'>
					<div className='mb-2'> I will like to grow my current business revenue to</div>
					<div className={`flex items-center border-b border-b-2 ${fn.fieldHasError('TargetRevenue') ? 'border-red' : 'border-black'} py-2`}>
						{CURRENCIES_SIGNS[currentBusiness.currency]}
						<input 
							className="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none" 
							type="text"
							value={form.TargetRevenue}
							onChange={event => fn.handleFieldValueChange('TargetRevenue', event.target.value)}
						/>
						monthly.
					</div>
				</div>
				<div className='mb-8'>
					<div className='mb-2'> My current business revenue is</div>
					<div className={`flex items-center border-b border-b-2 ${fn.fieldHasError('CurrentRevenue') ? 'border-red' : 'border-black'} py-2`}>
						{CURRENCIES_SIGNS[currentBusiness.currency]}
						<input 
							className="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none" 
							type="text"
							value={form.CurrentRevenue}
							onChange={event => fn.handleFieldValueChange('CurrentRevenue', event.target.value)} />
						monthly.
					</div>
				</div>
				<Button
					block
					variant="primary"
					size="sm"
					className="submit-button"
					type="submit"
				>
					Continue
				</Button>
			</div>
		</form>
	</div>
);

class BusinessGoalForm extends FormComponent {
	static propTypes = {
		setRef: propTypes.func,
	};

	constructor() {
		super(null, {
			form: {
				TargetRevenue: '',
				CurrentRevenue: ''
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
					TargetRevenue: this.props.data.targetrevenue || '',
					CurrentRevenue: this.props.data.currentrevenue || ''
				}
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
		handleSubmit: ev => this.handleSubmit(ev),
		handleCancelPress: this.props.onCancel ? () => this.props.onCancel() : null
	});

	prps = () => ({
		form: this.state.form,
		disableSubmit: this.disableSubmit(),
		disabled: this.props.disabled || false,
		currentBusiness: this.props.currentBusiness,
		goBack: this.props.history.push,
	});

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
		return Object.assign({}, this.state.form, {});
	}

	validationRules() {
		return {
			TargetRevenue: {
				required: Rules.required,
				isNumeric: Rules.isNumeric,
			},
			CurrentRevenue: {
				required: Rules.required,
				isNumeric: Rules.isNumeric,
			}
		};
	}

	validationMessages() {
		return {
			TargetRevenue: {
				required: 'Please enter your target revenue.',
				isNumeric: 'Target revenue must be numeric.',
			},
			CurrentRevenue: {
				required: 'Please enter your current revenue.',
				isNumeric: 'Current revenue must be numeric.',			
			}
		};
	}

	handleSubmit(ev) {
		ev.preventDefault();
		const { currentBusiness } = this.props
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
						this.props.onSubmit(
							Object.assign(
								{},
								{
									businessId: currentBusiness.id,
									targetRevenue: formData.TargetRevenue,
									currentRevenue: formData.CurrentRevenue
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
				TargetRevenue: data.targetrevenue || '',
				CurrentRevenue: data.currentrevenue || ''
			};
			return !isEqual(dataForm, form);
		}

		return !isEqual(initialForm, form);
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
)(withRouter(BusinessGoalForm));
