import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import InvoicePaper from './InvoicePaper';
import PageDialog from '../presentation/PageDialogs';
import Button from '../presentation/Button';
import { GET_NEW_INVOICE_NUMBER, CREATE_INVOICE } from '../../configs/api.config';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import InvoicePaperEditor from './InvoicePaperEditor';
import InvoicePaperEditorMobile from './InvoicePaperEditorMobile';
import { URL } from '../../configs/app.config';
import EmailMsg from './EmailMsg';
import WhatsAppMsg from './WhatsAppMsg';

class InvoiceCreate extends React.Component {
	state = {
		isGeneratingNumber: false,
		invoiceNumberError: null,
		invoiceNumber: '',
		invoiceInfo: {},
		client: 0,
		shareViaWhatsAppDialog: false,
		whatsAppMsgData: {
			phoneNumber: '',
			message: ''
		},
		emailMsgData: {
			email: ''
		},
		shareViaEmailDialog: false,
		showCustomizeDialog: false
	};

	componentDidMount() {
		this.generateInvoiceNumber();
		const client = this.props.match.params.clientId;
		if (client) {
			this.setState({
				client: JSON.parse(client),
			});
		}
	}

	render() {
		const { currentBusiness, userInfo, history } = this.props;
		const { invoiceNumberError, isGeneratingNumber, invoiceNumber, invoiceInfo, client, showCustomizeDialog, shareViaEmailDialog, emailMsgData, shareViaWhatsAppDialog, whatsAppMsgData } = this.state;
		return (
			<div>
				<div className=''>
					{currentBusiness && userInfo && (
						<InvoicePaper
							image={currentBusiness && currentBusiness.logourl}
							mode="write"
							invoiceNumber={invoiceNumber}
							// themeColor={invoiceInfo.themeColor}
							// fontStyle={invoiceInfo.fontStyle}
							// template={invoiceInfo.template}
							currency={currentBusiness ? currentBusiness.currency : ''}
							onCancel={() => history.push('/sales')}
							onPaymentChange={data => this.handlePaymentChange(data)}
							onSave={this.onSave}
							bankAccount={invoiceInfo.bankAccount}
							sender={{
								name: currentBusiness ? currentBusiness.companyname : '',
								address: this.getBusinessFullAddress(),
								email: userInfo ? userInfo.email : '',
								phoneNumber: currentBusiness ? currentBusiness.phonenumber : undefined,
							}}
							client={client || 0}
						/>
					)}
				</div>
				{/* <div className="hidden md:block col-md-4 full-height pl0">
					<InvoicePaperEditor
						bankAccount={invoiceInfo.bankAccount}
						onCustomizeChange={data => this.handleCustomizationChange(data)}
						onPaymentChange={data => this.handlePaymentChange(data)}
					/>
				</div> */}
			</div>
		);
		return (
			<div className="full-height">
				<PageDialog size="sm" backdropClose={false} escClose={false} show={!invoiceNumber}>
					{isGeneratingNumber ? (
						<div className="spanned text-center">
							<CircularProgress color="primary" />
						</div>
					) : (
						<React.Fragment>
							{invoiceNumberError && (
								<h1
									className=" invoice-text
        								text-center
        								mb5 normal-font
        							"
								>
									{' '}
									Whoops! An error occured.
								</h1>
							)}
							{invoiceNumberError && <h4 className="text-gray text-center mt0">{invoiceNumberError}</h4>}
							{invoiceNumberError && (
								<div className="spanned text-center">
									<Button
										className="invoice-button"
										variant="primary"
										size="sm"
										onClick={() => this.generateInvoiceNumber()}
									>
										Try Again
									</Button>
								</div>
							)}
						</React.Fragment>
					)}
				</PageDialog>

				<div className="spanned full-height">
					<div className="row full-height">
						<div className="col-md-8 full-height pr0">
							{currentBusiness && userInfo && (
								<InvoicePaper
									image={currentBusiness && currentBusiness.logourl}
									mode="write"
									invoiceNumber={invoiceNumber}
									themeColor={invoiceInfo.themeColor}
									fontStyle={invoiceInfo.fontStyle}
									template={invoiceInfo.template}
									currency={currentBusiness ? currentBusiness.currency : ''}
									onCancel={() => history.goBack()}
									onPaymentChange={data => this.handlePaymentChange(data)}
									onSave={this.onSave}
									bankAccount={invoiceInfo.bankAccount}
									sender={{
										name: currentBusiness ? currentBusiness.companyname : '',
										address: this.getBusinessFullAddress(),
										email: userInfo ? userInfo.email : '',
										phoneNumber: currentBusiness ? currentBusiness.phonenumber : undefined,
									}}
									client={client || 0}
								/>
							)}
						</div>
						<div className="col-md-4 full-height pl0">
							<InvoicePaperEditor
								bankAccount={invoiceInfo.bankAccount}
								onCustomizeChange={data => this.handleCustomizationChange(data)}
								onPaymentChange={data => this.handlePaymentChange(data)}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}

	onSave = (data) => {
		CREATE_INVOICE(data)
			.then(res => {
				this.props.showSnackbar('Invoice has been created!',{
					variant: 'success'
				});
				// redirect to a page
				if(res.sendstyle === 'whatsapp'){
					return this.props.history.replace('/sales/i/?invoiceid='+res.id+'&share=whatsapp')
				}
				else return this.props.history.replace('/sales');
			})
			.catch(err => {
				this.props.showSnackbar('An error occured while sending this request. Please try again.',{
					variant: 'error'
				});
			});
	};

	handleCustomizationChange(data) {
		this.setState(state => ({
			invoiceInfo: Object.assign({}, state.invoiceInfo, data),
		}));
	}

	handlePaymentChange(data) {
		this.setState(state => ({
			invoiceInfo: Object.assign({}, state.invoiceInfo, data),
		}));
	}

	getBusinessFullAddress() {
		const { currentBusiness } = this.props;
		if (!currentBusiness) {
			return '';
		}
		return (
			<span>
				{currentBusiness.address}
				{`, `}
				{currentBusiness.state ? currentBusiness.state + ', ' : ' '}
				{currentBusiness.country}
				{`.`}
			</span>
		);
	}

	generateInvoiceNumber() {
		if (!this.props.currentBusiness) {
			return;
		}
		this.setState(
			{
				isGeneratingNumber: true,
				invoiceNumberError: null,
			},
			() => {
				setTimeout(() => {
					GET_NEW_INVOICE_NUMBER(this.props.currentBusiness.id)
						.then(data => {
							this.setState({
								invoiceNumber: data.invoicenumber,
								isGeneratingNumber: false,
								invoiceNumberError: null,
							});
						})
						.catch(error => {
							let invoiceNumberError = typeof error == 'string' ? error : '';
							invoiceNumberError = invoiceNumberError || 'An error occured while initialize new invoice.';
							this.setState({
								invoiceNumber: '0000001',
								isGeneratingNumber: false,
								invoiceNumberError: invoiceNumberError,
							});
						});
				}, 200);
			}
		);
	}

	visitSalePage(invoiceid){
		return this.props.history.replace('/sales/'+invoiceid);
	}

	redirectToWhatsApp(phone, message){
		let url = `https://wa.me/${encodeURI(phone)}?text=${encodeURI(message)}`
        var win = window.location(url, '_blank');
		win.focus();
		return null;
	}
}

const mapStateToProps = ({ userInfo, currentBusiness }) => ({
	userInfo: userInfo.data,
	currentBusiness: currentBusiness.data,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showAlertDialog: ActionCreators.showAlertDialog,
    showSnackbar: ActionCreators.showSnackbar,

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InvoiceCreate));
