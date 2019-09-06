import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import Button from '../presentation/Button';
import Input from '../presentation/Input';
import Dropdown from '../presentation/Dropdown';
import DashboardSection from '../presentation/DashboardSection';
import Dropzone from '../presentation/Dropzone';
import Select from '../presentation/Select';
import ReactSelect from 'react-select';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import PageModal from '../presentation/PageModal';
import Flatpickr from 'react-flatpickr';
import ClientsCreate from './ClientsCreate';
import ItemsCreate from './ItemsCreate';
import BankAdd from './BankAdd';
import { thousand } from '../../helpers/Misc';
import { CURRENCIES_SIGNS } from '../../configs/data.config';
import moment from 'moment';
import InvoiceLayout from './InvoiceLayout';
import InvoicePaperEditor from './InvoicePaperEditor';
import InvoicePaperEditorMobile from './InvoicePaperEditorMobile';
import EmailForm from './EmailForm';
import { isNumber } from '../../helpers/Rules';

const logo = require('../../assets/logo.png');
const NEW_LINE = {
	description: '',
	price: '',
	quantity: '',
};

const FONT_STYLES = ['avenir-next', 'lato', 'roboto'];

class InvoicePaper extends React.Component {
	static propTypes = {
		invoiceNumber: propTypes.string,
		image: propTypes.string,
		client: propTypes.number,
		itemsList: propTypes.arrayOf(propTypes.object),
		bank: propTypes.number,
		notes: propTypes.string,
		mode: propTypes.oneOf(['read', 'write']).isRequired,
		template: propTypes.oneOf(['simple', 'modern']),
		themeColor: propTypes.oneOf(['default', 'purple', 'orange', 'green', 'red', 'yellow', 'black']),
		fontStyle: propTypes.oneOf(FONT_STYLES),
		sender: propTypes.shape({
			name: propTypes.string.isRequired,
			address: propTypes.node.isRequired,
			email: propTypes.string.isRequired,
			phoneNumber: propTypes.string.isRequired,
		}),
		issueDate: propTypes.string,
		dueDate: propTypes.string,
		onCancel: propTypes.func,
		currency: propTypes.string,
		onPaymentChange: propTypes.func,
	};

	static defaultProps = {
		mode: 'read',
		template: 'simple',
		themeColor: 'default',
		fontStyle: 'avenir-next',
		itemsList: [Object.assign({}, NEW_LINE)],
		currency: 'usd',
	};

	constructor(props) {
		super(props);
		this.state = {
			invoiceNumber: null,
			itemsList: [],
			tax: '',
			discount: '',
			client: null,
			banks: [],
			addNew: null,
			bankAccount: null,
			bankInfo: {},
			ready: false,
			isDiscountRequired: false,
			isDepositRequired: false,
			depositRequired: '0.00',
			image: null,
			subtotal: 0,
			description: '',
			dueDate: moment(new Date()).add(30,'days').format('DD/MM/YYYY'),
			issueDate: moment(new Date()).format('DD/MM/YYYY'),
			notes: '',
			selectedItems: [],
			addNewItem: null,
			selectedItemMetaData: [],
			sendType: null,
			emailtosendto: '',
			phonetosendto: '',
			personalmessage: '',
			shareType: '',
			sendViaWhatsAppDialog: false,
			showCustomizeDialog: false,
			previewMode: false,
			addItemModal: false,
			newItem: {
				description: '',
				price: '',
				quantity: '',
				amount: '',
				id: ''
			},
			reactSelectClient: null // holds value for selected client using react-select
		};
	}

	onSubmit = () => {
		// let data = Object.assign({}, this.state);
		let { selectedItems, selectedItemsMetaData } = this.state;

		// gen amount prop on each

		// gen item name list

		// add itemName as prop to metaData

		// add product model to metatdata

		//add date created to metaData
		if(!this.validateForm()) return false

		let payload = {
			invoicenumber: this.state.invoiceNumber,
			items: this.state.itemsList.map(item => {
				return {
					id: 0,
					description: item.description,
					invoiceid: 0,
					price: Number(item.price),
					quantity: Number(item.quantity),
					productid: item.productid,
					amount: Number(item.price) * Number(item.quantity)
				};
			}),
			clientid: Number(this.state.client),
			businessid: this.props.currentBusiness.id,
			userid: this.props.userInfo.userid,
			image: this.state.image,
			description: '',
			subtotal: parseInt(this.getSubtotal()),
			discount: parseFloat(this.state.discount),
			paymenttype: '',
			amountdue: parseInt(this.getTotal()),
			deposit: 0,
			tax: parseFloat(this.state.tax),
			sendstyle: this.state.sendType,
			email: this.state.emailtosendto,
			whatsappnumber: this.state.phonetosendto,
			invoicestyle: '',
			invoicetype: "invoice",
			issue_date: this.state.issueDate,
			due_date: this.state.dueDate,
			personalmessage: this.state.personalmessage,
			notes: this.state.notes,
			paymentlink: '',
			invoicestatus: '',
			font: this.state.fontStyle,
			color: this.state.themeColor,
			requireddeposit: parseInt(this.state.depositRequired),
			isdeleted: 0,
			bankid: this.state.bankAccount
		};
		this.props.onSave(payload);
	};

	validateForm(){
		const { client, itemsList, sendType } = this.state
		let message = ''

		if(!isNumber(client) || (client == 0)){
			message = 'Please select a customer'
		}
		else if(itemsList.length < 1 && sendType != 'draft'){
			// there are no items and it is not a draft invoice, throw error
			message = 'Please add one or more items'
		}

		if(message != '') {
			this.props.showSnackbar(message, {variant: 'error'});
			return false
		}
		return true
	}

	getTotal = () => {
		let total = 0;
		let tax = parseFloat(this.state.tax);
		let taxAmount = 0;
		let discount = parseFloat(this.state.discount);
		let discountAmount = 0;

		// add subtotal
		total = total + this.getSubtotal();

		// implement discount
		if(discount){
			total = parseFloat(total) - parseFloat(discount);
		}

		// add tax
		if (tax) {
			taxAmount = (total / 100) * tax;
			total = parseFloat(total) + parseFloat(taxAmount);
		}

		// return total
		let totalTo2DecPlaces = parseFloat(total).toFixed(2);
		// this.setState({
		// 	amountdue: totalTo2DecPlaces,
		// });
		return totalTo2DecPlaces;
	};

	componentDidUpdate(prevProps, prevState) {
		if (this.state.ready) {
			this.handleOnInfochange(prevProps);
		}
	}

	// componentWillReceiveProps(nextProps) {
	// 	let placeholderMetaData = [];
	// 	for (let i = 0; i <= nextProps.items.length; i++) {
	// 		placeholderMetaData.push({ description: '', quantity: '', price: '' });
	// 	}
	// 	this.setState({
	// 		client: `${nextProps.client}` || null,
	// 		selectedItemMetaData: [...placeholderMetaData],
	// 	});
	// }
	onImageChange = event => {
		const reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		reader.onload = event => {
			const picture_src = event.target.result;
			this.setState({ image: picture_src });
		};
	};

	componentDidMount() {

		this.setState(
			{
				client: this.props.client.toString() || null,
				bankAccount: this.props.bankAccount || null,
				notes: this.props.notes || '',
				// itemsList: this.props.itemsList.length > 0 ? [...this.props.itemsList] : [Object.assign({}, NEW_LINE)],
				tax: parseFloat(this.props.tax) ? `${parseFloat(this.props.tax).tofixed(2)}` : '5',
				discount: parseFloat(this.props.discount) ? `${parseFloat(this.props.discount).tofixed(2)}` : '0',
				depositRequired: parseFloat(this.props.depositRequired)
					? `${parseFloat(this.props.depositRequired).tofixed(2)}`
					: '0.00',
				themeColor: this.props.themeColor || 'default',
				invoiceNumber: this.props.invoiceNumber || null,
				image: this.props.userInfo.business[0].logourl || null,
				itemsList: this.props.itemsList || [],
				selectedItems: this.props.selectedItems || [],
				sendType: 'draft',
				ready: true,
			},
			() => {
				// initialize clients list
				if (this.props.clients.length < 1) {
					this.props.getAllClients();
				}
				// initialize items list
				if (this.props.items.length < 1) {
					this.props.getAllItems();
				}
			}
		);
	}

	render() {
		const {
			clients,
			bank,
			mode,
			sender,
			onCancel,
			onSave,
			onSend,
			getAllClients,
			getAllItems,
			currency,
			currentBusiness
		} = this.props;

		const {
			client,
			issueDate,
			dueDate,
			bankAccount,
			bankInfo,
			itemsList,
			tax,
			discount,
			addNew,
			notes,
			themeColor,
			fontStyle,
			invoiceNumber,
			template,
			isDepositRequired,
			isDiscountRequired,
			depositRequired,
			showCustomizeDialog,
			sendType,
			previewMode,
			addItemModal,
			newItem,
			image,
			reactSelectClient
		} = this.state;

		let selectableClients = this.getSelectClientsList();
		let selectedClient = clients.find(x => x.id === parseInt(client))
		let items = this.getSelectItemsList();
		let bankAccounts = this.getSelectBanksList();
		let variantClassNames = '';
		variantClassNames += ` invoice-paper-${themeColor || ''}`;
		variantClassNames += ` invoice-paper-template-${template || ''}`;
		let colorClass = themeColor;
		if(colorClass === 'default'){
			colorClass = 'brand-blue'
		}

		return (
			<div>
			{previewMode &&
				<div className={`h-full mt-8 bg-white text-${colorClass} pin-b z-50`}>
					<div className="-ml-8">
						<Button 
							variant="link-primary" 
							type="button" 
							className="px-5" 
							onClick={() => {
								this.setState({
									previewMode: false
								})
							}}>
							<span className="font-bold text-base">&times;</span>
						</Button>
						<div className='float-right'>
						<Dropdown
								type="button"
								variant="link"
								size="sm"
								align="right"
								label={
									<span className='text-base font-bold text-brand-blue'>Send</span>
								}
								onChange={event => this.handlesendTypeChange(event)}
								options={['Send to email', 'Send to WhatsApp', 'Save']}
							/>
						</div>
					</div>
					<InvoiceLayout
						currentBusiness={currentBusiness}
						general={{
							invoicenumber: invoiceNumber,
							notes: notes,
							subtotal: parseInt(this.getSubtotal()),
							amountdue: parseInt(this.getTotal()),
							issue_date: issueDate,
							due_date: dueDate,
							image: image,
							tax: tax,
							discount: discount,
							accountname: bankInfo.accountname || null,
							accountnumber: bankInfo.accountnumber || null,
							accounttype: bankInfo.accounttype || null,
							bankname: bankInfo.bankname || null
						}}
						client={
							selectedClient
						}
						items={itemsList}
						color={colorClass}
					/>
				</div>
			}
			{!previewMode &&
			<div>
				{addNew === 'client' && (
					<ClientsCreate
						onCreated={this.handleClientCreated.bind(this)}
						onCancel={() =>
							this.setState({
								addNew: null,
							})
						}
					/>
				)}

				{addNew === 'bankAccount' && (
					<BankAdd
						onCancel={() =>
							this.setState({
								addNew: null,
							})
						}
						onComplete={this.handleBankCreated.bind(this)}
					/>
				)}

				{addNew === 'item' && (
					<ItemsCreate
						onCreated={this.handleItemCreated.bind(this)}
						onCancel={() =>
							this.setState({
								addNew: null
							})
						}
					/>
				)}

				{sendType === 'email' && (
					<PageModal
						backdropClose={false}
						escClose={false} 
						show={true}
						className=''
					>
						<EmailForm 
							submitLabel="Send Invoice"
							data={{
								email: (selectedClient) ? selectedClient.companyemail : ''
							}}
							onCancel={() => {
								this.setState({
									sendType: null,
								})
							}}
							onSubmit={(data) => {
								this.setState({
									emailtosendto: data.email,
									personalmessage: data.personalmessage
								}, () => {
									this.onSubmit()
								})
							}}
						/>
					</PageModal>
				)}
				{/* {sendType === 'whatsapp' && (
					<PageModal
						backdropClose={false}
						escClose={false} 
						show={true}
						className=''
					>
						<WhatsAppForm 
							submitLabel="Send Invoice"
							data={{
								email: (selectedClient) ? selectedClient.phonenumber : ''
							}}
							onCancel={() => {
								this.setState({
									sendType: null,
								})
							}}
							onSubmit={(data) => {
								this.setState({
									phonetosendto: data.phonenumber
								}, () => {
									this.onSubmit()
								})
							}}
						/>
					</PageModal>
				)} */}
				<div className={`md:hidden h-full mt-8 bg-white text-${colorClass}`}>
				<div className="px-2 mb-20">
					<div className="mb-4">
						{/* <span className='text-brand-blue font-bold font-lg' onClick={onCancel}>x</span> */}
						<div className="-ml-12">
							<Button variant="link-primary" type="button" className="py-2 px-5" onClick={onCancel}>
								<span className="font-bold text-2xl">&times;</span>
							</Button>
							<span className='mr-8' />
							<Button 
								variant="link-gray" 
								type="button" 
								className="py-2 px-5"
								onClick={() => {
									this.setState({
										previewMode: true
									})
								}}>
								<span className="text-lg">Preview</span>
							</Button>

							{/* <Button variant="link-primary" type="button" className="py-2 px-4" onClick={this.onSubmit}>
								Save
							</Button> */}
							<Dropdown
								type="button"
								variant="link"
								size="sm"
								align="right"
								label={
									<span className='text-lg font-normal text-brand-blue'>Send</span>
								}
								onChange={event => this.handlesendTypeChange(event)}
								options={['Send to email', 'Send to WhatsApp', 'Save']}
							/>
							{/* <Button variant="link-primary" type="button" className="py-2 px-4">
								Send
							</Button> */}
							{/* <span className='text-base font-medium mr-8'>Preview</span>
							<span className='text-base font-medium text-brand-blue'>Send</span> */}
						</div>
					</div>
					<div className={`flex flex-row mb-2 border-b border-${colorClass} md:hidden`}>
						<div className="w-1/2">
							{image &&
								<div className='mb-6'>
									<img src={image} className='w-16 ml-6' alt=""/>
								</div>
							}
							{!image &&
								<Dropzone
									classes={{
										container: 'mb-6',
									}}
									dimension="16:9"
									image={this.state.image}
									onChange={this.onImageChange}
									onCancel={() => {}}
								/>
							}
							<p className="font-semibold mb-1">Billed To</p>
							{/* <Select
								setRef={ref => (this.clientsSelect = ref)}
								options={selectableClients}
								onChange={e =>
									this.setState({
										client: e.target.value !== 'add-new' ? e.target.value : client,
										addNew: e.target.value === 'add-new' ? 'client' : addNew,
									})
								}
								value={client || ''}
							/> */}
								<ReactSelect
									setRef={ref => (this.clientsSelect = ref)}
									options={selectableClients}
									onChange={e =>
										this.setState({
											client: e.value !== 'add-new' ? e.value : client,
											reactSelectClient: e.value !== 'add-new' ? e : reactSelectClient,
											addNew: e.value === 'add-new' ? 'client' : addNew
										})
									}
									value={reactSelectClient || ''}
								/>
						</div>
						<div className="w-1/2 text-right">
							<div className="mb-8">
								<p className="font-semibold mb-1">Invoice number</p>
								<span className="text-black">
									<input
										className="seamless-input text-right"
										value={invoiceNumber || ''}
										onChange={e =>
											this.setState({
												invoiceNumber: e.target.value,
											})
										}
									/>
								</span>
							</div>
							<div className="mb-8">
								<p className="font-semibold mb-1">Date of Issue</p>
								<span className="text-black">
									<Flatpickr
										options={{
											dateFormat: 'd/m/Y',
											disableMobile: true,
											defaultDate: issueDate
										}}
										onReady={() => {
											this.setState({
												issueDate: issueDate
											})
										}}
										onValueUpdate={([val]) =>
											this.setState({
												issueDate: moment(val).format('DD/MM/YYYY')
											})
										}
										type="text"
										placeholder="dd/mm/yyyy"
										className="seamless-input text-right"
									/>
								</span>
							</div>
							<div>
								<p className="font-semibold mb-1">Due Date</p>
								<span className="text-black">
									<Flatpickr
										options={{
											dateFormat: 'd/m/Y',
											disableMobile: true,
											defaultDate: dueDate
										}}
										onReady={() => {
											this.setState({
												dueDate: dueDate,
											})
										}}
										onValueUpdate={([val]) =>
											this.setState({
												dueDate: moment(val).format('DD/MM/YYYY')
											})
										}
										type="text"
										placeholder="dd/mm/yyyy"
										className="seamless-input text-right"
									/>
								</span>
							</div>
						</div>
					</div>
					<div className="flex flex-col">
						<div className="w-full mb-4">
							<span className="font-semibold">Description</span>
							<span className="float-right font-semibold">Total Amount</span>
						</div>
						<div>
							{itemsList.map(this.renderItemMobile.bind(this))}
							<span 
								className="text-grey" 
								onClick={() => {
									this.setState({
										addItemModal: true
									})
								}}>
								<i className="icon ion-md-add-circle-outline text-green" /> Add new line
							</span>

							{addItemModal &&
								<PageModal
									backdropClose={false}
									escClose={false} 
									show={true}
									className=''
								>
									<div className='text-center mb-2'>
										<span className='text-base font-bold'>Add Item</span>
									</div>
									<div className='form-fields'>
										<div className='form-fields-inner'>
											<div className='row fields-row md:mb-4'>
												<div className='col-md-6'>
													<label className='input-label'>Item</label>
													<Select
														setRef={ref => (this.itemSelect = ref)}
														options={this.getSelectItemsList()}
														onChange={e => {
															let items = this.props.items
															let data = {
																description: '',
																price: '',
																productid: ''
															}
															if(e.target.value != '' && e.target.value != 'add-new'){
																var selected = items.find(x => x.id === parseInt(e.target.value))
																data = {
																	description: selected.description,
																	price: selected.unitprice,
																	productid: selected.id,
																	quantity: 1,
																	id: e.target.value
																}
															}

															this.setState({
																newItem: data,
																// addNew: e.target.value === 'add-new' ? 'item' : addNew,
															});
														}}
														value={newItem.id}
													/>
												</div>
												<div className='col-md-6'>
													<label className='input-label'>Description</label>
													<Input
														size='sm'
														noIcon
														value={newItem.description}
														onChange={e => this.handleFieldChange(e, 'description')}
													/>
												</div>
											</div>
											<div className='row fields-row'>
												<div className='col-md-6'>
													<label className='input-label'>Unit Price</label>
													<Input
														size='sm'
														noIcon
														value={newItem.price}
														onChange={e => this.handleFieldChange(e, 'price')}
													/>
												</div>
												<div className='col-md-6 md:mb-0'>
													<label className='input-label'>Quantity</label>
													<Input
														size='sm'
														noIcon
														value={newItem.quantity}
														onChange={e => this.handleFieldChange(e, 'quantity')}
													/>
												</div>
											</div>
											<div className='py-4 border-t-2 border-brand-blue text-base'>
												<span className='font-bold'>Total ({CURRENCIES_SIGNS[currentBusiness.currency] || '$'})</span> 
												<span className='ml-4 text-black'>
													{CURRENCIES_SIGNS[currentBusiness.currency] || '$'}
													{thousand(parseInt(newItem.price * newItem.quantity || 0).toFixed(2))}
												</span>
											</div>
										</div>
									</div>
									<div className='spanned'>
										<div className='row'>
												<div className='col-sm-6 text-right'>
													<Button
														variant='link-gray'
														type='button'
														className='cancel-button'
														onClick={() => {
															this.setState({
																addItemModal: false,
																newItem: {}
															})
														}}
													>
														Cancel
													</Button>
												</div>
											<div className={`${'col-sm-6 text-left' || 'col-sm-12 text-center'}`}>
												<Button variant='primary' className='submit-button' onClick={
													() => {
														// push item to the global itemsList
														itemsList.push(newItem)
														this.setState({
															addItemModal: false,
															newItem: {}
														})
													}
												}>Add</Button>
											</div>
										</div>
									</div>
								</PageModal>
							}
						</div>
					</div>
					<div className="flex flex-row mb-2">
						<div className="w-1/3" />
						<div className="w-2/3 text-right">
							<div className="text-black mb-2">
								<span className="mr-12">Subtotal</span>
								<span className="text-right">{CURRENCIES_SIGNS[currency] || '$'}{thousand(this.getSubtotal())}</span>
							</div>
							<div className="text-black mb-2">
								<span className="mr-12">Discount</span>
								<span className="text-right">
									<input
										className="seamless-input 
											text-right w-8
										"
										min="0.0"
										step="0.10"
										value={discount || ''}
										placeholder="0.00"
										onChange={e => {
											let regEx = new RegExp(/^[0-9]+(.[0-9]{0,2})?$/, 'img');
											if (e.target.value.length > 0 && !regEx.test(e.target.value)) {
												return;
											}

											this.setState({
												discount: e.target.value,
											});
										}}
									/>
								</span>
							</div>
							<div className="text-black mb-2">
								<span className="mr-12">
								<input
										className="seamless-input 
											text-right w-8
										"
										min="0.0"
										step="0.10"
										value={tax || ''}
										placeholder="0.00"
										onChange={e => {
											let regEx = new RegExp(/^[0-9]+(.[0-9]{0,2})?$/, 'img');
											if (e.target.value.length > 0 && !regEx.test(e.target.value)) {
												return;
											}

											this.setState({
												tax: e.target.value,
											});
										}}
									/>%
								Tax</span>
								<span className="text-right">
									{thousand(this.getTaxAmount())}
								</span>
							</div>
							<div className={`mb-3 py-2 border-b-2 border-t-2 border-${colorClass}`}>
								<span className="mr-4 font-bold">Amount Due ({CURRENCIES_SIGNS[currency] || '$'})</span>
								<span className="float-right text-black">{`${CURRENCIES_SIGNS[currency] || '$'}${thousand(
									this.getTotal()
								)}`}</span>
							</div>
							<div className="text-black text-left mb-2">
								{!isDepositRequired && (
									<span
										onClick={() =>
											this.setState({
												isDepositRequired: true,
											})
										}
									>
										Add required deposit
										<i className="icon ion-md-add-circle-outline text-green" />
									</span>
								)}

								{isDepositRequired && (
									<h4 className="text-right">
										<span className="capitalize light-font text-black">Deposit Required</span>
										<input
											className="seamless-input 
												text-right w150
												text-black normal-font 
												w150 inline-block
											"
											min="0.0"
											step="0.10"
											value={depositRequired || ''}
											placeholder="0.00"
											onChange={e => {
												let regEx = new RegExp(/^[0-9]+(.[0-9]{0,2})?$/, 'img');
												if (e.target.value.length > 0 && !regEx.test(e.target.value)) {
													return;
												}

												this.setState({
													depositRequired: e.target.value,
												});
											}}
										/>
									</h4>
								)}
							</div>
						</div>
					</div>
					<div className="mb-20">
						<p className="font-semibold mb-2">Notes and Terms</p>
						<Input
							multiline
							className=""
							value={notes}
							onChange={e =>
								this.setState({
									notes: e.target.value,
								})
							}
						/>
					</div>
					<div className="mb-4">
						<p className="font-semibold mb-6">Payment Instructions</p>
						<div>
							<p className="text-black mb-2">Business Bank Account Details</p>
							<Select
								setRef={ref => (this.bankAccountsSelect = ref)}
								options={bankAccounts}
								classes={{
									container: 'invoice-select',
								}}
								onChange={e => {
									if (e.target.value !== 'add-new') {
										this.handleChangeBankAccount(e.target.value);
									}
									this.setState({
										addNew: e.target.value === 'add-new' ? 'bankAccount' : addNew,
									});
								}}
								value={bankAccount || ''}
							/>
						</div>
						{/* <div>
							<p className="text-black mb-2">Online Payment</p>
							<Button block size="sm" className="invoice-button" variant="primary">
								Connect Online Payments
							</Button>
						</div> */}
					</div>
				</div>
				<div className='hidden'>
					{showCustomizeDialog &&
						<div className='w-full pt-3 border-t border-grey-light fixed pin-b z-20 bg-white rounded-t-lg'>
							<span 
								className='text-brand-blue font-bold pl-2 text-2xl'
								onClick={() => 
									this.setState({
										showCustomizeDialog: false
									})
								}
							>&times;</span>
							<InvoicePaperEditorMobile
									onCustomizeChange={data => this.handleCustomizationChange(data)}
								/>
						</div>
					}
					<div 
						className='w-full py-2 border-t border-grey-light text-center fixed pin-b z-10 bg-white'
						onClick={() => 
							this.setState({
								showCustomizeDialog: true
							})
						}>
						<img className="w-8" src={require('../../assets/paint-brush.png')} alt="Edit template" />
						<p>Edit template</p>
					</div>
				</div>
			</div>
				
				{/* ===
				=== Desktop view starts here
				=== */}
				<div className='hidden md:block'>
					<div className="full-height">
						<div className="spanned full-height">
							<div className="row full-height">
								<div className="col-md-8 full-height pr0">

									<div className={`invoice-paper full-height ${variantClassNames}`}>
									{addNew === 'client' && (
										<ClientsCreate
											onCreated={this.handleClientCreated.bind(this)}
											onCancel={() =>
												this.setState({
													addNew: null,
												})
											}
										/>
									)}

									{addNew === 'bankAccount' && (
										<BankAdd
											onCancel={() =>
												this.setState({
													addNew: null,
												})
											}
											onComplete={this.handleBankCreated.bind(this)}
										/>
									)}

									{mode === 'write' && (
										<DashboardSection
											classes={{
												container: 'mb0',
											}}
											title={<span className="text-black ml30">New Invoice</span>}
											rightContent={
												<div
													className="row mb-4 d-none d-md-flex"
													style={{
														padding: '15px 0 0 10px',
														margin: '0',
													}}
												>
													<Button variant="link-gray" type="button" className="pv13 ph20 text-black" onClick={onCancel}>
														Cancel
													</Button>

													<Button variant="primary" type="button" onClick={this.onSubmit} className="pv13 ph20">
														Save As Draft
													</Button>

													<Dropdown
														variant="success"
														type="button"
														noArrow
														align="right"
														classes={{
															list: 'mt5',
														}}
														label={
															<span className="">
																<span className="mr20 font-light text-white">Send</span>
																<i className="icon ion-md-more" />
															</span>
														}
														onChange={event => this.handlesendTypeChange(event)}
														options={['Send to email', 'Send to WhatsApp']}
													/>
													{/* <Dropdown
														variant="success"
														type="button"
														onChange={e => this.handleSendOption(e.target.value)}
														noArrow
														align="right"
														classes={{
															list: 'mt5',
														}}
														options={['Send to email', 'Share']}
														label={
															<span className="">
																<span className="mr20 font-light text-white">Send</span>
																<i className="icon ion-md-more" />
															</span>
														}
													/> */}
												</div>
											}
										/>
									)}

									<header className="invioce-paper-heading">
										<div className="hidden md:block">
											<div className="row justify-content-between mb50">
												<div className="col-md-4">
													<img src={this.state.image} className='w-16' />
													{/* <Dropzone
														dimension="1:1"
														// image={this.state.image}
														selected={this.state.image || ''}
														onChange={this.onImageChange}
														onCancel={() => {}}
													/> */}
												</div>
												<div className="col-md-4">
													<div className="sender-info text-right">
														<h2
															className="mb0 mt0 
																invoice-text
																bold-font
															"
														>
															{sender.name || ''}
														</h2>
														<p className="mb5 mt0 text-black normal-font">{sender.address || ''}</p>
														<p className="mb5 mt0 text-black normal-font">{sender.phonenumber || ''}</p>
														<p className="mb5 mt0 text-black normal-font">{sender.email || ''}</p>
													</div>
												</div>
											</div>

											<div className="row justify-content-between">
												<div className="col-md-4">
													<h4 className=" invoice-text">Billed To</h4>
													{/* <Select
														className="invoice-select"
														setRef={ref => (this.clientsSelect = ref)}
														options={selectableClients}
														onChange={e =>
															this.setState({
																client: e.target.value !== 'add-new' ? e.target.value : client,
																addNew: e.target.value === 'add-new' ? 'client' : addNew,
															})
														}
														value={client || ''}
													/> */}
													<ReactSelect
														setRef={ref => (this.clientsSelect = ref)}
														options={selectableClients}
														onChange={e =>
															this.setState({
																client: e.value !== 'add-new' ? e.value : client,
																reactSelectClient: e.value !== 'add-new' ? e : reactSelectClient,
																addNew: e.value === 'add-new' ? 'client' : addNew
															})
														}
														value={reactSelectClient || ''}
													/>
												</div>
												<div className="col-md-6">
													<h3 className=" invoice-text text-right">
														<span className="mr20">Invoice Number</span>
														<input
															className="seamless-input 
																text-right w150
																text-black normal-font 
																w150 inline-block
															"
															value={invoiceNumber || ''}
															onChange={e =>
																this.setState({
																	invoiceNumber: e.target.value,
																})
															}
														/>
													</h3>
													<h3 className="d-flex  invoice-text text-right justify-content-end">
														<span className="mr20">Issue Date</span>
														<span className="text-black normal-font">
															<Flatpickr
																options={{
																	dateFormat: 'd/m/Y',
																	disableMobile: true,
																	defaultDate: issueDate
																}}
																onReady={() => {
																	this.setState({
																		issueDate: issueDate
																	})
																}}
																onValueUpdate={([val]) =>
																	this.setState({
																		issueDate: moment(val).format('DD/MM/YYYY')
																	})
																}
																type="text"
																placeholder="dd/mm/yyyy"
																className="seamless-input text-right w150"
															/>
														</span>
													</h3>
													<h3 className="d-flex  invoice-text text-right justify-content-end">
														<span className="mr20">Due Date</span>
														<span className="text-black normal-font">
															<Flatpickr
																options={{
																	dateFormat: 'd/m/Y',
																	disableMobile: true,
																	defaultDate: dueDate
																}}
																onReady={() => {
																	this.setState({
																		dueDate: dueDate,
																	})
																}}
																onValueUpdate={([val]) =>
																	this.setState({
																		dueDate: moment(val).format('DD/MM/YYYY')
																	})
																}
																type="text"
																placeholder="dd/mm/yyyy"
																className="seamless-input text-right w150"
															/>
														</span>
													</h3>
												</div>
											</div>
										</div>
									</header>

									<section className="invoice-paper-body">
										<div>
											<div className="spanned items-list-heading d-none d-md-block">
												<div className="row">
													<div className="col-md-6">
														<h2 className="title">Item</h2>
														<h4 className="subtitle">Descripton</h4>
													</div>
													<div className="col-md-2">
														<h2 className="title">Price</h2>
													</div>
													<div className="col-md-2">
														<h2 className="title">Qty</h2>
													</div>
													<div className="col-md-2">
														<h2 className="title">Amount</h2>
													</div>
												</div>
											</div>
											{itemsList.map(this.renderItemDesktop.bind(this))}
											<div className="spanned">
												<Button
													variant="link-gray"
													className="add-line-button"
													onClick={this.addItem.bind(this)}
													size="lg"
												>
													<i className="icon ion-md-add-circle-outline" />
													<span>Add New Line</span>
												</Button>
											</div>

											<div className="spanned mb15">
												<div className="row">
													<div className="col-md-6" />
													<div className="col-md-6">
														<h4 className="text-black normal-font text-right pull-right mt0 mb-2">
															<span className="mr20">Subtotal</span>
															<span
																className="text-right w150
																	text-black normal-font 
																	inline-block
																"
															>
																{thousand(this.getSubtotal())}
															</span>
														</h4>
														{!isDiscountRequired && (
															<div className="spanned text-right">
																<Button
																	variant="link-gray"
																	className="add-deposit-button mr167"
																	onClick={() =>
																		this.setState({
																			isDiscountRequired: true,
																		})
																	}
																	size="sm"
																>
																	<span>Add discount</span>
																	<i className="icon ion-md-add-circle-outline" />
																</Button>
															</div>
														)}
														{isDiscountRequired && (
															<div className="spanned mb-2">
																<h4
																	className="text-black
																		normal-font text-right 
																		pull-right mv0
																	"
																>
																	<span className="mr20 text-base">
																		<span className='text-sm'>Discount</span>
																	</span>
																	<span
																		className="text-right w150
																			text-black normal-font 
																			inline-block
																		"
																	>
																		<input
																			className="seamless-input 
																				text-right w150
																				text-black font-normal 
																				w150 inline-block
																			"
																			min="0.0"
																			step="0.10"
																			value={discount || ''}
																			placeholder="-0.00"
																			onChange={e => {
																				let regEx = new RegExp(/^[0-9]+(.[0-9]{0,2})?$/, 'img');
																				if (e.target.value.length > 0 && !regEx.test(e.target.value)) {
																					return;
																				}

																				this.setState({
																					discount: e.target.value,
																				});
																			}}
																		/>
																	</span>
																</h4>
															</div>
														)}
														<div className="spanned">
															<h4
																className="text-black
																	normal-font text-right 
																	pull-right mv0
																	tax-field
																"
															>
																<span className="mr20 text-lg">
																	<input
																		className="seamless-input 
																			text-right w150
																			text-black font-bold
																			w150 inline-block
																		"
																		min="0.0"
																		step="0.10"
																		value={tax || ''}
																		placeholder="0.00"
																		onChange={e => {
																			let regEx = new RegExp(/^[0-9]+(.[0-9]{0,2})?$/, 'img');
																			if (e.target.value.length > 0 && !regEx.test(e.target.value)) {
																				return;
																			}

																			this.setState({
																				tax: e.target.value,
																			});
																		}}
																	/>
																	% <span className='text-sm'>Tax</span>
																</span>
																<span
																	className="text-right w150
																		text-black normal-font 
																		inline-block
																	"
																>
																	{thousand(this.getTaxAmount())}
																</span>
															</h4>
														</div>
													</div>
												</div>
											</div>

											<div className="spanned">
												<div className="row justify-content-between mb30">
													<div className="col-md-4" />
													<div className="col-md-6">
														<h2 className=" invoice-text text-right">
															<span className="mr20 capitalize">
																Amount Due(
																<span className="uppercase">{currency}</span>)
															</span>
															<span
																className="text-right w150
																	text-black normal-font 
																	mw150 inline-block
																"
															>
																{`${CURRENCIES_SIGNS[currency] || '$'}${thousand(this.getTotal())}`}
															</span>
														</h2>
														{!isDepositRequired && (
															<div className="spanned text-right">
																<Button
																	variant="link-gray"
																	className="add-deposit-button mr167"
																	onClick={() =>
																		this.setState({
																			isDepositRequired: true,
																		})
																	}
																	size="sm"
																>
																	<span>Add required deposit</span>
																	<i className="icon ion-md-add-circle-outline" />
																</Button>
															</div>
														)}

														{isDepositRequired && (
															<h4 className="text-right">
																<span className="mr20 capitalize light-font text-black">
																	Deposit Required
																</span>
																<input
																	className="seamless-input 
																		text-right w150
																		text-black normal-font 
																		w150 inline-block
																	"
																	min="0.0"
																	step="0.10"
																	value={depositRequired || ''}
																	placeholder="0.00"
																	onChange={e => {
																		let regEx = new RegExp(/^[0-9]+(.[0-9]{0,2})?$/, 'img');
																		if (e.target.value.length > 0 && !regEx.test(e.target.value)) {
																			return;
																		}

																		this.setState({
																			depositRequired: e.target.value,
																		});
																	}}
																/>
															</h4>
														)}
													</div>
												</div>

												<h1 className=" invoice-text bold-font">Payment Instructions</h1>
												<div className="row justify-content-between mb30">
													<div className="col-md-4">
														<h3 className="text-black light-font mb30">Business Bank Account Details</h3>
														<Select
															setRef={ref => (this.bankAccountsSelect = ref)}
															options={bankAccounts}
															classes={{
																container: 'invoice-select',
															}}
															onChange={e => {
																if (e.target.value !== 'add-new') {
																	this.handleChangeBankAccount(e.target.value);
																}
																this.setState({
																	addNew: e.target.value === 'add-new' ? 'bankAccount' : addNew,
																});
															}}
															value={bankAccount || ''}
														/>
													</div>

													{/* <div className="col-md-4">
														<h3 className="text-black light-font mb30">Online Bank Or Credit Card Payments</h3>
														<Button block size="sm" className="invoice-button" variant="primary">
															Connect Online Payments
														</Button>
													</div> */}
												</div>

												<div className="row justify-content-between mb30">
													<div className="col-md-12">
														<h1 className=" invoice-text">Notes And Terms</h1>
														<Input
															multiline
															className="notes-field invoice-input"
															value={notes}
															onChange={e =>
																this.setState({
																	notes: e.target.value,
																})
															}
														/>
													</div>
												</div>
											</div>
										</div>
									</section>

									<div
										className="row mb-4 d-md-none"
										style={{
											padding: '15px 0 0 10px',
											margin: '0',
										}}
									>
										<Button variant="link-gray" type="button" className="pv13 ph20" onClick={onCancel}>
											Cancel
										</Button>

										<Dropdown
											variant="success"
											type="button"
											onChange={e => this.handleSendOption(e.target.value)}
											noArrow
											align="right"
											classes={{
												list: 'mt5',
											}}
											options={['Send to email', 'Share']}
											label={
												<span className="">
													<span className="mr20">Send</span>
													<i className="icon ion-md-more" />
												</span>
											}
										/>

										<Button variant="primary" type="button" onClick={this.onSubmit} className="pv13 ph20">
											Save
										</Button>
									</div>

									<section className="invoice-paper-footer">
										<span>Powered By</span>
										<img src={logo} />
									</section>
								</div>
									</div>
									<div className="col-md-4 full-height pl0">
										<InvoicePaperEditor
											onCustomizeChange={data => this.handleCustomizationChange(data)}
											bankAccount={bankAccount}
											onPaymentChange={data => this.handlePaymentChange(data)}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			}
			</div>
		);
	}
	
	renderItem(item, index) {
		const { itemsList, selectedItems, addNew } = this.state;
		let selectList = this.getSelectItemsList();
		let totalCost = parseFloat(item.price) * parseInt(item.quantity);

		return (
			<div className="invoice-paper-item" key={index}>
				<div>
					<div className="row">
						<div className="col-md-6">
							<Select
								setRef={ref => (this.itemsSelect = ref)}
								options={selectList}
								onChange={e => {
									let items = this.props.items
									if(e.target.value != '' && e.target.value != 'add-new'){
										var selected = items.find(x => x.id === parseInt(e.target.value))
										itemsList[index] = {
											description: selected.description,
											quantity: 1,
											price: selected.unitprice,
											productid: selected.id,
										}
									}else{
										itemsList[index] = {
											description: '',
											quantity: '',
											price: '',
											productid: ''
										}	
									}
									// to mark the dropdown as selected
									selectedItems[index] = e.target.value
									this.setState({
										itemsList: itemsList,
										addNew: e.target.value === 'add-new' ? 'item' : addNew,
										selectedItems: selectedItems
									});
								}}
								value={selectedItems[index] || ''}
							/>
						</div>
						<div className="col-md-6">
							<Input
								className="invoice-input"
								style={{ width: '100%' }}
								// label="Item description"
								value={item.description}
								placeholder="Item description"
								onChange={e => this.handleItemFieldChange(e, index, 'description')}
								readOnly
							/>
						</div>
						<div className="col-md-2">
							<Input
								className="invoice-input"
								style={{ width: '100%' }}
								// label="Price"
								value={item.price}
								placeholder="Cost of each item"
								onChange={e => this.handleItemFieldChange(e, index, 'price')}
								readOnly
							/>
						</div>
						<div className="col-md-2">
							<Input
								className="invoice-input"
								style={{ width: '100%' }}
								// label="Quantity"
								value={item.quantity}
								placeholder="No. of item"
								onChange={e => this.handleItemFieldChange(e, index, 'quantity')}
							/>
						</div>
						<div className="col-md-2">
							<Input
								className="invoice-input"
								// label="Amount"
								style={{ width: '100%' }}
								value={totalCost ? thousand(parseFloat(totalCost).toFixed(2)) : ''}
								placeholder="Total Cost"
								onChange={e => this.handleItemFieldChange(e, index, 'subtotal')}
								readOnly
							/>
						</div>
					</div>
				</div>
				{this.props.mode == 'write' && itemsList.length >= 2 && (
					<Button
						type="button"
						variant="link-gray"
						onClick={() => this.removeItem(index)}
						className="ph20"
						style={{ outline: 'none' }}
					>
						<i className="icon ion-md-close-circle" />
					</Button>
				)}
			</div>
		);
	}

	renderItemMobile(item, index){
		const { itemsList } = this.state
		const { currentBusiness } = this.props;
		const amount = item.price * item.quantity
		return (
			<div className='flex flex-row w-full mb-4 text-black' key={index}>
				<div className='flex flex-col w-2/3 leading-normal'>
					<p className='text-base'>{item.description}</p>
					<p className='text-grey'>{item.quantity}(Qty) at {`${CURRENCIES_SIGNS[currentBusiness.currency] || '$'}${item.price}`} a unit</p>
					{this.props.mode == 'write' && itemsList.length >= 1 && (
						<div
							onClick={() => this.removeItem(index)}
							className="text-red"
						>
							remove
						</div>
					)}
				</div>
				<div className='w-1/3 text-base text-right'>
					{CURRENCIES_SIGNS[currentBusiness.currency] || '$'}
					{thousand(parseInt(item.amount || amount).toFixed(2))}
				</div>
			</div>
		);
	}

	renderItemDesktop(item, index) {
		const { addNew, itemsList, selectedItems } = this.state;

		let selectList = this.getSelectItemsList();
		let totalCost = parseFloat(item.price) * parseInt(item.quantity);

		// mark chosen item..checking for string important as props might come in as integer
		let chosenItem = ''
		if(selectedItems[index]){
			chosenItem = (typeof(selectedItems[index] !== 'string')) ? selectedItems[index].toString() : selectedItems[index];
		}
		return (
			<div className="invoice-paper-item" key={index}>
				<div>
					<div className="row">
						<div className="col-md-6">
							<Select
								// setRef={ref => (this.itemsSelect = ref)}
								options={selectList}
								onChange={e => {
									let items = this.props.items
									if(e.target.value != '' && e.target.value != 'add-new'){
										var selected = items.find(x => x.id === parseInt(e.target.value))
										itemsList[index] = {
											description: selected.description,
											quantity: 1,
											price: selected.unitprice,
											productid: selected.id,
										}
									}else{
										itemsList[index] = {
											description: '',
											quantity: '',
											price: '',
											productid: ''
										}	
									}
									// to mark the dropdown as selected
									selectedItems[index] = e.target.value
									this.setState({
										itemsList: itemsList,
										addNew: e.target.value === 'add-new' ? 'item' : addNew,
										selectedItems: selectedItems
									});
								}}
								value={chosenItem || ''}
							/>
							{/* <Input
								className="invoice-input"
								style={{ width: '100%' }}
								// label="Item description"
								value={item.description}
								placeholder="Item description"
								onChange={e => this.handleItemFieldChange(e, index, 'description')}
							/> */}
						</div>
						<div className="col-md-2">
							<Input
								className="invoice-input"
								style={{ width: '100%' }}
								// label="Price"
								value={item.price}
								placeholder="Cost of each item"
								onChange={e => this.handleItemFieldChange(e, index, 'price')}
							/>
						</div>
						<div className="col-md-2">
							<Input
								className="invoice-input"
								style={{ width: '100%' }}
								// label="Quantity"
								value={item.quantity}
								placeholder="No. of item"
								onChange={e => this.handleItemFieldChange(e, index, 'quantity')}
							/>
						</div>
						<div className="col-md-2">
							<Input
								className="invoice-input"
								// label="Amount"
								style={{ width: '100%' }}
								value={totalCost ? thousand(parseFloat(totalCost).toFixed(2)) : ''}
								placeholder="Total Cost"
								onChange={e => this.handleItemFieldChange(e, index, 'subtotal')}
								readOnly
							/>
						</div>
					</div>
				</div>
				{this.props.mode == 'write' && itemsList.length >= 2 && (
					<Button
						type="button"
						variant="link-gray"
						onClick={() => this.removeItem(index)}
						className="ph20"
						style={{ outline: 'none' }}
					>
						<i className="icon ion-md-close-circle" />
					</Button>
				)}
			</div>
		);
	}

	handleCustomizationChange(data) {
		this.setState({
			themeColor: data.themeColor,
			fontStyle: data.fontStyle,
			template: data.template
		});
	}

	handlePaymentChange(data) {
		this.setState({
			bankAccount: data.bankAccount
		});
	}

	removeItem(itemIndex) {
		let itemsList = [...this.state.itemsList];
		if (itemsList[itemIndex] !== undefined) {
			itemsList.splice(itemIndex, 1);
			this.setState({
				itemsList: itemsList,
			});
		}
	}
	
	addItem() {
		let itemsList = [...this.state.itemsList];
		let item = {
			description: '',
			price: '',
			quantity: '',
		};
		itemsList.push(item);
		this.setState({
			itemsList: itemsList,
		});
	}

	addItemMobile(){
		// let itemsList = [...this.state.itemsList]
		// itemsList.push({})
		this.setState({
			itemsList: {},
			addItemModal: false
		})
	}

	getSubtotal() {
		let itemsList = [...this.state.itemsList];
		let subtotal = 0;
		for (var i = 0; i < itemsList.length; i++) {
			if (parseInt(itemsList[i]['price']) * parseInt(itemsList[i]['quantity'])) {
				subtotal = subtotal + parseInt(itemsList[i]['price']) * parseInt(itemsList[i]['quantity']);
			}
		}
		return parseFloat(subtotal).toFixed(2);
	}

	getDiscountAmount = () => {
		let subtotal = this.getSubtotal()
		let discount = parseFloat(this.state.discount)
		let discountAmount = 0

		if(discount){
			discountAmount = (subtotal / 100) * discount;
		}

		return parseFloat(discountAmount).toFixed(2)
	}

	getTaxAmount = () => {
		let subtotal = this.getSubtotal()
		let discount = parseFloat(this.state.discount || 0)
		
		let tax = parseFloat(this.state.tax)
		let taxAmount = 0

		let taxableAmount = parseFloat(subtotal) - parseFloat(discount)

		if (tax) {
			taxAmount = (taxableAmount / 100) * tax
		}

		return parseFloat(taxAmount).toFixed(2)
	}

	storeSelectItemMetaData = (store, index, value, field) => {
		let indexedObject = store.filter(metaData => metaData.index === index);
		let otherIndexedObject = store.filter(metaData => metaData.index !== index);

		if (indexedObject.length && indexedObject[index]) {
			indexedObject[index][field] = value;
			this.setState({
				selectedItemMetaData: [...otherIndexedObject, ...indexedObject],
			});
		} else {
			this.setState({
				selectedItemMetaData: [
					...otherIndexedObject,
					{
						index,
						[field]: value,
					},
				],
			});
		}
	};

	handleFieldChange(e, field){
		// validate quantity
		if (field == 'quantity') {
			let regEx = new RegExp(/^[0-9]+?$/, 'img');
			if (e.target.value.length > 0 && !regEx.test(e.target.value)) {
				return;
			}
		}
		
		let newItem = this.state.newItem
		newItem[field] = e.target.value
		this.setState({
			newItem: newItem
		})
	}
	handleItemFieldChange(e, index, field) {
		// let { selectedItemMetaData } = this.state;
		// validate price
		if (field == 'price') {
			let regEx = new RegExp(/^[0-9]+(.[0-9]{0,2})?$/, 'img');
			if (e.target.value.length > 0 && !regEx.test(e.target.value)) {
				return;
			}
		}

		// validate quantity
		if (field == 'quantity') {
			let regEx = new RegExp(/^[0-9]+?$/, 'img');
			if (e.target.value.length > 0 && !regEx.test(e.target.value)) {
				return;
			}
		}

		let itemsList = [...this.state.itemsList];
		if (itemsList[index] && itemsList[index][field] !== undefined) {
			itemsList[index][field] = e.target.value;
			this.setState({
				itemsList: itemsList,
			});
		}

		// get selected items meta data
		// ['description', 'price', 'quantity'].forEach(metaField => {
		// 	if (field === metaField)
		// 		return this.storeSelectItemMetaData(selectedItemMetaData, index, e.target.value, field);
		// });
	}

	handleSendOption(option) {}

	getSelectClientsList() {
		const { clients } = this.props;
		// let list = [{ '': 'Select Customer' }, { 'add-new': '+ Add new' }];
		let list = [{value:'add-new', label:'+ Add new' }];

		if (!clients || clients.constructor !== Array) {
			return list;
		}

		for (var i = 0; i < clients.length; i++) {
			// list.push({
			// 	[clients[i]['id']]: clients[i]['firstname'] + ' ' + clients[i]['lastname'],
			// });
			list.push({
				value: clients[i]['id'], label: `${clients[i]['firstname']} ${clients[i]['lastname']}`
			})
		}

		return list;
	}

	getSelectItemsList() {
		const { items } = this.props;
		let list = [{ '': '- Select Item -' }, { 'add-new': '+ Add new' }];

		if (!items || items.constructor !== Array) {
			return list;
		}

		for (var i = 0; i < items.length; i++) {
			list.push({
				[items[i]['id']]: items[i]['productname'],
			});
		}
		// console.log('[GETSELECTITEMSLIST]', list);
		return list;
	}

	getSelectBanksList() {
		const { bankAccounts } = this.props;
		let list = [{ '': 'Select Bank Account' }, { 'add-new': '+ Add new' }];

		if (!bankAccounts || bankAccounts.constructor !== Array) {
			return list;
		}

		for (var i = 0; i < bankAccounts.length; i++) {
			list.push({
				[bankAccounts[i]['id']]: bankAccounts[i]['bankname'] + ' - ' + bankAccounts[i]['accountnumber'],
			});
		}

		return list;
	}

	handleClientCreated(newClient) {
		this.setState({
			addNew: null,
		});
	}

	handleItemCreated(newItem) {
		this.setState({
			addNew: null
		});
	}

	handleBankCreated(bankAccount) {
		this.setState(
			{
				addNew: null,
			},
			() => this.props.addNewBankAccount(bankAccount)
		);
	}

	handlesendTypeChange(e) {
		let sendType = null
		if (e.target.value === 'Send to email') {
			sendType = 'email'
		} else if (e.target.value === 'Send to WhatsApp') {
			sendType = 'whatsapp'
			this.setState({
				sendType: sendType
			}, () => {
				this.onSubmit()
			})
		}else {
			sendType = 'draft'
		}
		this.setState({
			sendType: sendType
		})

	}

	handleChangeBankAccount(bankAccount) {
		const { bankAccounts } = this.props;
		let info = bankAccounts.find(x => x.id === parseInt(bankAccount)) || null

		this.setState({
			bankAccount: bankAccount,
			bankInfo : info
		})
	}

	handleOnInfochange(prevProps) {
		if (!prevProps) return;

		// updates list
		let updates = {};

		// list of info fields
		// const infoFields = ['invoiceNumber', 'themeColor', 'template', 'fontStyle', 'bankAccount'];
		const infoFields = ['invoiceNumber'];
		// add updated fields to update list
		for (var i = 0; i < infoFields.length; i++) {
			if (this.props[infoFields[i]] !== this.state[infoFields[i]]) {
				updates[infoFields[i]] = this.props[infoFields[i]];
			}
		}

		if (Object.keys(updates).length > 0 && this.state.amountdue !== thousand(this.getTotal())) {
			// update state only if there are field updated
			this.setState(updates);
		}
	}
}

const mapStateToProps = ({ clients, items, bankAccounts, currentBusiness, userInfo }) => ({
	clients: clients.data || [],
	items: items.data || [],
	bankAccounts: bankAccounts.data || [],
	currentBusiness: currentBusiness.data,
	userInfo: userInfo.data,
});

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			getAllClients: ActionCreators.getAllClients,
			getAllItems: ActionCreators.getAllItems,
			addNewBankAccount: ActionCreators.addNewBankAccount,
			showSnackbar: ActionCreators.showSnackbar
		},
		dispatch
	);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(InvoicePaper));
