import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import * as Rules from '../../helpers/Rules';
import Validator from '../../modules/Validator';
import OnboardingStep from './OnboardingStep';
import Typography from '../presentation/Typography';
import Chip from '../presentation/Chip';
import Select from '../presentation/Select';
import Checkbox from '../presentation/Checkbox';
import isEqual from 'lodash/isEqual';
import { GET_CURRENCIES } from '../../configs/api.config.js';

/**
 * component template
 */
let Template = ({ fn, validationData, validationRules, validationMessages, employeesize, currency, onlinepayment, currencyList }) => (
	<div className="onboarding-about-business">
		<Validator
			form={validationData}
			rules={validationRules}
			messages={validationMessages}
			onChange={state => fn.handleValidatorChange(state)}
		/>
		<div className="onboarding-business-card">
			<div className="content">
				<Typography align="center" size="lg" variant="active" className="spanned mt20 mb20">
					Tell us about your business
				</Typography>
				<Typography align="center" className="spanned mt0">
					Help us learn about your business to better serve you.
				</Typography>
			</div>
		</div>

		<div className="spanned mt80 employee-count mt-0">
			<div className="">
				<Typography size="sm" className="md:mt-6">
					What Is Your Team Size? (Includes Employees And Contractors)
				</Typography>
				<div className="spanned">
					<Chip
						checked={employeesize == 'Just Me'}
						label="Just Me"
						value="Just Me"
						className="mr8"
						onChange={event => event.target.checked && fn.handleFieldChange('employeesize', 'Just Me')}
					/>
					<Chip
						checked={employeesize == '2 - 4'}
						label="2 - 4"
						value="2 - 4"
						className="mr8"
						onChange={event => event.target.checked && fn.handleFieldChange('employeesize', '2 - 4')}
					/>
					<Chip
						checked={employeesize == '5 - 9'}
						label="5 - 9"
						value="5 - 9"
						className="mr8"
						onChange={event => event.target.checked && fn.handleFieldChange('employeesize', '5 - 9')}
					/>
					<br />
					<br />
					<Chip
						checked={employeesize == '10 - 19'}
						label="10 - 19"
						value="10 - 19"
						className="mr8"
						onChange={event => event.target.checked && fn.handleFieldChange('employeesize', '10 - 19')}
					/>
					<Chip
						checked={employeesize == '20+'}
						label="20+"
						value="20+"
						className="mr8"
						onChange={event => event.target.checked && fn.handleFieldChange('employeesize', '20+')}
					/>
				</div>
			</div>
			<div className="" style={{ maxWidth: 300 }}>
				<Typography size="sm" className="">
					Choose Your currency
				</Typography>
				<Select
					onChange={event => fn.handleFieldChange('currency', event.target.value)}
					size="sm"
					value={currency}
					options={Object.assign({"": "- Select currency -"}, currencyList)}
				/>
			</div>
			<div>
				<Typography size="sm" className="mt-2 md:mt-6">
					Do You Accept Online Payments(Eg. Paypal, Paystack, Flutterwave, etc.)
				</Typography>
				<Checkbox
					onChange={event => fn.handleFieldChange('onlinepayment', 1)}
					value={onlinepayment}
					label={'Yes'}
					checked={onlinepayment == 1}
					className="mr16"
				/>
				<Checkbox
					onChange={event => fn.handleFieldChange('onlinepayment', 0)}
					value={onlinepayment}
					label={'No'}
					checked={onlinepayment == 0}
				/>
			</div>
		</div>
	</div>
);

class OnboardingAboutBusiness extends OnboardingStep {
	static propTypes = {
		initialData: propTypes.oneOfType([propTypes.object]).isRequired,
		onSubmit: propTypes.func.isRequired,
		setRef: propTypes.func.isRequired,
		onValidityChange: propTypes.func.isRequired,
	};

	state = {
		initialized: false,
		employeesize: '',
		currency: '',
		onlinepayment: 1,
		validation: {
			fields: null,
			valid: false,
		},
		touched: [],
		focused: [],
		currencyList: {},
	};

	getCurrencies = () => {
		let currencies = {}
		GET_CURRENCIES()
			.then(res => {
				res.forEach(element => {
					var sign = element.substr(0, element.indexOf(' '))
					currencies[sign] = element
				});
				this.setState({
					currencyList: currencies
				});
			})
			.catch(err => {});
	};

	componentDidMount() {
		this.initialize(this.props.initialData);
		this.getCurrencies();
		this.props.setRef(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (!isEqual(prevProps.initialData, this.props.initialData)) {
			this.initialize(this.props.initialData);
		}
	}

	render() {
		if (!this.props.active || !this.state.initialized) {
			return null;
		}

		return <Template {...this.prps()} fn={this.fn()} />;
	}

	fn = () => ({
		handleValidatorChange: state => this.handleValidatorChange(state),
		handleFieldChange: (field, value) => this.handleFieldChange(field, value),
	});

	prps = () => ({
		validationRules: this.validationRules(),
		validationMessages: this.validationMessages(),
		validationData: this.validationData(),
		employeesize: this.state.employeesize,
		currency: this.state.currency,
		onlinepayment: this.state.onlinepayment,
		currencyList: this.state.currencyList
	});

	validationData() {
		return {
			employeesize: this.state.employeesize,
			currency: this.state.currency,
		};
	}

	validationRules() {
		return {
			employeesize: {
				required: Rules.required,
			},
			currency: {
				required: Rules.required,
				isIn: value => Rules.isIn(['usd', 'ngn'], value),
			},
		};
	}

	validationMessages() {
		return {
			employeesize: {
				required: 'Please select your company size.',
			},
			currency: {
				required: 'Please select your prefered currency.',
				isIn: 'Please select USD or NGN.',
			},
		};
	}

	submit() {
		if (!this.props.active || !this.isValid()) {
			return;
		}
		this.props.onSubmit({
			employeesize: this.state.employeesize,
			currency: this.state.currency,
			onlinepayment: this.state.onlinepayment,
		});
	}

	initialize(initialData) {
		this.setState({
			initialized: true,
			employeesize: initialData.employeesize || 'Just Me',
			currency: initialData.currency || 'ngn',
			onlinepayment: typeof initialData.onlinepayment == 'number' ? initialData.onlinepayment : 1,
		});
	}

	isValid() {
		return true;
	}
}

const mapStateToProps = state => ({
	// states go here
});

export default connect(mapStateToProps)(withRouter(OnboardingAboutBusiness));
