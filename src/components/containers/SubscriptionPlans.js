import * as React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import FormComponent from './FormComponent';
import Button from '../presentation/Button';
import Typography from '../presentation/Typography';
import propTypes from 'prop-types';
import { ActionCreators } from '../../data/actionCreators';
import { bindActionCreators } from 'redux';
import { PAYSTACK_KEY, PAYSTACK_STARTER_PLAN, PAYSTACK_GROWTH_PLAN } from '../../configs/app.config';
import { GET_PLANS, ADD_SUBSCRIPTION } from '../../configs/api.config'
import { thousand } from '../../helpers/Misc';

const employeeIcon = require('../../assets/employee.png');
const employeesIcon = require('../../assets/employees.png');
const factoryIcon = require('../../assets/factory.png');

const PLANS = [
	{
		name: 'Starter',
		slug: 'starter',
		code: PAYSTACK_STARTER_PLAN,
		description: 'Good for solo users',
		price: 3840,
		icon: employeeIcon,
		info: [
			'1 user',
			'50 organized clients information',
			'Simplified business report',
			'Unlimited invoicing',
			'Expense tracking',
			'Inventory management',
			'Members-only training resources',
		]
	},
	{
		name: 'Growth',
		slug: 'growth',
		code: PAYSTACK_GROWTH_PLAN,
		description: 'Great for businesses with growing teams',
		price: 5800,
		icon: employeesIcon,
		info: [
			'3 users (Business Owner, Manager and Staff)',
			'250 organized clients information',
			'Comprehensive business report',
			'Unlimited invoicing',
			'Expense tracking',
			'Inventory management',
			'Members-only training resources',
			'Annual business coaching',
			'Quarterly audit log report'
		]
	}
]
/**
 * component template
 */
let Template = ({
	fn,
	form,
	title,
	submitLabel,
	disabled,
	currentReceipt,
	selectedReceipt,
	expensenumber,
	currentBusiness,
	image,
	goBack,
	paymentMode,
	selectedPlan
}) => (
	<div>
		{!paymentMode &&
			<div id='subscribe-info'>
				<div className='text-brand-blue text-center text-xl font-semibold mb-6'>
					Upgrade your account to enjoy the benefits of your business manager
				</div>
				<div className="flex flex-col md:flex-row text-black text-center">
					<div className="w-full md:w-1/3 lg:w-1/3 flex flex-col border-1 border-grey cursor-pointer py-2 px-3 mb-3 md:mb-0">
						<div className='border-b border-grey'>
							<h2 className='text-brand-blue text-lg mb-2'>Starter</h2>
							<p className='text-grey text-xs font-normal mb-3'>Good for solo users</p>
							<img src={employeeIcon} className="w-8 mb-3" />
						</div>
						<div className='py-3'>
							<p className='font-semibold text-2xl mb-1'>₦3,840</p>
							<p className='text-grey text-xs font-normal mb-2'>per month</p>
						</div>
						<div className='text-xs text-left leading-loose'>
							<p><span className='font-semibold'>1</span> user</p>
							<p><span className='font-semibold'>50</span> organized clients information</p>
							<p><span className='font-semibold'>Simplified</span> business report</p>
							<p><span className='font-semibold'>Unlimited</span> invoicing</p>
							<p><span className='font-semibold'>Expense</span> tracking</p>
							<p><span className='font-semibold'>Inventory</span> management</p>
							<p><span className='font-semibold'>Members-only</span> training resources</p>
							<div className='text-center'>
								<Button
									className='mt-4'
									variant='primary'
									type='submit'
									onClick={() => fn.handleSubscription('starter')}
								> Select
								</Button>
							</div>
						</div>
					</div>
					<div className="w-full md:w-1/3 lg:w-1/3 flex flex-col border-1 border-grey cursor-pointer py-2 px-3 mb-3 md:mb-0">
						<div className='border-b border-grey'>
							<h2 className='text-brand-blue text-lg mb-2'>Growth</h2>
							<p className='text-grey text-xs font-normal mb-3'>Great for businesses with growing teams</p>
							<img src={employeesIcon} className="w-8 mb-3" />
						</div>
						<div className='py-3'>
							<p className='font-semibold text-2xl mb-1'>₦5,800</p>
							<p className='text-grey text-xs font-normal mb-2'>per month</p>
						</div>
						<div className='text-xs text-left leading-loose'>
							<p><span className='font-semibold'>3</span> users (Business Owner, Manager and Staff)</p>
							<p><span className='font-semibold'>250</span> organized clients information</p>
							<p><span className='font-semibold'>Comprehensive</span> business report</p>
							<p><span className='font-semibold'>Unlimited</span> invoicing</p>
							<p><span className='font-semibold'>Expense</span> tracking</p>
							<p><span className='font-semibold'>Inventory</span> management</p>
							<p><span className='font-semibold'>Members-only</span> training resources</p>
							<p><span className='font-semibold'>Annual</span> business coaching</p>
							<p><span className='font-semibold'>Quarterly</span> audit log report</p>
							<div className='text-center'>
								<Button
									className='mt-4'
									variant='primary'
									type='submit'
									onClick={() => fn.handleSubscription('growth')}
								> Select
								</Button>
							</div>
						</div>
					</div>
					<div className="w-full md:w-1/3 lg:w-1/3 flex flex-col border-1 border-grey cursor-pointer py-2 px-3 mb-3 md:mb-0">
						<div className='border-b border-grey'>
							<h2 className='text-brand-blue text-lg mb-2'>Enterprise</h2>
							<p className='text-grey text-xs font-normal mb-3'>Best for Large Companies</p>
							<img src={factoryIcon} className="w-12 mb-3" />
						</div>
						<div className='py-3 mb-6'>
							<p className='font-semibold text-2xl mb-1'>Let's talk</p>
						</div>
						<div className='text-xs text-left leading-loose'>
							<p><span className='font-semibold'>Unlimited</span> users</p>
							<p><span className='font-semibold'>Unlimited</span> organized clients information</p>
							<p><span className='font-semibold'>Comprehensive</span> business report</p>
							<p><span className='font-semibold'>Unlimited</span> invoicing</p>
							<p><span className='font-semibold'>Expense</span> tracking</p>
							<p><span className='font-semibold'>Inventory</span> management</p>
							<p><span className='font-semibold'>Members-only</span> training resources</p>
							<p><span className='font-semibold'>Quarterly</span> business coaching</p>
							<p><span className='font-semibold'>Monthly</span> audit log report</p>
							<p><span className='font-semibold'>Customized</span> business feature services</p>
							<p><span className='font-semibold'>Dedicated</span> software support team</p>
						</div>
					</div>
				</div>
			</div>
		}

		{paymentMode && selectedPlan &&
			<div id='pay-screen'>
				<div className='text-brand-blue text-center text-xl font-semibold mb-6'>
					Congratulations! You are on your way to managing your business better!
				</div>
				<div className="flex flex-col md:flex-row lg:flex-row text-black text-center">
					<div className="w-full md:w-2/3 lg:w-2/3 flex flex-col border-1 border-grey cursor-pointer py-2 px-3 mb-3 md:mb-0">
						<div className='border-b border-grey'>
							<h2 className='text-brand-blue text-lg mb-2'>{selectedPlan.name}</h2>
							<p className='text-grey text-xs font-normal mb-3'>{selectedPlan.description}</p>
							<img src={employeeIcon} className="w-8 mb-3" />
						</div>
						<div className='py-3'>
							<p className='font-semibold text-2xl mb-1'>₦{thousand(parseInt(selectedPlan.price))}</p>
							<p className='text-grey text-xs font-normal mb-2'>per month</p>
						</div>
						<div className='text-xs text-left leading-loose'>
							{selectedPlan.info &&
								selectedPlan.info.constructor === Array &&
								selectedPlan.info.map((item, index) => (

								<p key={index}><span className='font-semibold'>{item.substr(0, item.indexOf(" "))}</span> {item.split(' ').slice(1).join(' ')}</p>

							))}
						</div>
					</div>
					<div className="w-full md:w-2/3 lg:w-2/3 flex flex-col py-2 px-3">
						<div class="md:mt-24 lg:mt-24">
							<p className='mb-3'>To proceed to make payment, click the button below.</p>
							<Button
								variant='success'
								type='submit'
								onClick={() => fn.payWithPaystack(selectedPlan.slug)}
							> <i class="fas fa-lock"></i> Pay via paystack
							</Button>
							<Button
								variant='link-gray'
								type='submit'
								size='sm'
								onClick={() => fn.disablePaymentMode()}
							> Cancel
							</Button>
						</div>
					</div>
				</div>
			</div>
		}
	</div>
);

class SubscriptionPlans extends FormComponent {
	static propTypes = {
		setRef: propTypes.func,
	};

	state = {
		paymentMode: false,
		selectedPlan: null
	}

	constructor() {
		super(null, {
		});
	}

	componentDidMount() {
		if (typeof this.props.setRef == 'function') {
			this.props.setRef(this);
		}
		// this.fetch()
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
		handleCancelPress: this.props.onCancel ? () => this.props.onCancel() : null,
		handleSubscription: type => this.handleSubscription(type),
		payWithPaystack: planslug => this.payWithPaystack(planslug),
		disablePaymentMode: () => this.disablePaymentMode()
	});

	prps = () => ({
		form: this.state.form,
		disabled: this.props.disabled || false,
		currentBusiness: this.props.currentBusiness,
		goBack: this.props.history.push,
		paymentMode: this.state.paymentMode,
		selectedPlan: this.state.selectedPlan
	});

	fetch(){
		// GET_PLANS().then((res) => {
		// 	console.log(res)
        // })
	}

	handleSubscription(type){
		let plan = (type === 'growth') ? PAYSTACK_GROWTH_PLAN : PAYSTACK_STARTER_PLAN;
		let selectedPlan = PLANS.find(obj => {
			return obj.slug === type
		})

		if(plan){
			this.setState({
				paymentMode: true,
				selectedPlan: selectedPlan
			}, () => {
				// this.payWithPaystack(plan)
			})
		}
		return
	}

	payWithPaystack(plan) {
		let paystackPlan = (plan === 'growth') ? PAYSTACK_GROWTH_PLAN : PAYSTACK_STARTER_PLAN;
		const { userInfo } = this.props
		let tx_ref = '' + Math.floor((Math.random() * 1000000000) + 1)
		var config = {
			key: PAYSTACK_KEY,
			email: userInfo.email,
			firstname: userInfo.firstname,
			lastname: userInfo.lastname,
			ref: tx_ref, // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
			plan: paystackPlan,
			onClose: function(){

			},
			callback: function(response){
				window.location.href = "/";
			}
		}
		let data = {
			UserId: userInfo.userid,
			BusinessId: userInfo.business[0].id,
			PlanCode: plan,
			PromoCode: "",
			TransactionReference: tx_ref
		}
		
		ADD_SUBSCRIPTION(data).then((res) => {
			var paystackPopup = window.PaystackPop.setup(config);
			paystackPopup.openIframe();
		})
		// window.PaystackPop.setup(config);
	}

	disablePaymentMode(){
		this.setState({
			paymentMode: false,
			selectedPlan: null
		})
	}

}

const mapStateToProps = ({ currentBusiness, userInfo }) => ({
	userInfo: userInfo.data,
	currentBusiness: currentBusiness.data
});

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			showSnackbar: ActionCreators.showSnackbar
		},
		dispatch
	);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(SubscriptionPlans));
