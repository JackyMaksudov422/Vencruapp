import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes, { instanceOf } from 'prop-types';
import * as Rules from '../../helpers/Rules';
import Validator from '../../modules/Validator';
import OnboardingStep from './OnboardingStep';
import Typography from '../presentation/Typography';
import { INDUSTRIES } from '../../configs/data.config';
import Select from '../presentation/Select';
import isEqual from 'lodash/isEqual';
import { GET_OTHER_INDUSTRIES } from '../../configs/api.config.js';

/**
 * component template
 */
let Template = ({
	fn,
	validationData,
	validationRules,
	validationMessages,
	firstFourIndustries,
	industryNames,
	industry,
}) => (
	<div className="onboarding-about-industry">
		<Validator
			form={validationData}
			rules={validationRules}
			messages={validationMessages}
			onChange={state => fn.handleValidatorChange(state)}
		/>
		<div className="content">
			<Typography align="center" size="lg" variant="active" className="spanned md:mt-8 mb20">
				Tell us about your industry
			</Typography>
			<Typography align="center" className="spanned mt0">
				Choose your industry.
			</Typography>
			<div className="industries-container mb16">
				<div className="container-fluid">
					{firstFourIndustries.map((row, rowIndex) => {
						return (
							<div className="row" key={rowIndex}>
								{row.map((item, itemIndex) => {
									return (
										<div className="col-6 ph0" key={itemIndex}>
											<div className="spanned text-center">
												<button
													className={`industry-select-button ${(industry == item.name &&
														'selected') ||
														''}`}
													href="javascript"
													onClick={() => fn.handleFieldChange('industry', item.name)}
												>
													<img src={item.icon} className="industry-icon" alt="" />
													<Typography size="sm" align="center">
														{item.name}
													</Typography>
												</button>
											</div>
										</div>
									);
								})}
							</div>
						);
					})}
				</div>
			</div>

			<div className="spanned">
				<Select
					size="sm"
					variant="link-focused"
					value={industry}
					options={industryNames}
					showOptions={true}
					placeholder="Other industries"
					onChange={event => fn.handleFieldChange('industry', event.target.value)}
				/>
			</div>
		</div>
	</div>
);

class OnboardingAboutindustry extends OnboardingStep {
	static propTypes = {
		initialData: propTypes.oneOfType([propTypes.object]).isRequired,
		onSubmit: propTypes.func.isRequired,
		setRef: propTypes.func.isRequired,
		onValidityChange: propTypes.func.isRequired,
	};

	state = {
		initialized: false,
		industry: '',
		validation: {
			fields: null,
			valid: false,
		},
		touched: [],
		focused: [],
	};

	constructor() {
		super();
		this.industries = INDUSTRIES;
	}

	getIndustries = () => {
		this.setState({
			industries: [],
		});
		let icons = [
			'../../assets/planning.png',
			'../../assets/trade.png',
			'../../assets/fashion.png',
			'../../assets/IT.png',
		];

		let getLocalCacheImage = industry => {
			let [foundImage] = icons.filter(pngs => pngs.includes(industry));
			return foundImage.length > 1 && require(foundImage);
		};

		GET_OTHER_INDUSTRIES()
			.then(industries => {
				if (!industries) return Promise.reject();
				let parsedIndustries = industries.map(industry => {
					return {
						name: Object.keys(industry).length ? industry.name : industry,
						icon: industry.image || industry.icon || getLocalCacheImage(industry),
						services: ['Other'],
					};
				});
				this.industries.concat(parsedIndustries);
			})
			.catch(err => {});
	};

	componentDidMount() {
		this.initialize(this.props.initialData);
		this.getIndustries();
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
		industry: this.state.industry,
		industryNames: this.getindustryNames(this.industries),
		firstFourIndustries: this.getFirstFourIndustries(this.industries),
	});

	validationData() {
		return {
			industry: this.state.industry,
		};
	}

	validationRules() {
		return {
			industry: {
				required: Rules.required,
			},
		};
	}

	validationMessages() {
		return {
			industry: {
				required: 'Please enter your first name.',
			},
		};
	}

	submit() {
		if (!this.props.active || !this.isValid()) {
			return;
		}
		this.props.onSubmit({
			industry: this.state.industry,
		});
	}

	initialize(initialData) {
		this.setState({
			initialized: true,
			industry: initialData.industry || '',
		});
	}

	getFirstFourIndustries(industries) {
		console.log('bbb', industries)
		let firstFourIndustries = [...industries];
		firstFourIndustries.splice(4, firstFourIndustries.length - 4);
		let rowOne = [].concat([firstFourIndustries[0]], [firstFourIndustries[1]]);
		let rowTwo = [].concat([firstFourIndustries[2]], [firstFourIndustries[3]]);
		return [rowOne, rowTwo];
	}

	getindustryNames(industries) {
		let industryNames = [];
		for (var i = 0; i < industries.length; i++) {
			if (i < 4) {
				continue;
			}
			industryNames.push(industries[i]['name']);
		}
		return industryNames;
	}

	isValid() {
		return true;
	}
}

const mapStateToProps = state => ({
	// states go here
});

export default connect(mapStateToProps)(withRouter(OnboardingAboutindustry));
