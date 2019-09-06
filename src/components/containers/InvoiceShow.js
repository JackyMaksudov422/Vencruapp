import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '../presentation/Button';
import Dropdown from '../presentation/Dropdown';
import { ADD_PAYMENT, CANCEL_INVOICE, FIND_INVOICE, GET_PAYMENTS } from '../../configs/api.config';
import { ActionCreators } from '../../data/actionCreators';
import moment from 'moment';
import PaymentAdd from '../containers/PaymentAdd';
import { thousand } from '../../helpers/Misc';
import { CURRENCIES_SIGNS } from '../../configs/data.config';
import { URL } from '../../configs/app.config';
import queryString from 'query-string'
import WhatsAppMsg from './WhatsAppMsg';
import InvoiceLayout from './InvoiceLayout';

/**
 * component template
 */

let Template = ({ currentBusiness, fn, invoiceData, paymentsData, showPaymentForm, paymenttype, showWhatsAppForm}) => {
	let totaloutstanding = invoiceData.amountdue - invoiceData.amountpaid || 0
	return (
		<div className='h-full mt-8 md:w-1/2 md:mx-auto'>
			{showWhatsAppForm && invoiceData.client &&
				<WhatsAppMsg
					phonenumber={invoiceData.client.phonenumber}
					message={`Hi ${invoiceData.client.firstname}, please find the link to your invoice here: ${encodeURI(URL + `/inv/?businessid=${currentBusiness.id}&invoiceid=${invoiceData.id}&token=${currentBusiness.ownerid}`)}`}
					onCancel={fn.onwhatsAppDismissed}
				/>
			}
			<div className='md:mb-4 py-2 md:py-0 text-brand-blue flex flex:col'>
				<div className='w-1/2'>
					<span><Link to="/sales"><i className='material-icons text-xs'>keyboard_arrow_left</i> Invoices</Link></span>
				</div>
				<div className='w-1/2 text-right font-bold'>
					Date of Issue <span className='text-black font-normal text-xs'>{moment(invoiceData.issue_date).format('DD/MM/YYYY')}</span>
				</div>
			</div>

			<div className='hidden md:flex mb-4 flex flex:col'>
				<div className='w-1/2 py-auto'>
					<span className='text-lg text-black'> { invoiceData.invoicenumber } </span>
				</div>
				<div className='w-1/2 text-right'>
					<span className='font-bold text-brand-blue text-xs mr-3 cursor-pointer' onClick={() => fn.handleAction('close')}>Close</span>
					<Button variant="success" type="button" size="sm" onClick={() => fn.handleAction('Edit')} className="pv13 ph20 py-3 mr-3">
						Edit
					</Button>
					<Dropdown
						variant="primary"
						type="button"
						size="sm"
						align="right"
						classes={{
							list: 'mt5'
						}}
						label={
							<span className="font-light text-white">Actions</span>
						}
						onChange={e => fn.handleAction(e.target.value)}
						options={['Record Payment', 'Cancel Invoice', 'Send via email', 'Send via WhatsApp']}
					/>
				</div>
			</div>
			
			<InvoiceLayout
				currentBusiness={currentBusiness}
				general={invoiceData}
				client={
					invoiceData.client
				}
				items={invoiceData.items}
				color='brand-blue'
				formatDates={true}
			/>
			
			<div className='flex flex-col mb-12'>
				<div className='px-2 mb-2'>
					<div className='text-lg text-black mb-3 px-2'>All Payments for invoice {invoiceData.invoicenumber}</div>
					
					{invoiceData && (totaloutstanding > 0) &&
						<Dropdown
							type="button"
							variant="link"
							size="sm"
							label={
								<span className='text-base font-light'><i className="icon ion-md-add-circle-outline text-green" /> Add Payment</span>
							}
							onChange={event => fn.handleChange(event)}
							options={['Full Payment', 'Partial Payment']}
						/>
					}
					{invoiceData && (totaloutstanding > 0) &&
						<PaymentAdd
							show={showPaymentForm}
							subtotal={totaloutstanding}
							deposit={(paymenttype === 'full') ? totaloutstanding : ''}
							onDismiss={fn.onPaymentDismissed}
							onCancel={fn.onPaymentDismissed}
							onSubmit={fn.onSubmit}
						/>
					}
				</div>
					<table className="w-full text-black table-collapse">
						<thead>
							<tr>
								<th className="text-sm font-semibold px-4 py-2 text-left">Basic Info</th> 
								<th className="text-sm font-semibold px-4 py-2 text-right">Payment Made</th>
							</tr>
						</thead>
						<tbody>
						{paymentsData &&
							paymentsData.constructor === Array &&
							paymentsData.map((item, index) => (
								<tr key={index}>
									<td className="p-4 border-t border-grey-light whitespace-no-wrap">
										<p className='mb-2'>{moment(item.date_paid).format('DD/MM/YYYY')}</p>
										<p className='text-grey'>{item.paidwith}</p>
									</td>
									<td className="p-4 border-t border-grey-light text-lg text-right text-brand-blue whitespace-pre">
										{CURRENCIES_SIGNS[currentBusiness.currency] || '$'}
										{thousand(parseInt(item.amount).toFixed(2))}
									</td>
								</tr>
							))
						}
						</tbody>
					</table>
				</div>
		</div>	
	);
};
class InvoiceShow extends React.Component {
	state = {
		invoiceid: null,
		invoiceData: {},
		paymentsData: [],
		showPaymentForm: false,
		paymenttype: null,
		showWhatsAppForm: false
	};

	componentDidMount() {
		const values = queryString.parse(this.props.location.search)
		this.setState({
			invoiceid: values.invoiceid
		}, () => {
			this.fetch()
		})

		// Display WhatsApp Form if enabled
		if((values.share) && values.share === 'whatsapp'){
			this.setState({
				showWhatsAppForm: true
			})
		}
	}

	fetch(){
		const { currentbusinessid } = this.props.userInfo
		const invoiceId = this.state.invoiceid;
		
		FIND_INVOICE(currentbusinessid, invoiceId).then((res) => {
            this.setState({
                invoiceData: res
            })
		})

		GET_PAYMENTS({businessId: currentbusinessid, invoiceId}).then((res) => {
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
		handleAction: e => this.handleAction(e),
		addPaymentClicked: this.addPaymentClicked,
		onPaymentDismissed: this.onPaymentDismissed,
		onwhatsAppDismissed: this.onwhatsAppDismissed,
        onSubmit: this.submitPaymentForm
	});

	prps = () => ({
        // template props go here
		invoiceData: this.state.invoiceData,
		paymentsData: this.state.paymentsData,
		showPaymentForm: this.state.showPaymentForm,
		paymenttype: this.state.paymenttype,
		showWhatsAppForm: this.state.showWhatsAppForm,
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

	onwhatsAppDismissed = () => {
		this.setState({
            showWhatsAppForm: false
        })
	}

	submitPaymentForm = (data) => {
		data.InvoiceId = this.state.invoiceData.id 

        ADD_PAYMENT(data).then((res) => {
			this.props.showSnackbar('Payment Added!', {variant: 'success'});
			this.setState({
				showPaymentForm: false
			}, () => {
				this.fetch()
			})
        }).catch((err) => {
			this.props.showSnackbar('An error occured, please try again.', {variant: 'error'});
        })
	}
	
	handleAction = (action) => {
		const invoiceId = this.state.invoiceid;
		switch (action) {
			case 'Edit':
				this.props.history.push(`/sales/${invoiceId}/edit`);
				break;
			case 'Record Payment':
				this.setState({
					showPaymentForm: true
				});
				break;
			case 'Cancel Invoice':
				this.promptCancelInvoice(invoiceId)
				break;
			case 'Send via WhatsApp':
				this.setState({
					showWhatsAppForm: true
				})
				break;
			case 'Send via email':
				break;
			case 'close':
				this.props.history.push(`/sales`);
				break;
			default:
				// do nothing
			break;
		}
	}

	promptCancelInvoice(invoiceId) {
		if (invoiceId && invoiceId.constructor === Array && invoiceId.length < 1) {
			return;
		}
		this.props.showAlertDialog(
			``,
			`Are you sure you want to cancel this invoice?`,
			[
				{ text: 'No', onClick: () => this.props.hideAlertDialog() },
				{ text: 'Yes, Cancel', onClick: () => this.cancelInvoice(invoiceId), variant: 'destructive' },
			]
		);
	}

	cancelInvoice = (invoiceId) => {
		let business = this.props.currentBusiness
		let payload = {
			invoiceid: invoiceId,
			businessid: business.id
		}
		CANCEL_INVOICE(payload)
			.then(() => {
				this.props.showSnackbar(`Invoice cancelled.`, { variant: 'success' });
				this.fetch()
			})
			.catch(error => {
				let errorMessage = `Failed to cancel invoice.`;
				this.props.showSnackbar(errorMessage, { variant: 'error' });
			})
	}

}

const mapStateToProps = ({ currentBusiness, userInfo }) => ({
	userInfo: userInfo.data,
	currentBusiness: currentBusiness.data
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
	showSnackbar: ActionCreators.showSnackbar,
	showAlertDialog: ActionCreators.showAlertDialog,
	hideAlertDialog: ActionCreators.hideAlertDialog
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InvoiceShow));
