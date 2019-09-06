import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import Button from '../presentation/Button';
import Input from '../presentation/Input';
import Dropdown from '../presentation/Dropdown';
import DashboardSection from '../presentation/DashboardSection';
import Select from '../presentation/Select';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import Flatpickr from 'react-flatpickr';
import ClientsCreate from './ClientsCreate';
import ItemsCreate from './ItemsCreate';
import BankAdd from './BankAdd';
import { thousand } from '../../helpers/Misc';
import { CURRENCIES_SIGNS } from '../../configs/data.config';
import moment from 'moment';


const FONT_STYLES = ['avenir-next', 'lato', 'roboto'];

class ReceiptPaper extends React.Component {
	static propTypes = {
		invoiceNumber: propTypes.string,
		image: propTypes.string,
		client: propTypes.number,
		itemsList: propTypes.arrayOf(propTypes.object),
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
		onCancel: propTypes.func,
		currency: propTypes.string,
		onPaymentChange: propTypes.func,
	};

	static defaultProps = {
		mode: 'read',
		template: 'simple',
		themeColor: 'default',
		fontStyle: 'avenir-next',
        itemsList: [],
		currency: 'usd',
	};

	onSubmit = (shareType) => {
		let payload = {
			invoicenumber: this.state.invoiceNumber,
			items: this.state.itemsList.map(item => {
				return {
					description: item.description,
					invoiceid: 0,
					price: Number(item.price),
					quantity: item.quantity,
					productid: item.productid,
				};
			}),
			clientid: Number(this.state.client),
			businessid: this.props.currentBusiness.id,
			userid: this.props.userInfo.userid,
			description: this.state.description,
			subtotal: parseInt(this.getSubtotal()),
			discount: '',
			paymenttype: '',
			amountdue: 0,
			deposit: 0,
			sendstyle: '',
			invoicestyle: '',
			invoicetype: 'receipt',
			due_date: this.state.issueDate,
			personalmessage: '',
			paymentlink: '',
			invoicestatus: '',
			font: this.state.fontStyle,
			color: this.state.themeColor,
			requireddeposit: 0,
			isdeleted: 0,
			date_created: this.state.issueDate,
		};

		this.props.onSave(payload, shareType);
	};

	constructor(props) {
		super(props);
		this.state = {
			invoiceNumber: null,
			itemsList: [],
			tax: '',
			client: null,
			banks: [],
			addNew: null,
			bankAccount: null,
			ready: false,
			isDepositRequired: false,
			depositRequired: '0.00',
			image: null,
			subtotal: 0,
			description: '',
			dueDate: '',
			issueDate: '',
			selectedItems: [],
			addNewItem: null,
			selectedItemMetaData: [],
			shareType: '',
			sendViaWhatsAppDialog: false,
		};
	}

	getTotal = () => {
		let total = 0;
		let tax = parseFloat(this.state.tax);
		let taxAmount = 0;

		// add subtotal
		total = total + this.getSubtotal();

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

	componentWillReceiveProps(nextProps) {
		let placeholderMetaData = [];
		for (let i = 0; i <= nextProps.items.length; i++) {
			placeholderMetaData.push({ description: '', quantity: '', price: '' });
		}
		this.setState({
			client: `${nextProps.client}` || null,
			selectedItemMetaData: [...placeholderMetaData],
		});
	}

	componentDidMount() {
		this.setState(
			{
				client: this.props.client || null,
				bankAccount: this.props.bankAccount || null,
				notes: this.props.notes || '',
				// itemsList: this.props.itemsList.length > 0 ? [...this.props.itemsList] : [Object.assign({}, NEW_LINE)],
				tax: parseFloat(this.props.tax) ? `${parseFloat(this.props.tax).tofixed(2)}` : '0.00',
				depositRequired: parseFloat(this.props.depositRequired)
					? `${parseFloat(this.props.depositRequired).tofixed(2)}`
					: '0.00',
				themeColor: this.props.themeColor || 'default',
				invoiceNumber: this.props.invoiceNumber || null,
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
			image,
			bank,
			mode,
			fontStyle,
			sender,
			issueDate,
			dueDate,
			onCancel,
			onSave,
			onSend,
			getAllClients,
			getAllItems,
			currency,
		} = this.props;

		const {
			client,
			itemsList,
			tax,
			addNew,
			themeColor,
			invoiceNumber,
			template,
			shareType
		} = this.state;

		let clients = this.getSelectClientsList();
		let items = this.getSelectItemsList();
		let variantClassNames = '';
		variantClassNames += ` invoice-paper-${themeColor || ''}`;
		variantClassNames += ` invoice-paper-template-${template || ''}`;

		return (
			<div className="h-full mt-8 bg-white">
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
								addNew: null,
							})
						}
					/>
				)}

				<div className="px-2">
					<div className="mb-4">
						{/* <span className='text-brand-blue font-bold font-lg' onClick={onCancel}>x</span> */}
						<div className="-ml-12">
							<Button variant="link-primary" type="button" className="py-2 px-5" onClick={onCancel}>
								<span className="font-bold text-2xl">&times;</span>
							</Button>
							<span className='mr-12' />
							<Button variant="link-gray" type="button" className="py-2 px-5" onClick={this.onSubmit}>
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
								onChange={event => this.handleChange(event)}
								options={['Send to email', 'Send to WhatsApp', 'Save']}
							/>
							{/* <Button variant="link-primary" type="button" className="py-2 px-4">
								Send
							</Button> */}
							{/* <span className='text-base font-medium mr-8'>Preview</span>
							<span className='text-base font-medium text-brand-blue'>Send</span> */}
						</div>
					</div>
                    <div className='text-center text-brand-blue mb-4 text-xl font-bold'>Sales Receipt</div>
					<div className="flex flex-row mb-2 border-b border-brand-blue md:hidden">
						<div className="w-1/2">
							<p className="text-brand-blue font-semibold mb-1">Billed To</p>
							<Select
								setRef={ref => (this.clientsSelect = ref)}
								options={clients}
								onChange={e =>
									this.setState({
										client: e.target.value !== 'add-new' ? e.target.value : client,
										addNew: e.target.value === 'add-new' ? 'client' : addNew,
									})
								}
								value={client || ''}
							/>
							<p className="text-brand-blue font-semibold mt-4 mb-1">Paid With</p>
							<Select
								setRef={ref => (this.payModeSelect = ref)}
								options={['Cash', 'Cheque', 'Online', 'Bank Transfer']}
								onChange={e =>
									console.log(e.target.value)
								}
								value=''
							/>
						</div>
						<div className="w-1/2 text-right">
							<div className="mb-8">
								<p className="text-brand-blue font-semibold mb-1">Receipt number</p>
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
								<p className="text-brand-blue font-semibold mb-1">Date of Issue</p>
								<span className="text-black">
									<Flatpickr
										options={{
											dateFormat: 'd/m/Y',
											disableMobile: true,
											defaultDate: moment(new Date()).format('DD/MM/YY')
										}}
										onReady={() =>
											this.setState({
												issueDate: moment(new Date()).format('DD/MM/YYYY'),
											})
										}
										onValueUpdate={([val]) =>
											this.setState({
												issueDate: moment(val).format('DD/MM/YYYY'),
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
							<span className="text-brand-blue font-semibold">Description</span>
							<span className="float-right text-brand-blue font-semibold">Total Amount</span>
						</div>
						<div>
							{itemsList.map(this.renderItem.bind(this))}
							<span className="text-grey text-base" onClick={this.addItem.bind(this)}>
								<i className="icon ion-md-add-circle-outline text-green" /> Add new line
							</span>
						</div>
					</div>
					<div className="flex flex-row mb-2">
						<div className="w-1/3" />
						<div className="w-2/3 text-right">
							<div className="text-black mb-2">
								<span className="mr-12">Subtotal</span>
								<span className="text-right">{thousand(this.getSubtotal())}</span>
							</div>
							<div className="text-black mb-2">
								<span className="mr-12">
									Add discount <i className="icon ion-md-add-circle-outline text-green" />
								</span>
								<span className="text-right">------</span>
							</div>
							<div className="text-black mb-2">
								<span className="mr-12">Tax</span>
								<span className="text-right">
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
									/>
								</span>
							</div>
							<div className="text-black mb-3 py-2 border-b-2 border-t-2 border-brand-blue">
								<span className="mr-20 text-brand-blue font-semibold">Amount Total {`(${CURRENCIES_SIGNS[currency] || '$'})`}</span>
								<span className="float-right">{`${CURRENCIES_SIGNS[currency] || '$'}${thousand(
									this.getTotal()
								)}`}</span>
							</div>
							<div className="text-black text-left mb-2">
                                <span className="mr-20 text-green font-semibold">Amount Paid {`(${CURRENCIES_SIGNS[currency] || '$'})`}</span>
								<span className="float-right">{`${CURRENCIES_SIGNS[currency] || '$'}${thousand(
									this.getTotal()
								)}`}</span>
							</div>
						</div>
					</div>
				</div>
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
											productid: selected.id
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

	handleItemFieldChange(e, index, field) {
		let { selectedItemMetaData } = this.state;
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
	}

	handleSendOption(option) {}

	getSelectClientsList() {
		const { clients } = this.props;
		let list = [{ '': 'Select Customer' }, { 'add-new': '+ Add new' }];

		if (!clients || clients.constructor !== Array) {
			return list;
		}

		for (var i = 0; i < clients.length; i++) {
			list.push({
				[clients[i]['id']]: clients[i]['companyname'],
			});
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
			addNew: null,
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

	handleChange(e) {
		let shareType = null
		if (e.target.value === 'Send to email') {
			shareType = 'email'
		} else if (e.target.value === 'Send to WhatsApp') {
			shareType = 'whatsApp'
		}
		this.onSubmit(shareType)
	}

	handleChangeBankAccount(bankAccount) {
		if (this.props.onPaymentChange) {
			this.props.onPaymentChange({
				bankAccount,
			});
		}
	}

	handleOnInfochange(prevProps) {
		if (!prevProps) return;

		// updates list
		let updates = {};

		// list of info fields
		const infoFields = ['invoiceNumber', 'themeColor', 'template', 'fontStyle', 'bankAccount'];

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

const mapStateToProps = ({ clients, items, currentBusiness, userInfo }) => ({
	clients: clients.data || [],
	items: items.data || [],
	currentBusiness: currentBusiness.data,
	userInfo: userInfo.data,
});

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			getAllClients: ActionCreators.getAllClients,
			getAllItems: ActionCreators.getAllItems
		},
		dispatch
	);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(ReceiptPaper));
