import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import DashboardSection from '../presentation/DashboardSection';
import Table from '../presentation/Table';
import TableHead from '../presentation/TableHead';
import TableBody from '../presentation/TableBody';
import Checkbox from '../presentation/Checkbox';
import TableRow from '../presentation/TableRow';
import TableCell from '../presentation/TableCell';
import ExpenseBasicInfo from '../presentation/ExpenseBasicInfo';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import findIndex from 'lodash/findIndex';
import Dropdown from '../presentation/Dropdown';
import { GET_EXPENSES, DELETE_EXPENSE } from '../../configs/api.config';
import OverlayProgress from '../presentation/OverlayProgress';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import RecentlyAddedExpenses from './RecentlyAddedExpenses';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import Button from '../presentation/Button';
import Input from '../presentation/Input';
import Request from '../../helpers/Request';
import MessageParser from '../../helpers/MessageParser';
import Typography from '../presentation/Typography';
import PlainCard from '../presentation/PlainCard';
import { storageStore, storageGet } from '../../helpers/Storage';
import { STORAGE_KEYS } from '../../configs/storage.config';
import { thousand } from '../../helpers/Misc';
import { CURRENCIES_SIGNS, EXPENSE_CATEGORIES_COLORS } from '../../configs/data.config';
import ExpensesQuickStatistics from '../presentation/ExpensesQuickStatistics';
import moment from 'moment';
let itemsExpenses = [];
/**
 * component template
 */
let Template = ({
	fn,
	currentBusiness,
	isFetching,
	list,
	allItems,
	selectAll,
	selected,
	showDateFilter,
	sortOptions,
	filter,
	pagination,
	filterForm,
	showWelcomeCard,
}) => (
	<div className="vc-expenses-home item-responsive">
		{/* Show welcome card only when there are no expenses */}
		{allItems && allItems.length < 1 && (
			<PlainCard collapsable className="text-center" onCollapse={fn.handleWelcomeCardCollapse}>
				<div className="mb-8 md:mb-0" />
				<Typography align="center" variant="active" className="mb40" size="lg">
					Grow your business by controlling your expenses
				</Typography>
				<img src={require('../../assets/expense-icon.png')} style={{ maxWidth: 100 }} alt="icon" />
				<Typography className="mb-24 md:mb-12 mt20">
					Add your expenses to track how you're spending yout money.
				</Typography>
				<Button onClick={fn.addExpense} variant="primary">
					Add Expense
				</Button>
				<div className="mb-20 md:mb-0" />
			</PlainCard>
		)}

		<div className="desktop-items">
			{currentBusiness && (
				<ExpensesQuickStatistics businessId={currentBusiness.id} currency={currentBusiness.currency} />
			)}
		</div>
		{/* Disable quick stats on mobile if there are no records */}
		{allItems && allItems.length > 0 && (
			<div className="mobile-items">
				{currentBusiness && (
					<ExpensesQuickStatistics
						cls="mobile-card-layout"
						businessId={currentBusiness.id}
						currency={currentBusiness.currency}
					/>
				)}
			</div>
		)}

		{allItems && allItems.length > 0 && currentBusiness && (
			<div className="hidden md:block">
				{currentBusiness && (
					<RecentlyAddedExpenses
						setRef={ref => fn.setRef('recentlyAdded', ref)}
						businessId={currentBusiness.id}
					/>
				)}
			</div>
		)}

		{currentBusiness && showDateFilter && (
			<Dialog
				open={showDateFilter}
				onClose={() => fn.handleFilterDialogClose()}
				disableEscapeKeyDown={false}
				disableBackdropClick={false}
				transitionDuration={200}
				aria-labelledby="expenses-filter-alert-dialog-title"
				aria-describedby="expenses-filter-alert-dialog-description"
				className="expenses-filter-alert-dialog"
			>
				<DialogTitle id="expenses-filter-alert-dialog-title" className="expenses-filter-alert-dialog-title">
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
				<DialogActions className="expenses-filter-alert-dialog-actions text-center pb20 ph15">
					<Button size="sm" type="button" variant="link-gray" onClick={() => fn.dismissFilterDialog()}>
						Close
					</Button>
					<Button size="sm" type="button" variant="primary" onClick={() => fn.submitDateFilter()}>
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		)}

		{allItems && allItems.length > 0 && currentBusiness && (
			<DashboardSection>
				{/* <div className='spanned h30'>&nbsp;</div> */}
				<div className="md:mb-1">&nbsp;</div>
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
							options={['Export To Excel', 'Export as PDF']}
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
							onClick={() => fn.handleTableDeleteClick(selected)}
							disabled={selected.length < 1}
						>
							Delete
						</Button>,
					]}
					// Hidden actions to be displayed when items are selected on mobile view
					selectActionsOnMobileTop={[
						<Link to="#" onClick={() => fn.clearSelected()}>
							Done
						</Link>,
						<Link to="#" onClick={() => fn.handleTableDeleteClick(selected)}>
							Delete
						</Link>,
					]}
					selectActionsOnMobileBottom={[
						<Link to="#" onClick={() => fn.handleExport(selected)}>
							Export list
						</Link>,
						<Link to="/expenses/deleted-list">Deleted Items</Link>,
						<Link to="#" onClick={() => fn.handleTableEditClick(selected)}>
							Update
						</Link>,
					]}
				>
					{/* table head */}
					<TableHead>
						<TableRow type="th" className="border-l-12 border-grey md:border-l-0">
							<TableCell showOnMobile>
								<Checkbox square checked={selectAll} onChange={() => fn.handleSelectall()} />
							</TableCell>
							<TableCell>Category</TableCell>
							<TableCell showOnMobile mobileOnly>
								Basic info
							</TableCell>
							<TableCell>Date/Source</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Amount</TableCell>
							<TableCell showOnMobile mobileOnly>
								Unit price
							</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{/* table body */}
						{list &&
							list.constructor === Array &&
							list.map((item, index) => {
								return (
									<TableRow
										withSeparator
										className={`border-l-12 md:border-l-0  border-${
											EXPENSE_CATEGORIES_COLORS[item.category]
										}`}
										key={index}
									>
										<TableCell showOnMobile>
											<Checkbox
												checked={selected.indexOf(item.id) !== -1}
												square
												value={item.id}
												onChange={() => fn.handleExpenseSelect(item.id)}
											/>
										</TableCell>
										<TableCell>
											<ExpenseBasicInfo category={`${item.category}`} vendor={item.vendor} />
										</TableCell>
										<TableCell showOnMobile mobileOnly>
											<ExpenseBasicInfo category={`${item.category}`} vendor={item.vendor} />
										</TableCell>
										<TableCell>
											<h4>{moment(item.expensedate).format('DD/MM/YYYY')}</h4>
										</TableCell>
										<TableCell>{item.description}</TableCell>
										<TableCell>
											<div className="expense-total-outstanding">
												<span className="amount">
													{CURRENCIES_SIGNS[currentBusiness.currency]}
													{thousand(parseInt(item.totalamount).toFixed(2))}
												</span>
												<Dropdown
													iconButton
													icon={<i className="material-icons">more_vert</i>}
													options={['Edit', 'Delete']}
													destructiveOption={1}
													align="right"
													variant="link-gray"
													onChange={event =>
														fn.handleExpenseAction(item.id, event.target.value)
													}
												/>
											</div>
										</TableCell>
										<TableCell showOnMobile mobileOnly>
											<div className="flex flex-col w-full">
												<span className="mb-4 text-xs">
													{moment(item.expensedate).format('DD/MM/YYYY')}
												</span>
												<span className="text-base">
													{CURRENCIES_SIGNS[currentBusiness.currency]}
													{thousand(parseInt(item.totalamount).toFixed(2))}
												</span>
											</div>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
				{isFetching && <OverlayProgress />}
			</DashboardSection>
		)}

		{currentBusiness && (
			<div className="spanned mv15 text-center hidden md:block">
				<Link to="/expenses/deleted-list">Deleted Expenses</Link>
			</div>
		)}
	</div>
);

class ExpensesHome extends React.Component {
	constructor() {
		super();

		this.request = new Request();

		this.state = {
			isFetching: false,
			filter: {
				page: this.request.get('page', 1),
				fromDate: this.request.get('fromDate', null),
				toDate: this.request.get('toDate', null),
				sortBy: this.request.get('sortby', 'date_created'),
				sortOrder: this.request.get('sortOrder', 'desc'),
				search: this.request.get('search', null),
			},
			allItems: [],
			list: [],
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
			showWelcomeCard: storageGet(STORAGE_KEYS.EXPENSE_WELCOME_CARD_CLOSED) ? false : true,
			allExpensesSelected: false,
		};
	}

	componentDidMount() {
		if (this.props.userInfo.data) {
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

		if (
			prevProps.expenseCreate.isFetching &&
			!this.props.expenseCreate.isFetching &&
			!this.props.expenseCreate.errorMessage
		) {
			if (this.state.page > 1 || this.state.ToDate || this.state.ToDate) {
				this.setState({
					filter: Object.assign({}, this.state.filter, {
						page: 1,
						FromDate: null,
						ToDate: null,
					}),
				});
			} else {
				this.fetch();
			}

			if (this.recentlyAdded) {
				this.recentlyAdded.fetch();
			}

			if (this.quickStatistics) {
				this.quickStatistics.fetch();
			}
		}

		if (
			prevProps.expenseUpdate.isFetching &&
			!this.props.expenseUpdate.isFetching &&
			!this.props.expenseUpdate.errorMessage
		) {
			this.updateExpensesList(this.props.expenseUpdate.data);

			if (this.recentlyAdded) {
				this.recentlyAdded.fetch();
			}

			if (this.quickStatistics) {
				this.quickStatistics.fetch();
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		return nextProps.selectedAllExpenses.checked ? this.handleSelectall() : this.setState({ selected: [] });
	}

	render() {
		return <Template {...this.prps()} fn={this.fn()} />;
	}

	fn = () => ({
		handleExpenseSelect: expenseId => this.handleExpenseSelect(expenseId),
		handleSelectall: () => this.handleSelectall(),
		clearSelected: () => this.clearSelected(),
		handleExpenseAction: (expenseId, action) => this.handleExpenseAction(expenseId, action),
		isDeleting: expenseId => this.isDeleting(expenseId),
		handleTableEditClick: selectedExpenses => this.handleTableEditClick(selectedExpenses),
		handleTableDeleteClick: selectedExpenses => this.handleTableDeleteClick(selectedExpenses),
		handleSearchChange: value => this.handleSearchChange(value),
		handleSortChange: value => this.handleSortChange(value),
		handleFilterChange: value => this.handleFilterChange(value),
		handlePaginationNav: value => this.handlePaginationNav(value),
		dismissFilterDialog: () => this.dismissFilterDialog(),
		submitDateFilter: () => this.submitDateFilter(),
		handleFilterDialogClose: () => this.handleFilterDialogClose(),
		handleFilterInputChange: (field, event) => this.handleFilterInputChange(field, event),
		setRef: (name, ref) => this.setRef(name, ref),
		addExpense: () => this.props.history.push('expenses/create'),
		handleWelcomeCardCollapse: () => storageStore(STORAGE_KEYS.EXPENSE_WELCOME_CARD_CLOSED, 1),
		//handleActionSelect: (action) => {console.log(action)},
		handleActionSelect: (selectedExpenses, action) => this.handleActionSelect(selectedExpenses, action),
		convertExpenseDate: date => this.convertExpenseDate(date),
	});

	prps = () => ({
		userInfo: this.props.userInfo.data,
		currentBusiness: this.currentBusiness(),
		isFetching: this.state.isFetching,
		allItems: this.state.allItems,
		list: this.state.list,
		selected: this.state.selected,
		selectAll: this.allExpensesAreSelected(),
		sortOptions: this.sortOptions(),
		filter: this.state.filter,
		pagination: this.state.pagination,
		showDateFilter: this.state.showDateFilter,
		filterForm: this.state.filterForm,
		showWelcomeCard: this.state.showWelcomeCard,
	});

	setRef(name, ref) {
		if (!this[name]) {
			this[name] = ref;
		}
	}
	handleActionSelect(selectedClients, action) {
		console.log(action);
		switch (action) {
			case 'Export To Excel':
				this.handleExport(selectedClients);
				break;
			case 'Send Campaign':
				break;
			case 'Unsubscribe':
				break;
			default:
				// do nothing
				break;
		}
	}
	handleExport(selectedItems) {
		for (var i = 0; i < selectedItems.length; i++) {
			let item = find(this.state.list, item => item.id == selectedItems[i]);
			itemsExpenses.push(item);
		}
		console.log(itemsExpenses, 'itemsExpenses');
		var headers = {
			businessid: 'Business Id', // remove commas to avoid errors
			category: 'Category',
			date_created: 'Date Created',
			description: 'Description',
			expensedate: 'Expense Date',
			expensenumber: 'Expense Number',
			id: 'Id',
			image: 'Image',
			paidwith: 'Paid With',
			totalamount: 'Total Amount',
			vendor: 'Vendor',
		};
		var itemsFormatted = [];

		// format the data
		itemsExpenses.forEach(item => {
			itemsFormatted.push({
				businessid: item.businessid,
				category: item.category,
				date_created: item.date_created,
				description: item.description,
				expensedate: item.expensedate,
				expensenumber: item.expensenumber,
				id: item.id,
				image: item.image,
				paidwith: item.paidwith,
				totalamount: item.totalamount,
				vendor: item.vendor,
			});
		});

		var fileTitle = 'Exported_Expenses_List'; // or 'my-unique-title'

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
	convertExpenseDate(expensedate) {
		let date = new Date(expensedate);
		if (date.getTime() === 'Invalid Date') {
			return '';
		}
		return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
	}

	handleExpenseAction(expenseId, action) {
		let expense = find(this.state.list, item => item.id === expenseId);
		if (!expense) {
			return;
		}
		switch (action) {
			case 'Edit':
				this.props.history.push(`expenses/${expenseId}/edit`);
				break;
			case 'Business Card':
				this.props.history.push(`expenses/${expenseId}/business-card`);
				break;
			case 'Delete':
				this.promptDeleteExpenses(expenseId);
				break;
			default:
				// do nothing
				break;
		}
	}

	handleSelectall() {
		const { list, selected } = this.state;
		if (this.allExpensesAreSelected()) {
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

	handleExpenseSelect(expenseId) {
		let selected = [...this.state.selected];

		if (selected.indexOf(expenseId) === -1) {
			if (!this.isDeleting(expenseId)) {
				selected.push(expenseId);
			}
		} else {
			selected.splice(selected.indexOf(expenseId), 1);
		}

		this.setState({
			selected: selected,
		});
	}

	allExpensesAreSelected() {
		return (
			this.state.selected.length > 0 &&
			this.state.list.length > 0 &&
			this.state.selected.length >= this.state.list.length
		);
	}

	clearSelected() {
		this.setState({
			selected: [],
		});
		return;
	}

	currentBusiness() {
		const { data } = this.props.userInfo;
		if (data && data.business) {
			return find(data.business, item => item.id === data.currentbusinessid) || null;
		}
		return null;
	}

	fetch() {
		let business = this.currentBusiness();
		const { pagination, filter } = this.state;
		this.setState({
			isFetching: true,
		});
		setTimeout(() => {
			GET_EXPENSES({
				businessId: (business && business.id) || null,
				page: filter.page || 1,
				fromDate: filter.fromDate || undefined,
				toDate: filter.toDate || undefined,
				sortBy: filter.sortBy || undefined,
				sortOrder: filter.sortOrder || undefined,
				searchQuery: filter.search,
				limit: pagination.perPage,
			})
				.then(response => {
					this.setState({
						isFetching: false,
						list: response.expenses,
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

					/**
					 * Check if no search filter exists before setting the allItems state.
					 * Setting it without this check means allItems can be empty if no result matches the search string,
					 * hence making conditional checks to display sections of the page to malfunction as the allItems array
					 * will be empty when infact the total count is greater than 0 but just limited by the search operation.
					 **/

					if (!filter.search) {
						this.setState({
							allItems: response.expenses,
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
		}, 1000);
	}

	promptDeleteExpenses(expenseId) {
		if (this.isDeleting(expenseId)) {
			return;
		}
		if (expenseId && expenseId.constructor === Array && expenseId.length < 1) {
			return;
		}
		this.props.showAlertDialog(
			``,
			`Are you sure you want to delete the selected expense${(expenseId &&
				expenseId.constructor === Array &&
				expenseId.length >= 2 &&
				's') ||
				''}?`,
			[
				{ text: 'No', onClick: () => this.props.hideAlertDialog() },
				{ text: 'Yes, Delete', onClick: () => this.doDeleteExpense(expenseId), variant: 'destructive' },
			]
		);
	}

	doDeleteExpense(expenseId) {
		if (this.isDeleting(expenseId)) {
			return;
		}

		if (!this.predeleteExpensesData(expenseId)) {
			return;
		}

		this.addToDeleteList(expenseId);

		this.setState({
			isFetching: true,
		});

		DELETE_EXPENSE(this.predeleteExpensesData(expenseId))
			.then(() => {
				this.props.showSnackbar(
					`Expense${(expenseId && expenseId.constructor === Array && 's') || ''} deleted`,
					{ variant: 'success' }
				);
				this.removeFromDeleteList(expenseId);
				setTimeout(() => {
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
				}, 100);
			})
			.catch(error => {
				let errorMessage =
					(typeof error === 'string' && error.length > 0 && error) ||
					`Failed to delete selected expense${(expenseId &&
						expenseId.constructor === Array &&
						expenseId.length > 0 &&
						's') ||
						''}.`;
				this.props.showSnackbar(MessageParser(errorMessage), { variant: 'error' });
				this.removeFromDeleteList(expenseId);
				this.setState({
					isFetching: false,
				});
			});
	}

	isDeleting(expenseId) {
		if (expenseId && expenseId.constructor === Array) {
			for (var i = 0; i < expenseId.length; i++) {
				if (this.state.deletingList.indexOf(expenseId[i]) !== -1) {
					return true;
				}
			}
			return false;
		}
		return this.state.deletingList.indexOf(expenseId) !== -1;
	}

	addToDeleteList(expenseId) {
		let deletingList = [].concat(this.state.deletingList);
		if (expenseId && expenseId.constructor === Array) {
			for (var i = 0; i < expenseId.length; i++) {
				if (deletingList.indexOf(expenseId[i]) === -1) {
					deletingList.push(expenseId[i]);
				}
			}
			this.setState({
				deletingList: deletingList,
			});
			return;
		}

		deletingList.push(expenseId);
		this.setState({
			deletingList: deletingList,
		});
	}

	removeFromDeleteList(expenseId) {
		let deletingList = [].concat(this.state.deletingList);
		if (expenseId && expenseId.constructor === Array) {
			for (var i = 0; i < expenseId.length; i++) {
				if (deletingList.indexOf(expenseId[i]) !== -1) {
					deletingList.splice(deletingList.indexOf(expenseId[i]), 1);
				}
			}
			this.setState({
				deletingList: deletingList,
			});
			return;
		}

		deletingList.splice(deletingList.indexOf(expenseId), 1);
		this.setState({
			deletingList: deletingList,
		});
	}

	updateExpensesList(expenseInfo) {
		let list = [...this.state.list];
		let expenseIndex = findIndex(list, item => item.id === expenseInfo.id);
		if (expenseIndex !== -1) {
			let expenseInfoUpdate = Object.assign({}, list[expenseIndex], expenseInfo);
			list.splice(expenseIndex, 1, expenseInfoUpdate);
			this.setState({
				list: list,
			});
		}
	}

	handleTableEditClick(selectedExpenses) {
		if (selectedExpenses && selectedExpenses.constructor === Array && selectedExpenses.length > 0) {
			this.props.history.push(`/expenses/${selectedExpenses[0]}/edit`);
		}
	}

	handleTableDeleteClick(selectedExpenses) {
		if (selectedExpenses && selectedExpenses.constructor === Array && selectedExpenses.length > 0) {
			this.promptDeleteExpenses(selectedExpenses);
		}
	}

	predeleteExpensesData(expenseId) {
		if (!expenseId) {
			return;
		}

		let business = this.currentBusiness();

		if (expenseId.constructor === Array) {
			let list = [];

			for (var i = 0; i < expenseId.length; i++) {
				if (typeof expenseId[i] !== 'string' && typeof expenseId[i] !== 'number') {
					continue;
				}
				list.push({
					expenseid: expenseId[i],
					businessid: business.id,
					userid: this.props.userInfo.data && this.props.userInfo.data.userid,
				});
			}

			return (list.length > 0 && { items: list }) || null;
		}

		if (typeof expenseId === 'string' || typeof expenseId === 'number') {
			return {
				expenseid: expenseId,
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
			this.props.history.push(`/expenses${(params.length > 0 && '?' + params.join('&')) || ''}`);
		}
		this.fetch();
	}

	sortOptions() {
		const { filter } = this.state;
		let options = [];
		// Add creation date option
		options.push(
			(filter.sortBy === 'date_created' && filter.sortOrder === 'desc' && 'Oldest to New') || 'Newest to Old'
		);
		// Add company name option
		options.push((filter.sortBy === 'category' && filter.sortOrder === 'asc' && 'Category Z-A') || 'Category A-Z');
		// Add person name option
		options.push((filter.sortBy === 'vendor' && filter.sortOrder === 'asc' && 'Vendor Z-A') || 'Vendor A-Z');
		// Add total outstanding
		options.push(
			(filter.sortBy === 'amount' && filter.sortOrder === 'desc' && 'Amount(from lowest)') ||
				'Amount(from highest)'
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
			case 'Category Z-A':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'category',
						sortOrder: 'desc',
					}),
				});
				break;
			case 'Category A-Z':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'category',
						sortOrder: 'asc',
					}),
				});
				break;
			case 'Vendor Z-A':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'vendor',
						sortOrder: 'asc',
					}),
				});
				break;
			case 'Vendor A-Z':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'vendor',
						sortOrder: 'desc',
					}),
				});
				break;
			case 'Amount(from lowest)':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'amount',
						sortOrder: 'asc',
					}),
				});
				break;
			case 'Amount(from highest)':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'amount',
						sortOrder: 'desc',
					}),
				});
				break;
		}
	}

	handleFilterInputChange(field, event) {
		let filterForm = this.state.filterForm || {};
		filterForm[field] = event;
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

		filter.page = toDate !== filter.toDate || fromDate !== filter.fromDate ? 1 : filter.page;
		filter.fromDate = fromDate || null;
		filter.toDate = toDate || null;

		this.setState({
			showDateFilter: false,
			filter: filter,
		});
	}

	conformToInputDate(date) {
		var d = new Date(date);
		return (d.getTime() && `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() + 1}`) || '';
	}
}

const mapStateToProps = ({ userInfo, expenseCreate, expenseUpdate, selectedAllExpenses }) => ({
	userInfo,
	expenseCreate,
	expenseUpdate,
	selectedAllExpenses: selectedAllExpenses,
});

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			showSnackbar: ActionCreators.showSnackbar,
			showAlertDialog: ActionCreators.showAlertDialog,
			hideAlertDialog: ActionCreators.hideAlertDialog,
		},
		dispatch
	);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(ExpensesHome));
