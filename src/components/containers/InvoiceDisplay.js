import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '../presentation/Button';
import Dropdown from '../presentation/Dropdown';
import { ADD_PAYMENT, FIND_INVOICE_ALT, GET_PAYMENTS } from '../../configs/api.config';
import { ActionCreators } from '../../data/actionCreators';
import moment from 'moment';
import PaymentAdd from '../containers/PaymentAdd';
import { thousand } from '../../helpers/Misc';
import { CURRENCIES_SIGNS } from '../../configs/data.config';
import queryString from 'query-string'
const logo = require('../../assets/logo.png');
/**
 * component template
 */

let Template = ({ currentBusiness, fn, invoiceData, paymentsData, showPaymentForm, paymenttype}) => {

	return (
		<div className=''>
		<div className='h-full mt-8 md:w-1/2 md:mx-auto md:border-1 md:border-brand-blue'>
			<div className='px-2'>
				{invoiceData.business &&
				<div className='flex flex-row mb-2 py-2 md:hidden'>
						<div className='flex flex-col w-1/2'>
						<img 
							src={invoiceData.business.logourl}
							className='w-16 ml-8'
						/>
						</div>
					<div className='w-1/2 text-right'>
						<div className='mb-8 leading-normal'>
							<p className='text-brand-blue font-semibold'>{ invoiceData.business.companyname }</p>
							<p className='text-black'>
								{ invoiceData.business.address }
							</p>
							<p className='text-black'>{invoiceData.business.phonenumber}</p>
						</div>
					</div>
				</div>
				}
				<div className='flex flex-row mb-2 py-4 md:hidden border-b-2 border-brand-blue'>

					{invoiceData.client &&
						<div className='flex flex-col w-1/2'>
							<div className="text-brand-blue font-semibold mb-4">
								Billed To
							</div>

							<div className='leading-normal'>
								<div className='text-black text-base'>{`${invoiceData.client.firstname || " "} ${invoiceData.client.lastname || " "}`}</div>
								<div className='text-brand-blue'>{invoiceData.client.companyemail}</div>
								<p>{invoiceData.client.phonenumber}</p>
							</div>
						</div>
					}

					<div className='w-1/2 text-right'>
						<div className='mb-8'>
							<p className='text-brand-blue font-semibold mb-1'>Invoice number</p>
							<span className='text-black'>
								{ invoiceData.invoicenumber }
							</span>
						</div>
						<div className='mb-8'>
							<p className='text-brand-blue font-semibold mb-1'>Date of Issue</p>
							<span className='text-black'>
								{moment(invoiceData.due_created).format('DD/MM/YYYY')}
							</span>
						</div>
						<div>
							<p className='text-brand-blue font-semibold mb-1'>Due Date</p>
							<span className='text-black'>
								{moment(invoiceData.due_date).format('DD/MM/YYYY')}
							</span>
						</div>
					</div>
				</div>
				<div className='flex flex-col'>
					<div className='flex flex-row w-full mb-4'>
						<div className='text-brand-blue font-semibold w-2/5'>Item</div>
						<div className='text-brand-blue font-semibold w-1/5 text-right'>Price</div>
						<div className='text-brand-blue font-semibold w-1/5 text-right'>Qty</div>
						<div className='text-brand-blue font-semibold w-1/5 text-right'>Amount</div>
						{/* <span className='text-brand-blue font-semibold'>Description</span> */}
						{/* <span className='float-right text-brand-blue font-semibold'>Total Amount</span> */}
					</div>
					{invoiceData.items && invoiceData.items.constructor == Array && invoiceData.items.map((item, index) => {
						return (
							<div className='flex flex-row w-full mb-4 text-black' key={index}>
								<div className='w-2/5'>{item.description}</div>
								<div className='w-1/5 text-right'>₦{item.price}</div>
								<div className='w-1/5 text-right'>{item.quantity}</div>
								<div className='w-1/5 text-right'>₦{thousand(parseInt(item.amount).toFixed(2))}</div>
							</div>
						)
					})}
				</div>

				<div className='flex flex-row mb-2'>
					<div className='w-1/4 md:w-1/2'>
					</div>
					<div className='w-3/4 md:w-1/2 text-black text-base text-right'>
						<div className='flex flex-row mb-3'>
							<div className='w-2/5'>Subtotal</div>
							<div className='w-3/5'>
								₦
								{thousand(parseInt(invoiceData.subtotal).toFixed(2))}
							</div>
						</div>
						{(invoiceData.discount > 0) &&
							<div className='flex flex-row mb-3'>
								<div className='w-2/5'>{invoiceData.discount}% Discount</div>
								<div className='w-3/5'>
									-₦
									{thousand(parseInt((invoiceData.subtotal / 100) * invoiceData.discount).toFixed(2))}
								</div>
							</div>
						}
						{(invoiceData.tax > 0) &&
							<div className='flex flex-row mb-3'>
								<div className='w-2/5'>{invoiceData.tax}% Tax</div>
								<div className='w-3/5'>
									₦
									{thousand(parseInt((invoiceData.tax / 100) * invoiceData.discount).toFixed(2))}
								</div>
							</div>
						}
						<div className='flex flex-row mb-3 py-3 border-t-2 border-brand-blue'>
							<div className='w-1/2 text-brand-blue font-semibold'>Amount Due (₦)</div>
							<div className='w-1/2'>
								₦
								{thousand(parseInt(invoiceData.amountdue).toFixed(2))}
							</div>
						</div>
						<div className={`flex flex-row mb-3`}>
							<span className={`w-1/2 font-semibold text-green`}>Amount Paid (₦)</span>
							<span className='w-1/2'>
								₦
								
								{thousand(parseInt(invoiceData.amountpaid || 0).toFixed(2))}
							</span>
						</div>
					</div>
				</div>
				{invoiceData.notes &&
					<div className='mb-8'>
						<p className='text-brand-blue font-semibold text-base mb-2'>Notes and Terms</p>
						<span className='text-black text-base'>
							{invoiceData.notes}
						</span>
					</div>
				}
				{invoiceData.accountname &&
					<div className='mb-8 text-brand-blue'>
						<p className='font-semibold text-base mb-3'>Payment Instructions</p>
						<p className='text-black mb-3'>Business Bank Account Details</p>
						<div className='leading-normal'>
							<p>Bank Name: {invoiceData.bankname}</p>
							<p>Account Number: {invoiceData.accountnumber}</p>
							<p>Account Name: {invoiceData.accountname}</p>
						</div>
					</div>
				}
				{/* <div className='mb-4'>
					<div>
						<p className='text-brand-blue font-semibold text-base mb-4'>Payment Instructions</p>
						<div className='mb-4'>
							<div className="text-black mb-2">Business Bank Account Details</div>
							<p className='text-brand-blue text-base'>Gtbank -Savings</p>
							<p className='text-brand-blue text-base'>Account Number - 0012238907</p>
						</div>
						<p className="text-black mb-2">Online Payment</p>
						<Button block size="md" variant="success">
							Pay Now
						</Button>
					</div>
				</div> */}
				<div className='border-t-2 border-brand-blue text-center py-2'>
					{/* <span className='text-black font-normal'>Powered by</span> */}
					<span className=''><img 
						src={logo}
						className='w-12'
					/>
					</span>
				</div>
			</div>
		</div>	
		</div>
	);
};
class InvoiceDisplay extends React.Component {
	state = {
		invoiceid: null,
		invoiceData: {},
		paymentsData: [],
		showPaymentForm: false,
		paymenttype: null,
		currentbusinessid: null,
		usertoken: null
	};

	componentDidMount() {
		const values = queryString.parse(this.props.location.search)
		this.setState({
			invoiceid: values.invoiceid,
			currentbusinessid: values.businessid,
			usertoken: values.token
		}, () => {
			this.fetch()
		})
	}

	fetch(){
		const { currentbusinessid, invoiceid, usertoken } = this.state
		
		FIND_INVOICE_ALT(currentbusinessid, invoiceid, usertoken).then((res) => {
            this.setState({
                invoiceData: res
            })
		})

		GET_PAYMENTS({businessId: currentbusinessid, invoiceid}).then((res) => {
            this.setState({
                paymentsData: res.payments
            })			
		})
	}

	render() {
		return (
			<Template
				{...this.prps()}
				fn={this.fn()}
			/>
		);
	}


	fn = () => ({
		goBack: () => this.props.history.goBack(),
		handleChange: e => {
			if (e.target.value === 'Full Payment') {
				this.setState({
					paymenttype: 'full',
					showPaymentForm: true
				})
			} else if (e.target.value === 'Partial Payment') {
				this.setState({
					paymenttype: 'partial',
					showPaymentForm: true
				})
			}
		},
		addPaymentClicked: this.addPaymentClicked,
        onPaymentDismissed: this.onPaymentDismissed,
        onSubmit: this.submitPaymentForm
	});

	prps = () => ({
        // template props go here
		invoiceData: this.state.invoiceData,
		paymentsData: this.state.paymentsData,
		showPaymentForm: this.state.showPaymentForm,
		paymenttype: this.state.paymenttype,
		currentBusiness: this.props.currentBusiness
	})
	
	addPaymentClicked = () => {
        this.setState({
            showPaymentForm: true
        })
    }

    onPaymentDismissed = () => {
        this.setState({
            showPaymentForm: false
        })
	}

	submitPaymentForm = (data) => {
		data.InvoiceId = this.state.invoiceData.id 

        ADD_PAYMENT(data).then((res) => {
			this.props.showSnackbar('Payment Added!', {variant: 'success'});
			this.setState({
				showPaymentForm: false
			})
			this.fetch()
        }).catch((err) => {
			this.props.showSnackbar('An error occured, please try again.', {variant: 'error'});
        })
    }

}

const mapStateToProps = ({ currentBusiness, userInfo }) => ({
	userInfo: userInfo.data,
	currentBusiness: currentBusiness.data
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
	showSnackbar: ActionCreators.showSnackbar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InvoiceDisplay));
