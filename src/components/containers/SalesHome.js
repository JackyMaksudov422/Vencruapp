import * as React from 'react';
import withRouter from 'react-router-dom/withRouter';
import { connect } from 'react-redux';
import { STORAGE_KEYS } from '../../configs/storage.config';
import PlainCard from '../presentation/PlainCard';
import Typography from '../presentation/Typography';
import Button from '../presentation/Button';
import { storageGet, storageStore } from '../../helpers/Storage';
import Link from 'react-router-dom/Link';
import SalesSummary from '../presentation/SalesSummary';
import DashboardSection from '../presentation/DashboardSection';
import RecentInvoices from '../containers/RecentInvoices';
import Table from '../presentation/Table';
import TableHead from '../presentation/TableHead';
import TableBody from '../presentation/TableBody';
import Checkbox from '../presentation/Checkbox';
import TableRow from '../presentation/TableRow';
import TableCell from '../presentation/TableCell';
import find from 'lodash/find';
import { ADD_PAYMENT, GET_INVOICES, DELETE_INVOICE, CANCEL_INVOICE } from '../../configs/api.config';
import { thousand } from '../../helpers/Misc';
import Request from '../../helpers/Request';
import Dropdown from '../presentation/Dropdown';
import OverlayProgress from '../presentation/OverlayProgress';
import isEqual from 'lodash/isEqual';
import { ActionCreators } from '../../data/actionCreators';
import { bindActionCreators } from 'redux';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import Input from '../presentation/Input';
import PaymentAdd from '../containers/PaymentAdd';
import { CURRENCIES_SIGNS } from '../../configs/data.config';
import MessageParser from '../../helpers/MessageParser';
import moment from 'moment';
let itemsInvoices = [];

let Template = ({
	fn, 
	currentBusiness, 
	isFetching, 
	list,
	allRecords,
	selected, 
	selectAll, 
	showDateFilter, 
	sortOptions, 
	filter, 
	pagination, 
	filterForm, 
	showWelcomeCard,
	showPaymentForm,
	paymentFormData
}) => (
	<div className="app-authenticated-body vc-sales-home">
		<DashboardSection>
			{allRecords && allRecords.length < 1 && !isFetching && (
				<PlainCard
					collapsable
					className="text-center"
					onCollapse={() => storageStore(STORAGE_KEYS.SALES_WELCOME_CARD_CLOSED, 1)}
				>
					<Typography align="center" variant="active" className="mb40" size="lg">
						Grow your business by sending invoices
					</Typography>
					<img src={require('../../assets/Know_Cus.png')} style={{ maxWidth: 100 }} alt="icon" />
					<Typography className="spanned mb20 mt20">
						Create and send professional{` `}
						invoices and get paid faster{` `}
						by accepting online payment.
					</Typography>
					<div className="spanned mt20">
						<Link to="/sales/create-invoice" className="vc-button vc-button-primary">
							Create Invoice
						</Link>
						{/* <Link to="/sales/create-receipt" className="vc-button vc-button-primary">
							Create Receipt
						</Link> */}
					</div>

					<div className="spanned mb20" />
				</PlainCard>
			)}
		</DashboardSection>

		{/* invoices summary */}
		{currentBusiness && allRecords && ((isFetching && allRecords.length < 1) || (allRecords.length > 0)) && 
			<SalesSummary businessId={currentBusiness.id} currencySign={CURRENCIES_SIGNS[currentBusiness.currency]} />
		}

		{/* recent invoices */}
		<div className="spanned">
			<div className="row">
				<div className="col-md-6">
					<RecentInvoices title="Recent Overdue" status="overdue" />
				</div>
				<div className="col-md-6">
					<RecentInvoices title="Recent Unpaid Invoices" status="not-paid" />
				</div>
			</div>
		</div>

		{/* date filter dialog */}
		{currentBusiness && showDateFilter && (
			<Dialog
				open={showDateFilter}
				onClose={() => fn.dismissFilterDialog()}
				disableEscapeKeyDown={false}
				disableBackdropClick={false}
				transitionDuration={200}
				aria-labelledby="clients-filter-alert-dialog-title"
				aria-describedby="clients-filter-alert-dialog-description"
				className="clients-filter-alert-dialog"
			>
				<DialogTitle
					id="clients-filter-alert-dialog-title"
					className="clients-filter-alert-dialog-title"
				>
					Filter By Date
				</DialogTitle>
				<DialogContent className="ph25">
					<div className="row mt40">
						<div className="col-md-6 mb30">
							<Input
								size="sm"
								type="date"
								label="From"
								value={filterForm.fromDate}
								onChange={event => fn.handleFilterInputChange('fromDate', event)}
							/>
						</div>
						<div className="col-md-6 mb30">
							<Input
								size="sm"
								type="date"
								label="To"
								value={filterForm.toDate}
								onChange={event => fn.handleFilterInputChange('toDate', event)}
							/>
						</div>
					</div>
				</DialogContent>
				<DialogActions className="clients-filter-alert-dialog-actions text-center pb20 ph15">
					<Button
						size="sm"
						type="button"
						variant="link-gray"
						onClick={() => fn.dismissFilterDialog()}
					>
						Close
					</Button>
					<Button size="sm" type="button" variant="primary" onClick={() => fn.submitDateFilter()}>
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		)}

		{/* list of invoices */}
		{currentBusiness && allRecords && ((isFetching && allRecords.length < 1) || (allRecords.length > 0)) && (
			<DashboardSection
				title={
					<div>
						<span className="mr30">All Invoices</span>
						<Dropdown
							type="button"
							variant="primary"
							size="sm"
							classes={{  }}
							className='vc-button-small'
							label="Create New ..."
							align="left"
							onChange={event => fn.handleCreateNewAction(event)}
							options={['Invoice', 'Sales Receipt']}
						/>
						{/* <Link
							className="vc-button 
								vc-button-primary
								vc-button-small
							"
							to="/sales/create-invoice"
						>
							Create Invoice
						</Link> */}
					</div>
				}
			>
				<div className="spanned h30">&nbsp;</div>
					<PaymentAdd
						show={showPaymentForm}
						subtotal={paymentFormData.subtotal}
						deposit={paymentFormData.amountdue}
						onDismiss={fn.onPaymentFormDismissed}
						onCancel={fn.onPaymentFormDismissed}
						onSubmit={fn.handlePaymentFormSubmit}
					/>
				<Table
					sortOptions={sortOptions}
					filterOptions={['By Date']}
					handleControlSearchOnChange={value => fn.handleSearchChange(value)}
					onControlSortChange={value => fn.handleSortChange(value)}
					onControlFilterChange={value => fn.handleFilterChange(value)}
					defaultSearch={filter.search}
					pagination={pagination}
					selectedItems={selected}
					onPaginationNav={nav => fn.handlePaginationNav(nav)}
					controlLeftActions={[
						<Dropdown
							noArrow
							options={['Export To Excel']}
							label={
								<span className="toggler-label">
									Actions&nbsp;<i className="material-icons">keyboard_arrow_down</i>
								</span>
							}
							variant="gray"
							disabled={selected.length < 1}
							onChange={event => fn.handleActionSelect(selected, event.target.value)}
							classes={{
								toggler: 'vc-action-toggler',
							}}
						/>,
						<Button
							variant="link-primary"
							className="delete-button"
							onClick={() => fn.handleTableCancelClick(selected)}
							disabled={selected.length < 1}
						>
							Cancel
						</Button>,
					]}
				>
					{/* table head */}
					<TableHead>
						<TableRow type="th">
							<TableCell className="text-left">
								<Checkbox
									square
									checked={selectAll}
									onChange={() => fn.handleSelectall()}
								/>
							</TableCell>
							<TableCell showOnMobile mobileOnly>
								Basic Info
							</TableCell>
							<TableCell className="text-left">
								Client/Invoice Number
							</TableCell>
							<TableCell className="text-left">
								Issue Date
							</TableCell>
							<TableCell className="text-left">
								Due Date
							</TableCell>
							<TableCell className="text-left">
								Amount/Status
							</TableCell>
							<TableCell showOnMobile className="text-left">
								Total Outstanding
							</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{/* table body */}
						{list &&
							list.constructor === Array &&
							list.map((item, index) => (
								<TableRow withSeparator key={index}>
									<TableCell>
										<Checkbox
											checked={selected.indexOf(item.id) != -1}
											square
											value={item.id}
											onChange={() => fn.handleInvoiceSelect(item.id)}
										/>
									</TableCell>
									<TableCell 
										onClick={() => {
												fn.handleInvoiceClicked(item.id);
											}} 
										showOnMobile mobileOnly>
										<p className="text-base mb-1 text-black">{`${item.client.firstname} ${item.client.lastname}`}</p>
										<p className="text-sm mb-1 text-black">{moment(item.date_created).format('DD/MM/YYYY')}</p>
										<p className="text-sm text-gray">{item.invoicenumber}</p>
									</TableCell>
									<TableCell
										onClick={() => {
											fn.handleInvoiceClicked(item.id);
										}} 									
									>
										<h4 className="mt0 normal-font mb5 text-black">{`${item.client.firstname} ${item.client.lastname}`}</h4>
										<h5 className="mv0 normal-font text-gray">{item.invoicenumber}</h5>
									</TableCell>
									<TableCell
										onClick={() => {
											fn.handleInvoiceClicked(item.id);
										}} 									
									>
										<span className="text-black">{moment(item.issue_date).format('DD/MM/YYYY')}</span>
									</TableCell>
									<TableCell
										onClick={() => {
											fn.handleInvoiceClicked(item.id);
										}} 									
									>
										<span className="text-black">{moment(item.due_date).format('DD/MM/YYYY')}</span>
									</TableCell>
									<TableCell
										onClick={() => {
											fn.handleInvoiceClicked(item.id);
										}} 								
									>
										<span className="text-black mr10">
											{`${CURRENCIES_SIGNS[currentBusiness.currency] || '$'}${thousand(
												parseFloat(item.amountdue).toFixed(2)
											)}`}
										</span>
										{item.invoicestatus === 'fully paid' && (
											<span className="invoice-status invoice-status-fully-paid">
												Paid
											</span>
										)}
										{item.invoicestatus === 'deposit paid' && (
											<span className="invoice-status invoice-status-deposit-paid">
												Deposit Paid
											</span>
										)}
										{item.invoicestatus === 'not paid' && (
											<span className="invoice-status invoice-status-due">Not Paid</span>
										)}
										{/* {item.invoicestatus === 'overdue' && (
											<span className="invoice-status invoice-status-overdue">
												Overdue
											</span>
										)} */}
										{item.invoicestatus === 'Cancelled' && (
											<span className="invoice-status invoice-status-cancelled">
												Cancelled
											</span>
										)}
										{item.invoicestatus === 'draft' && (
											<span className="invoice-status invoice-status-draft">draft</span>
										)}
									</TableCell>
									<TableCell
										onClick={() => {
											fn.handleInvoiceClicked(item.id);
										}}  
										showOnMobile>
											<span className="text-lg text-brand-blue md:text-sm md:text-black">
												{`${CURRENCIES_SIGNS[currentBusiness.currency] ||
													'$'}${thousand(
													parseFloat(item.amountdue - item.amountpaid).toFixed(2)
												)}`}
											</span>
											<div className='md:hidden'>
												{item.invoicestatus === 'fully paid' && (
													<span className="invoice-status invoice-status-fully-paid">
														Fully Paid
													</span>
												)}
												{item.invoicestatus === 'not paid' && (
													<span className="invoice-status invoice-status-due">Not Paid</span>
												)}
												{item.invoicestatus === 'deposit paid' && (
													<span className="invoice-status invoice-status-deposit-paid">
														Deposit Paid
													</span>
												)}
												{/* {item.invoicestatus === 'overdue' && (
													<span className="invoice-status invoice-status-overdue">
														Overdue
													</span>
												)} */}
												{item.invoicestatus === 'Cancelled' && (
													<span className="invoice-status invoice-status-cancelled">
														Cancelled
													</span>
												)}
												{item.invoicestatus === 'draft' && (
													<span className="invoice-status invoice-status-draft">draft</span>
												)}
											</div>
									</TableCell>
									<TableCell>
										<div className="sales-total-outstanding">
											<Dropdown
												iconButton
												icon={<i className="material-icons">more_vert</i>}
												options={[
													'Mark as Paid',
													'Resend Receipt',
													'Cancel',
												]}
												align="right"
												variant="link-gray"
												onChange={e =>
													fn.handleInvoiceAction(item.id, e.target.value)
												}
											/>
										</div>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
				{isFetching && <OverlayProgress />}
			</DashboardSection>
		)}

		{currentBusiness && (
			<div className="spanned mv15 text-center">
				<span className='mr-8'><Link to="/sales/drafts">Draft Invoices </Link></span>
				<Link to="/sales/cancelled">Cancelled Invoices</Link>
			</div>
		)}
	</div>
);

class SalesHome extends React.Component {
	constructor(props) {
		super(props);
		this.request = new Request();
		this.state = {
			showWelcomeCard: storageGet(STORAGE_KEYS.SALES_WELCOME_CARD_CLOSED) ? false : true,
			showPaymentForm: false,
			paymentFormData: {},
			filter: {
				page: this.request.get('page', 1),
				fromDate: this.request.get('fromDate', null),
				toDate: this.request.get('toDate', null),
				sortBy: this.request.get('sortby', 'date_created'),
				sortOrder: this.request.get('sortOrder', 'desc'),
				search: this.request.get('search', null),
			},
			list: [],
			allRecords: [],
			ready: false,
			selected: [],
			deletingList: [],
			showDateFilter: false,
			filterForm: {
				fromDate: this.conformToInputDate(this.request.get('fromDate', '')),
				toDate: this.conformToInputDate(this.request.get('toDate', '')),
			},
			pagination: {
				currentPage: 1,
				total: 0,
				perPage: 10,
			},
			isFetching: false,
		};
	}

	componentDidMount() {
		if (this.props.userInfo) {
			this.fetch();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (!isEqual(prevProps.userInfo, this.props.userInfo)) {
			if (this.props.userInfo && !this.state.ready) {
				this.fetch();
			}
		}

		if (!isEqual(prevState.filter, this.state.filter) && !prevState.isFetching) {
			this.handleFilterChanged(this.state.filter);
		}
	}

	componentWillReceiveProps(nextProps) {
		return nextProps.allChecked.checked ? this.handleSelectall() : this.setState({ selected: [] });
	}

	render() {
		return  <Template {...this.prps()} fn={this.fn()} />;
	}

	fn = () => ({
		handleInvoiceClicked: invoiceId => this.handleInvoiceClicked(invoiceId),
		handleInvoiceSelect: invoiceId => this.handleInvoiceSelect(invoiceId),
		handleSelectall: () => this.handleSelectall(),
		clearSelected: () => this.clearSelected(),
		handleInvoiceAction: (invoiceId, action) => this.handleInvoiceAction(invoiceId, action),
		isDeleting: invoiceId => this.isDeleting(invoiceId),
		handleTableDeleteClick: selectedClients => this.handleTableDeleteClick(selectedClients),
		handleSearchChange: value => this.handleSearchChange(value),
		handleSortChange: value => this.handleSortChange(value),
		handleFilterChange: value => this.handleFilterChange(value),
		handlePaginationNav: value => this.handlePaginationNav(value),
		dismissFilterDialog: () => this.dismissFilterDialog(),
		submitDateFilter: () => this.submitDateFilter(),
		handleFilterDialogClose: () => this.handleFilterDialogClose(),
		handleFilterInputChange: (field, event) => this.handleFilterInputChange(field, event),
		handlePaymentFormSubmit: data => this.submitPayment(data),
		onPaymentFormDismissed: () => this.onPaymentDismissed(),
		handleCreateNewAction: (event) => this.handleCreateNewAction(event),
		handleActionSelect: (selected, action) => this.handleActionSelect(selected, action),
	});

	prps = () => ({
		userInfo: this.props.userInfo.data,
		currentBusiness: this.props.currentBusiness,
		isFetching: this.state.isFetching,
		allRecords: this.state.allRecords,
		list: this.state.list,
		selected: this.state.selected,
		selectAll: this.allInvoicesAreSelected(),
		sortOptions: this.sortOptions(),
		filter: this.state.filter,
		pagination: this.state.pagination,
		showDateFilter: this.state.showDateFilter,
		filterForm: this.state.filterForm,
		showWelcomeCard: this.state.showWelcomeCard,
		showPaymentForm: this.state.showPaymentForm,
		paymentFormData: this.state.paymentFormData
	});


	submitPayment = (data) => {
		data.InvoiceId = this.state.paymentFormData.id 

        ADD_PAYMENT(data).then((res) => {
			this.props.showSnackbar('Payment Added!', {variant: 'success'});
			this.setState({
				showPaymentForm: false
			})
			this.fetch()
        }).catch((err) => {
			this.props.showSnackbar(err.toString(), {variant: 'error'});
        })
	}

	onPaymentDismissed = () => {
        this.setState({
            showPaymentForm: false
        })
	}
	
	handleInvoiceClicked = invoiceId => {
		this.props.history.push(`sales/i/?invoiceid=${invoiceId}`);
	};

	handleCreateNewAction(e){
		if(e.target.value == 'Sales Receipt'){
			this.props.history.push(`sales/create-receipt`);
		}else{
			this.props.history.push(`sales/create-invoice`);
		}
	}

	handleInvoiceAction(invoiceId, action) {
		const { list } = this.state;
		let invoice;
		if (list) {
			invoice = list.find(item => item.id === invoiceId);
		}
		if (!invoice) {
			return;
		}

		switch (action) {
			case 'Edit':
				this.props.history.push(`invoices/${invoiceId}/edit`);
				break;
			case 'Business Card':
				this.props.history.push(`invoices/${invoiceId}/business-card`);
				break;
			case 'Mark as Paid':
				this.setState({
					showPaymentForm: true,
					paymentFormData: {
						id: invoice.id,
						amountdue: invoice.amountdue - invoice.amountpaid,
						subtotal: invoice.amountdue - invoice.amountpaid
					}
				})
				break;
			case 'Resend Receipt':
				break;
			case 'Cancel':
				this.promptCancelInvoices(invoiceId);
				break;
			default:
				// do nothing
				break;
		}
	}

	handleSelectall() {
		const { list, selected } = this.state;
		if (this.allInvoicesAreSelected()) {
			this.setState({
				selected: [],
			});
			return;
		}
		let selectList = [];
		for (var i = 0; i < list.length; i++) {
			if (!list[i]['id'] || this.isDeleting(list[i]['id'])) {
				continue;
			}
			selectList.push(list[i]['id']);
		}
		this.setState({
			selected: selectList,
		});
	}

	handleInvoiceSelect(invoiceId) {
		let selected = [...this.state.selected];

		if (selected.indexOf(invoiceId) === -1) {
			if (!this.isDeleting(invoiceId)) {
				selected.push(invoiceId);
			}
		} else {
			selected.splice(selected.indexOf(invoiceId), 1);
		}

		this.setState({
			selected: selected,
		});
	}

	allInvoicesAreSelected() {
		return (
			this.state.selected.length > 0 &&
			this.state.list.length > 0 &&
			this.state.selected.length >= this.state.list.length
		);
	}

	fetch() {
		const { currentBusiness } = this.props;

		const { pagination, filter } = this.state;

		this.setState(
			{
				isFetching: true,
			},
			() => {
				GET_INVOICES({
					businessId: currentBusiness ? currentBusiness.id : null,
					page: filter.page || 1,
					fromDate: filter.fromDate || undefined,
					toDate: filter.toDate || undefined,
					sortBy: filter.sortBy || undefined,
					sortOrder: filter.sortOrder || undefined,
					searchQuery: filter.search,
					limit: 10,
					status: 'all'
				})
				.then(response => {
					console.log(response)
					console.log("here")
					this.setState({
						isFetching: false,
						list: response.invoices,
						pagination: Object.assign({}, pagination, {
							currentPage: response.currentpage,
							pageTotal: response.pagetotal,
							total: response.total,
							pageStart: response.currentpage * pagination.perPage - (pagination.perPage - 1),
							pageEnd: response.currentpage * pagination.perPage,
						}),
						selected: [],
						selectAll: false,
					});

					if (!filter.search) {
						this.setState({
							allRecords: response.invoices
						});
					}
				})
				.catch(error => {
					let errorMessage =
						(typeof error === 'string' && error.length > 0 && error) ||
						'An error occured while making your request..';
					this.props.showSnackbar(errorMessage, { variant: 'error' });
					this.setState({
						isFetching: false,
						page: this.state.page > 1 && this.state.page - 1,
					});
				});
			}
		);
	}

	conformToInputDate(date) {
		var d = new Date(date);
		return (d.getTime() && `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() + 1}`) || '';
	}

	promptCancelInvoices(invoiceId) {
		if (this.isDeleting(invoiceId)) {
			return;
		}
		if (invoiceId && invoiceId.constructor === Array && invoiceId.length < 1) {
			return;
		}
		this.props.showAlertDialog(
			``,
			`Are you sure you want to cancel the selected invoice${(invoiceId &&
				invoiceId.constructor === Array &&
				invoiceId.length >= 2 &&
				's') ||
				''}?`,
			[
				{ text: 'No', onClick: () => this.props.hideAlertDialog() },
				{ text: 'Yes, Cancel', onClick: () => this.doCancelInvoice(invoiceId), variant: 'destructive' },
			]
		);
	}

	doCancelInvoice(invoiceId) {
		if (this.isDeleting(invoiceId)) {
			return;
		}

		if (!this.prepCancelInvoicesData(invoiceId)) {
			return;
		}

		this.addToCancelList(invoiceId);

		this.setState({
			isFetching: true,
		});

		CANCEL_INVOICE(this.prepCancelInvoicesData(invoiceId))
			.then(() => {
				this.props.showSnackbar(`Invoice cancelled.`, { variant: 'success' });
				this.setState(
					{
						isFetching: false,
					},
					() => {
						this.fetch();

						if (this.recentlyAdded) {
							this.recentlyAdded.fetch();
						}

						if (this.quickStatistics) {
							this.quickStatistics.fetch();
						}
					}
				);
			})
			.catch(error => {
				let errorMessage = `Failed to cancel selected invoice(s).`;
				// if (typeof error === 'string' && error.trim().length > 0) {
				// 	errorMessage = error;
				// }
				this.props.showSnackbar(MessageParser(errorMessage), { variant: 'error' });
				this.setState({
					isFetching: false,
				});
			})
			// DELETE_INVOICE(this.prepCancelInvoicesData(invoiceId))
			// 	.then(() => {
			// 		this.props.showSnackbar(`Invoice(s) deleted.`, { variant: 'success' });

			// 		this.removeFromCancelList(invoiceId);

			// 		setTimeout(() => {
			// 			this.setState(
			// 				{
			// 					isFetching: false,
			// 				},
			// 				() => {
			// 					this.fetch();

			// 					if (this.recentlyAdded) {
			// 						this.recentlyAdded.fetch();
			// 					}

			// 					if (this.quickStatistics) {
			// 						this.quickStatistics.fetch();
			// 					}
			// 				}
			// 			);
			// 		}, 100);
			// 	})
			// 	.catch(error => {
			// 		let errorMessage = `Failed to delete selected invoice(s).`;
			// 		if (typeof error === 'string' && error.trim().length > 0) {
			// 			errorMessage = error;
			// 		}
			// 		this.props.showSnackbar(MessageParser(errorMessage), { variant: 'error' });
			// 		this.removeFromCancelList(invoiceId);
			// 		this.setState({
			// 			isFetching: false,
			// 		});
			// 	});
	}

	isDeleting(invoiceId) {
		if (invoiceId && invoiceId.constructor === Array) {
			for (var i = 0; i < invoiceId.length; i++) {
				if (this.state.deletingList.indexOf(invoiceId[i]) != -1) {
					return true;
				}
			}
			return false;
		}
		return this.state.deletingList.indexOf(invoiceId) != -1;
	}

	addToCancelList(invoiceId) {
		let deletingList = [].concat(this.state.deletingList);
		if (invoiceId && invoiceId.constructor === Array) {
			for (var i = 0; i < invoiceId.length; i++) {
				if (deletingList.indexOf(invoiceId[i]) === -1) {
					deletingList.push(invoiceId[i]);
				}
			}
			this.setState({
				deletingList: deletingList,
			});
			return;
		}

		deletingList.push(invoiceId);
		this.setState({
			deletingList: deletingList,
		});
	}

	removeFromCancelList(invoiceId) {
		let deletingList = [].concat(this.state.deletingList);
		if (invoiceId && invoiceId.constructor === Array) {
			for (var i = 0; i < invoiceId.length; i++) {
				if (deletingList.indexOf(invoiceId[i]) != -1) {
					deletingList.splice(deletingList.indexOf(invoiceId[i]), 1);
				}
			}
			this.setState({
				deletingList: deletingList,
			});
			return;
		}

		deletingList.splice(deletingList.indexOf(invoiceId), 1);
		this.setState({
			deletingList: deletingList,
		});
	}

	updateInvoicesList(invoiceInfo) {
		let list = [...this.state.list];
		let invoiceIndex = list.findIndex(item => item.id === invoiceInfo.id);
		if (invoiceIndex !== -1) {
			let invoiceInfoUpdate = Object.assign({}, list[invoiceIndex], invoiceInfo);
			list.splice(invoiceIndex, 1, invoiceInfoUpdate);
			this.setState({
				list: list,
			});
		}
	}

	handleTableCancelClick(selectedInvoices) {
		if (selectedInvoices && selectedInvoices.constructor === Array && selectedInvoices.length > 0) {
			this.promptCancelInvoices(selectedInvoices);
		}
	}

	prepCancelInvoicesData(invoiceId) {
		if (!invoiceId) {
			return;
		}

		let business = this.props.currentBusiness

		if (invoiceId.constructor === Array) {
			let list = [];

			for (var i = 0; i < invoiceId.length; i++) {
				if (typeof invoiceId[i] !== 'string' && typeof invoiceId[i] !== 'number') {
					continue;
				}
				list.push({
					invoiceid: invoiceId[i],
					businessid: business.id,
					userid: this.props.userInfo && this.props.userInfo.userid,
				});
			}

			return (list.length > 0 && { items: list }) || null;
		}

		if (typeof invoiceId === 'string' || typeof invoiceId === 'number') {
			return {
				invoiceid: invoiceId,
				businessid: business.id,
			};
		}

		return null;
	}

	handleSearchChange(search) {
		if (search.trim() === this.state.filter.search) {
			return;
		}
		this.setState({
			filter: Object.assign({}, this.state.filter, {
				search: search.trim(),
				page: 1,
			}),
		});
	}

	handleFilterChanged(filter) {
		if (filter && filter.constructor === Object && Object.keys(filter).length > 0) {
			let params = [];
			let filterFields = Object.keys(filter);
			for (var i = 0; i < filterFields.length; i++) {
				if (
					filter[filterFields[i]] === null ||
					filter[filterFields[i]] === undefined ||
					(typeof filter[filterFields[i]] === 'string' && filter[filterFields[i]].length < 1)
				) {
					continue;
				}
				params.push(`${filterFields[i]}=${encodeURIComponent(filter[filterFields[i]])}`);
			}
			this.props.history.push(`/sales${(params.length > 0 && '?' + params.join('&')) || ''}`);
		}
		this.fetch();
	}

	sortOptions() {
		// 'Newest to Old', 'Company Name A-Z', 'First Name A-Z', 'Total Paid(From highest)', 'Total Outstanding From highest'
		const { filter } = this.state;
		let options = [];
		// Add creation date option
		options.push(
			(filter.sortBy === 'date_created' && filter.sortOrder === 'desc' && 'Oldest to New') || 'Newest to Old'
		);
		// Add company name option
		options.push(
			(filter.sortBy === 'companyname' && filter.sortOrder === 'asc' && 'Company Name Z-A') || 'Company Name A-Z'
		);
		// Add person name option
		options.push(
			(filter.sortBy === 'firstname' && filter.sortOrder === 'asc' && 'First Name Z-A') || 'First Name A-Z'
		);
		// Add person name option
		options.push(
			(filter.sortBy === 'lastname' && filter.sortOrder === 'asc' && 'Last Name Z-A') || 'Last Name A-Z'
		);
		// Add total paid
		options.push(
			(filter.sortBy === 'totalpaid' && filter.sortOrder === 'desc' && 'Total Paid(from lowest)') ||
				'Total Paid(from highest)'
		);
		// Add total outstanding
		options.push(
			(filter.sortBy === 'totaloutstanding' && filter.sortOrder === 'desc' && 'Total Outstanding(from lowest)') ||
				'Total Outstanding(from highest)'
		);

		return options;
	}

	handleSortChange(option) {
		const { filter } = this.state;
		switch (option) {
			case 'Oldest to New':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'date_created',
						sortOrder: 'asc',
					}),
				});
				break;
			case 'Newest to Old':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'date_created',
						sortOrder: 'desc',
					}),
				});
				break;
			case 'Company Name Z-A':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'companyname',
						sortOrder: 'desc',
					}),
				});
				break;
			case 'Company Name A-Z':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'companyname',
						sortOrder: 'asc',
					}),
				});
				break;
			case 'First Name Z-A':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'firstname',
						sortOrder: 'asc',
					}),
				});
				break;
			case 'First Name A-Z':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'firstname',
						sortOrder: 'desc',
					}),
				});
				break;
			case 'Last Name Z-A':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'lastname',
						sortOrder: 'asc',
					}),
				});
				break;
			case 'Last Name A-Z':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'lastname',
						sortOrder: 'desc',
					}),
				});
				break;
			case 'Total Paid(from lowest)':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'totalpaid',
						sortOrder: 'asc',
					}),
				});
				break;
			case 'Total Paid(from highest)':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'totalpaid',
						sortOrder: 'desc',
					}),
				});
				break;
			case 'Total Outstanding(from lowest)':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'totaloutstanding',
						sortOrder: 'asc',
					}),
				});
				break;
			case 'Total Outstanding(from highest)':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'totaloutstanding',
						sortOrder: 'desc',
					}),
				});
				break;
		}
	}

	handleFilterInputChange(field, event) {
		let filterForm = this.state.filterForm || {};
		filterForm[field] = event.target.value;
		this.setState({
			filterForm: filterForm,
		});
	}

	handleFilterChange(option) {
		switch (option) {
			case 'By Date':
				this.setState({
					showDateFilter: true,
				});
				break;
		}
	}

	handlePaginationNav(nav) {
		let filter = { ...this.state.filter };
		let pagination = { ...this.state.pagination };

		switch (nav) {
			case 'prev':
				filter.page--;
				break;
			case 'next':
				filter.page++;
				break;
		}

		if (filter.page < 1) {
			filter.page = 1;
			return;
		}

		if (filter.page > pagination.total) {
			filter.page = pagination.total;
			return;
		}

		this.setState({
			filter: filter,
		});
	}

	dismissFilterDialog() {
		this.setState({
			showDateFilter: false,
		});
	}

	submitDateFilter() {
		let filterForm = Object.assign({}, this.state.filterForm);
		let filter = Object.assign({}, this.state.filter);

		let fromDate = new Date(filterForm.fromDate);
		fromDate =
			(fromDate.getTime() && `${fromDate.getMonth() + 1}/${fromDate.getDate()}/${fromDate.getFullYear()}`) ||
			null;

		let toDate = new Date(filterForm.toDate);
		toDate = (toDate.getTime() && `${toDate.getMonth() + 1}/${toDate.getDate()}/${toDate.getFullYear()}`) || null;

		filter.page = toDate != filter.toDate || fromDate != filter.fromDate ? 1 : filter.page;
		filter.fromDate = fromDate || null;
		filter.toDate = toDate || null;

		this.setState({
			showDateFilter: false,
			filter: filter,
		});
	}

	handleActionSelect(selected, action) {
		switch (action) {
			case 'Export To Excel':
				this.handleExport(selected);
				break;
			default:
				break;
		}
	}

	handleExport(selectedInvoices) {
		for (var i = 0; i < selectedInvoices.length; i++) {
			let item = find(this.state.list, item => item.id == selectedInvoices[i]);
			itemsInvoices.push(item);
		}
		var headers = {
			invoicenumber: 'Invoice Number', // remove commas to avoid errors
			client: 'Client',
			issue_date: 'Issue Date',
			due_date: 'Due Date',
			type: 'Type',
			amount: 'Amount',
			totaloutstanding: 'Total Outstanding',
			status: 'Status',
			notes: 'Notes',
			created_at: 'Date created'
		};
		var itemsFormatted = [];

		// format the data
		itemsInvoices.forEach(item => {
			itemsFormatted.push({
				invoicenumber: item.invoicenumber,
				client: item.client.firstname + ' ' + item.client.lastname,
				issue_date: moment(item.issue_date).format('DD/MM/YYYY'),
				due_date: moment(item.due_date).format('DD/MM/YYYY'),
				type: item.invoicetype,
				amount: thousand(parseFloat(item.amountdue).toFixed(2)),
				totaloutstanding: thousand(parseFloat(item.amountdue - item.amountpaid).toFixed(2)),
				status: item.invoicestatus,
				notes: item.notes,
				created_at: moment(item.date_created).format('DD/MM/YYYY')
			});
		});

		var fileTitle = 'Vencru_Invoices';

		this.exportCSVFile(headers, itemsFormatted, fileTitle);
	}

	exportCSVFile(headers, items, fileTitle) {
		if (headers) {
			items.unshift(headers);
		}

		// Convert Object to JSON
		var jsonObject = JSON.stringify(items);

		var csv = this.convertToCSV(jsonObject);

		var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

		var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		if (navigator.msSaveBlob) {
			// IE 10+
			navigator.msSaveBlob(blob, exportedFilenmae);
		} else {
			var link = document.createElement('a');
			if (link.download !== undefined) {
				// feature detection
				// Browsers that support HTML5 download attribute
				var url = URL.createObjectURL(blob);
				link.setAttribute('href', url);
				link.setAttribute('download', exportedFilenmae);
				link.style.visibility = 'hidden';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	}

	convertToCSV(objArray) {
		var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
		var str = '';

		for (var i = 0; i < array.length; i++) {
			var line = '';
			for (var index in array[i]) {
				if (line !== '') line += ',';

				line += array[i][index];
			}

			str += line + '\r\n';
		}

		return str;
	}
}

const mapStateToProps = ({ userInfo, selectedAllInvoices }) => ({
	userInfo: userInfo.data,
	currentBusiness:
		userInfo.data && userInfo.data.business && userInfo.data.business.constructor === Array
			? userInfo.data.business.find(item => item.id === userInfo.data.currentbusinessid)
			: null,
	allChecked: selectedAllInvoices,
});

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			showAlertDialog: ActionCreators.showAlertDialog,
			showSnackbar: ActionCreators.showSnackbar,
			hideAlertDialog: ActionCreators.hideAlertDialog
		},
		dispatch
	);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(SalesHome));
