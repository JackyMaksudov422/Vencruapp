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
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import Flatpickr from 'react-flatpickr';
import ClientsCreate from './ClientsCreate';
import BankAdd from './BankAdd';
import { thousand } from '../../helpers/Misc';
import { CURRENCIES_SIGNS } from '../../configs/data.config';
import moment from 'moment';

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
		items: propTypes.arrayOf(propTypes.object),
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
		items: [Object.assign({}, NEW_LINE)],
		currency: 'usd',
	};

	onSubmit = () => {
		// let data = Object.assign({}, this.state);
		let payload = {
			invoicenumber: this.state.invoiceNumber,
			items: this.state.items,
			clientid: Number(this.state.client),
			businessid: this.props.currentBusiness.id,
			userid: this.props.userInfo.userid,
			image: this.state.image,
			description: this.state.description,
			subtotal: this.state.subtotal,
			discount: '',
			paymenttype: '',
			amountdue: parseFloat(this.getTotal()),
			deposit: Number(this.state.depositRequired),
			sendstyle: '',
			invoicestyle: '',
			due_date: this.state.dueDate,
			personal_message: '',
			paymentlink: '',
			invoicestatus: '',
			font: this.state.fontStyle,
			color: this.state.themeColor,
		};

		this.props.onSave(payload);
	};

	constructor(props) {
		super(props);
		this.state = {
			invoiceNumber: null,
			items: [],
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
		this.setState({
			client: `${nextProps.client}` || null,
		});
	}

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
				client: this.props.client || null,
				bankAccount: this.props.bankAccount || null,
				notes: this.props.notes || '',
				items: this.props.items.length > 0 ? [...this.props.items] : [Object.assign({}, NEW_LINE)],
				tax: parseFloat(this.props.tax) ? `${parseFloat(this.props.tax).tofixed(2)}` : '0.00',
				depositRequired: parseFloat(this.props.depositRequired)
					? `${parseFloat(this.props.depositRequired).tofixed(2)}`
					: '0.00',
				themeColor: this.props.themeColor || 'default',
				invoiceNumber: this.props.invoiceNumber || null,
				ready: true,
			},
			() => {
				// initialist clients list
				if (this.props.clients.length < 1) {
					this.props.getAllClients();
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
			currency,
		} = this.props;

		const {
			client,
			bankAccount,
			items,
			tax,
			addNew,
			notes,
			themeColor,
			invoiceNumber,
			template,
			isDepositRequired,
			depositRequired,
		} = this.state;

		let clients = this.getSelectClientsList();
		let bankAccounts = this.getSelectBanksList();
		let variantClassNames = '';
		variantClassNames += ` invoice-paper-${themeColor || ''}`;
		variantClassNames += ` invoice-paper-template-${template || ''}`;

		return (
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
								<Button variant="link-gray" type="button" className="pv13 ph20" onClick={onCancel}>
									Cancel
								</Button>

								<Button variant="primary" type="button" onClick={this.onSubmit} className="pv13 ph20">
									Save
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
											<span className="mr20 font-light text-white">Send</span>
											<i className="icon ion-md-more" />
										</span>
									}
								/>
							</div>
						}
					/>
				)}

				<header className="invioce-paper-heading">
					<div>
						<div className="row justify-content-between mb50">
							<div className="col-md-4">
								<Dropzone
									dimension="16:9"
									image={this.state.image}
									onChange={this.onImageChange}
									onCancel={() => {}}
								/>
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
								<Select
									className="invoice-select"
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
											}}
											onValueUpdate={([val]) =>
												this.setState({
													issueDate: moment(val).format('DD/MM/YY'),
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
											}}
											onValueUpdate={([val]) => {
												return this.setState({
													dueDate: moment(val).format('DD/MM/YY'),
												});
											}}
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
						{items.map(this.renderItem.bind(this))}
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
									<h4 className="text-black normal-font text-right pull-right mt0">
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
									<div className="spanned">
										<h4
											className="text-black
	        									normal-font text-right 
	        									pull-right mv0
	        									tax-field
	        								"
										>
											<span className="mr20">Tax</span>
											<input
												className="seamless-input 
			        								text-right w150
			        								text-black normal-font 
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
									<h3 className="text-black light-font mb30">Direct Bank Transfer</h3>
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

								<div className="col-md-4">
									<h3 className="text-black light-font mb30">Online Bank Or Credit Card Payments</h3>
									<Button block size="sm" className="invoice-button" variant="primary">
										Connect Online Payments
									</Button>
								</div>
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
		);
	}

	renderItem(item, index) {
		const { items } = this.state;
		let totalCost = parseFloat(item.price) * parseInt(item.quantity);
		return (
			<div className="invoice-paper-item" key={index}>
				<div>
					<div className="row">
						<div className="col-md-6">
							<Input
								className="invoice-input"
								style={{ width: '100%' }}
								// label="Item description"
								value={item.description}
								placeholder="Item description"
								onChange={e => this.handleItemFieldChange(e, index, 'description')}
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
				{this.props.mode == 'write' && items.length >= 2 && (
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
		let items = [...this.state.items];
		if (items[itemIndex] !== undefined) {
			items.splice(itemIndex, 1);
			this.setState({
				items: items,
			});
		}
	}

	addItem() {
		let items = [...this.state.items];
		let item = {
			description: '',
			price: '',
			quantity: '',
		};
		items.push(item);
		this.setState({
			items: items,
		});
	}

	getSubtotal() {
		let items = [...this.state.items];
		let subtotal = 0;
		for (var i = 0; i < items.length; i++) {
			if (parseInt(items[i]['price']) * parseInt(items[i]['quantity'])) {
				subtotal = subtotal + parseInt(items[i]['price']) * parseInt(items[i]['quantity']);
			}
		}
		return parseFloat(subtotal).toFixed(2);
	}

	handleItemFieldChange(e, index, field) {
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

		let items = [...this.state.items];
		if (items[index] && items[index][field] !== undefined) {
			items[index][field] = e.target.value;
			this.setState({
				items: items,
			});
		}

		if (field == 'description') {
			return this.setState({
				description: e.target.value,
			});
		}

		if (field === 'subtotal') {
			return this.setState({
				subtotal: e.target.value,
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

	handleBankCreated(bankAccount) {
		this.setState(
			{
				addNew: null,
			},
			() => this.props.addNewBankAccount(bankAccount)
		);
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

const mapStateToProps = ({ clients, bankAccounts, currentBusiness, userInfo }) => ({
	clients: clients.data || [],
	bankAccounts: bankAccounts.data || [],
	currentBusiness: currentBusiness.data,
	userInfo: userInfo.data,
});

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			getAllClients: ActionCreators.getAllClients,
			addNewBankAccount: ActionCreators.addNewBankAccount,
		},
		dispatch
	);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(InvoicePaper));
