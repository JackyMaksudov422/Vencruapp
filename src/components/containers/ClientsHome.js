import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ClientsQuickStatistics from '../presentation/ClientsQuickStatistics';
import DashboardSection from '../presentation/DashboardSection';
import Table from '../presentation/Table';
import TableHead from '../presentation/TableHead';
import TableBody from '../presentation/TableBody';
import Checkbox from '../presentation/Checkbox';
import TableRow from '../presentation/TableRow';
import TableCell from '../presentation/TableCell';
import ClientBasicInfo from '../presentation/ClientBasicInfo';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import findIndex from 'lodash/findIndex';
import Dropdown from '../presentation/Dropdown';
import { GET_CLIENTS, DELETE_CLIENT } from '../../configs/api.config';
import OverlayProgress from '../presentation/OverlayProgress';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import RecentlyAddedClients from './RecentlyAddedClients';
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
import { CURRENCIES_SIGNS } from '../../configs/data.config';

let itemsClients = [];

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
	<div className="vc-clients-home item-responsive">
		{/* Show welcome card only when there are no items */}
		{allItems && allItems.length < 1 && (
			<PlainCard collapsable className="text-center" onCollapse={fn.handleWelcomeCardCollapse}>
				<div className="mb-8 md:mb-0" />
				<Typography align="center" variant="active" className="mb40" size="lg">
					Grow your business by knowing your customers
				</Typography>
				<img src={require('../../assets/Know_Cus.png')} style={{ maxWidth: 100 }} />
				<Typography className="mb-24 md:mb-12 mt20">
					Add your clients to know your <span className="text-primary">highest paying</span> and the customers
					that are <span className="text-primary">owing</span> you.
				</Typography>
				<Button onClick={fn.addClient} variant="primary">
					Add Client
				</Button>
				<div className="mb-20 md:mb-0" />
			</PlainCard>
		)}

		<div className="desktop-items">
			{currentBusiness && (
				<ClientsQuickStatistics
					setRef={ref => fn.setRef('quickStatistics', ref)}
					businessId={currentBusiness.id}
				/>
			)}
		</div>

		{/* Disable quick stats on mobile if there are no items */}
		{allItems && allItems.length > 0 && (
			<div className="mobile-items">
				{currentBusiness && (
					<ClientsQuickStatistics
						cls="mobile-card-layout"
						setRef={ref => fn.setRef('quickStatistics', ref)}
						businessId={currentBusiness.id}
					/>
				)}
			</div>
		)}

		{allItems && allItems.length > 0 && currentBusiness && (
			<div className="hidden md:block">
				<RecentlyAddedClients setRef={ref => fn.setRef('recentlyAdded', ref)} businessId={currentBusiness.id} />
			</div>
		)}

		{currentBusiness && showDateFilter && (
			<Dialog
				open={showDateFilter}
				onClose={() => fn.handleFilterDialogClose()}
				disableEscapeKeyDown={false}
				disableBackdropClick={false}
				transitionDuration={200}
				aria-labelledby="clients-filter-alert-dialog-title"
				aria-describedby="clients-filter-alert-dialog-description"
				className="clients-filter-alert-dialog"
			>
				<DialogTitle id="clients-filter-alert-dialog-title" className="clients-filter-alert-dialog-title">
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
				<div className="spanned h30">&nbsp;</div>
				<Table
					sortOptions={sortOptions}
					filterOptions={['Today', 'Yesterday', 'This Month']}
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
							options={['Export CSV', 'Import CSV', 'Create Campaign']}
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
						<Link to="/clients/deleted-list">Deleted Items</Link>,
						<Link to="#" onClick={() => fn.handleTableEditClick(selected)}>
							Update
						</Link>,
					]}
				>
					{/* table head */}
					<TableHead>
						<TableRow type="th">
							<TableCell showOnMobile>
								<Checkbox square checked={selectAll} onChange={() => fn.handleSelectall()} />
							</TableCell>
							<TableCell showOnMobile>Basic Info</TableCell>
							<TableCell>Company</TableCell>
							<TableCell>Phone</TableCell>
							<TableCell>Total Paid</TableCell>
							<TableCell showOnMobile>Outstanding</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{/* table body */}
						{list &&
							list.constructor == Array &&
							list.map((item, index) => {
								return (
									<TableRow withSeparator key={index}>
										<TableCell showOnMobile>
											<Checkbox
												checked={selected.indexOf(item.id) != -1}
												square
												value={item.id}
												onChange={() => fn.handleClientSelect(item.id)}
											/>
										</TableCell>
										<TableCell
											showOnMobile
											onClick={() => {
												fn.handleClientClicked(item.id);
											}}
										>
											<ClientBasicInfo
												name={`${item.firstname} ${item.lastname}`}
												email={item.companyemail}
											/>
										</TableCell>
										<TableCell
											onClick={() => {
												fn.handleClientClicked(item.id);
											}}
										>
											{item.companyname}
										</TableCell>
										<TableCell
											onClick={() => {
												fn.handleClientClicked(item.id);
											}}
										>
											{item.phonenumber}
										</TableCell>
										<TableCell
											onClick={() => {
												fn.handleClientClicked(item.id);
											}}
										>
											{CURRENCIES_SIGNS[currentBusiness.currency]}
											{item.totalpaid || `0.00`}
										</TableCell>
										<TableCell showOnMobile>
											<span>
												{CURRENCIES_SIGNS[currentBusiness.currency]}
												{item.totaloutstanding || `0.00`}
											</span>
										</TableCell>
										<TableCell>
											<span className="hidden md:inline-block">
												<Dropdown
													className="hidden md:inline-block"
													iconButton
													icon={<i className="material-icons">more_vert</i>}
													options={['Edit', 'Delete', 'Business Card']}
													align="right"
													variant="link-gray"
													onChange={event =>
														fn.handleClientAction(item.id, event.target.value)
													}
												/>
											</span>
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
				<Link to="/clients/deleted-list">Deleted Clients</Link>
			</div>
		)}
	</div>
);

class ClientsHome extends React.Component {
	constructor() {
		super();

		this.request = new Request();
		// this.handleSelectall = this.handleSelectall;
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
			showWelcomeCard: storageGet(STORAGE_KEYS.CLIENTS_WELCOME_CARD_CLOSED) ? false : true,
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
			prevProps.clientCreate.isFetching &&
			!this.props.clientCreate.isFetching &&
			!this.props.clientCreate.errorMessage
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
			prevProps.clientUpdate.isFetching &&
			!this.props.clientUpdate.isFetching &&
			!this.props.clientUpdate.errorMessage
		) {
			this.updateClientsList(this.props.clientUpdate.data);

			if (this.recentlyAdded) {
				this.recentlyAdded.fetch();
			}

			if (this.quickStatistics) {
				this.quickStatistics.fetch();
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		return nextProps.selectedAllClients.checked ? this.handleSelectall() : this.setState({ selected: [] });
	}

	render() {
		return <Template {...this.prps()} fn={this.fn()} />;
	}

	fn = () => ({
		handleClientClicked: clientId => this.handleClientClicked(clientId),
		handleClientSelect: clientId => this.handleClientSelect(clientId),
		handleSelectall: () => this.handleSelectall(),
		clearSelected: () => this.clearSelected(),
		handleClientAction: (clientId, action) => this.handleClientAction(clientId, action),
		isDeleting: clientId => this.isDeleting(clientId),
		handleTableEditClick: selected => this.handleTableEditClick(selected),
		handleTableDeleteClick: selectedClients => this.handleTableDeleteClick(selectedClients),
		handleSearchChange: value => this.handleSearchChange(value),
		handleSortChange: value => this.handleSortChange(value),
		handleFilterChange: value => this.handleFilterChange(value),
		handlePaginationNav: value => this.handlePaginationNav(value),
		dismissFilterDialog: () => this.dismissFilterDialog(),
		submitDateFilter: () => this.submitDateFilter(),
		handleFilterDialogClose: () => this.handleFilterDialogClose(),
		handleFilterInputChange: (field, event) => this.handleFilterInputChange(field, event),
		setRef: (name, ref) => this.setRef(name, ref),
		addClient: () => this.props.history.push('clients/create'),
		importCsv: () => this.props.history.push('clients/importcsv'),
		handleWelcomeCardCollapse: () => storageStore(STORAGE_KEYS.CLIENTS_WELCOME_CARD_CLOSED, 1),
		handleActionSelect: (selectedClients, action) => this.handleActionSelect(selectedClients, action),
	});

	setRef(name, ref) {
		if (!this[name]) {
			this[name] = ref;
		}
	}

	prps = () => ({
		userInfo: this.props.userInfo.data,
		currentBusiness: this.currentBusiness(),
		isFetching: this.state.isFetching,
		allItems: this.state.allItems,
		list: this.state.list,
		selected: this.state.selected,
		selectAll: this.allClientsAreSelected(),
		sortOptions: this.sortOptions(),
		filter: this.state.filter,
		pagination: this.state.pagination,
		showDateFilter: this.state.showDateFilter,
		filterForm: this.state.filterForm,
		showWelcomeCard: this.state.showWelcomeCard,
	});

	handleClientClicked = clientId => {
		this.props.history.push(`clients/${clientId}/`);
	};

	handleClientAction(clientId, action) {
		let client = find(this.state.list, item => item.id == clientId);
		console.log('HERE', action);
		if (!client) {
			return;
		}
		switch (action) {
			case 'Edit':
				this.props.history.push(`clients/${clientId}/edit`);
				break;
			case 'Business Card':
				this.props.history.push(`clients/${clientId}/business-card`);
				break;
			case 'Delete':
				this.promptDeleteClients(clientId);
				break;
			default:
				// do nothing
				break;
		}
	}

	handleActionSelect(selectedClients, action) {
		switch (action) {
			case 'Export CSV':
				this.handleExport(selectedClients);
				break;
			case 'Create Campaign':
				break;
			case 'Import CSV':
				this.props.history.push('clients/importcsv');
				break;
			default:
				// do nothing
				break;
		}
	}

	handleExport(selectedItems) {
		for (var i = 0; i < selectedItems.length; i++) {
			let item = find(this.state.list, item => item.id == selectedItems[i]);
			itemsClients.push(item);
		}
		var headers = {
			businessid: 'Business Id', // remove commas to avoid errors
			city: 'City',
			companyemail: 'Company Email',
			companyname: 'Company Name',
			country: 'Country',
			date_created: 'Date Created',
			firstname: 'First Name',
			id: 'Id',
			isdeleted: 'Is Deleted',
			lastname: 'Last Name',
			phonenumber: 'Phone Number',
			street: 'Street',
			userid: 'UserId',
		};
		var itemsFormatted = [];

		// format the data
		itemsClients.forEach(item => {
			itemsFormatted.push({
				businessid: item.businessid,
				city: item.city,
				companyemail: item.companyemail,
				companyname: item.companyname,
				country: item.country,
				date_created: item.date_created,
				firstname: item.firstname,
				id: item.id,
				isdeleted: item.isdeleted,
				lastname: item.lastname,
				phonenumber: item.phonenumber,
				street: item.street,
				userid: item.userid,
			});
		});

		var fileTitle = 'Exported_Client_List'; // or 'my-unique-title'

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
				if (line != '') line += ',';

				line += array[i][index];
			}

			str += line + '\r\n';
		}

		return str;
	}

	handleSelectall() {
		const { list, selected } = this.state;
		if (this.allClientsAreSelected()) {
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

	handleClientSelect(clientId) {
		let selected = [...this.state.selected];

		if (selected.indexOf(clientId) == -1) {
			if (!this.isDeleting(clientId)) {
				selected.push(clientId);
			}
		} else {
			selected.splice(selected.indexOf(clientId), 1);
		}

		this.setState({
			selected: selected,
		});
	}

	allClientsAreSelected() {
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
			return find(data.business, item => item.id == data.currentbusinessid) || null;
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
			GET_CLIENTS({
				businessId: (business && business.id) || null,
				page: filter.page || 1,
				fromDate: filter.fromDate || undefined,
				toDate: filter.toDate || undefined,
				sortBy: filter.sortBy || undefined,
				sortOrder: filter.sortOrder || undefined,
				searchQuery: filter.search,
				limit: pagination.perPage,
				filter: filter.filter || undefined,
			})
				.then(response => {
					this.setState({
						isFetching: false,
						list: response.clients,
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
							allItems: response.clients,
						});
					}
				})
				.catch(error => {
					let errorMessage =
						(typeof error == 'string' && error.length > 0 && error) ||
						'An error occured while making your request..';
					this.props.showSnackbar(errorMessage, { variant: 'error' });
					this.setState({
						isFetching: false,
						page: this.state.page > 1 && this.state.page - 1,
					});
				});
		}, 1000);
	}

	promptDeleteClients(clientId) {
		if (this.isDeleting(clientId)) {
			return;
		}
		if (clientId && clientId.constructor == Array && clientId.length < 1) {
			return;
		}
		this.props.showAlertDialog(
			``,
			`Are you sure you want to delete the selected client${(clientId &&
				clientId.constructor == Array &&
				clientId.length >= 2 &&
				's') ||
				''}?`,
			[
				{ text: 'No', onClick: () => this.props.hideAlertDialog() },
				{ text: 'Yes, Delete', onClick: () => this.doDeleteClient(clientId), variant: 'destructive' },
			]
		);
	}

	doDeleteClient(clientId) {
		if (this.isDeleting(clientId)) {
			return;
		}

		if (!this.predeleteClientsData(clientId)) {
			return;
		}

		this.addToDeleteList(clientId);

		this.setState({
			isFetching: true,
		});

		DELETE_CLIENT(this.predeleteClientsData(clientId))
			.then(() => {
				this.props.showSnackbar(`Client${(clientId && clientId.constructor == Array && 's') || ''} deleted`, {
					variant: 'success',
				});
				this.removeFromDeleteList(clientId);
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
					(typeof error == 'string' && error.length > 0 && error) ||
					`Failed to delete selected client${(clientId &&
						clientId.constructor == Array &&
						clientId.length > 0 &&
						's') ||
						''}.`;
				this.props.showSnackbar(MessageParser(errorMessage), { variant: 'error' });
				this.removeFromDeleteList(clientId);
				this.setState({
					isFetching: false,
				});
			});
	}

	isDeleting(clientId) {
		if (clientId && clientId.constructor == Array) {
			for (var i = 0; i < clientId.length; i++) {
				if (this.state.deletingList.indexOf(clientId[i]) != -1) {
					return true;
				}
			}
			return false;
		}
		return this.state.deletingList.indexOf(clientId) != -1;
	}

	addToDeleteList(clientId) {
		let deletingList = [].concat(this.state.deletingList);
		if (clientId && clientId.constructor == Array) {
			for (var i = 0; i < clientId.length; i++) {
				if (deletingList.indexOf(clientId[i]) == -1) {
					deletingList.push(clientId[i]);
				}
			}
			this.setState({
				deletingList: deletingList,
			});
			return;
		}

		deletingList.push(clientId);
		this.setState({
			deletingList: deletingList,
		});
	}

	removeFromDeleteList(clientId) {
		let deletingList = [].concat(this.state.deletingList);
		if (clientId && clientId.constructor == Array) {
			for (var i = 0; i < clientId.length; i++) {
				if (deletingList.indexOf(clientId[i]) != -1) {
					deletingList.splice(deletingList.indexOf(clientId[i]), 1);
				}
			}
			this.setState({
				deletingList: deletingList,
			});
			return;
		}

		deletingList.splice(deletingList.indexOf(clientId), 1);
		this.setState({
			deletingList: deletingList,
		});
	}

	updateClientsList(clientInfo) {
		let list = [...this.state.list];
		let clientIndex = findIndex(list, item => item.id == clientInfo.id);
		if (clientIndex !== -1) {
			let clientInfoUpdate = Object.assign({}, list[clientIndex], clientInfo);
			list.splice(clientIndex, 1, clientInfoUpdate);
			this.setState({
				list: list,
			});
		}
	}

	handleTableEditClick(selected) {
		if (selected && selected.constructor === Array && selected.length > 0) {
			this.props.history.push(`/clients/${selected[0]}/edit`);
		}
	}

	handleTableDeleteClick(selectedClients) {
		if (selectedClients && selectedClients.constructor == Array && selectedClients.length > 0) {
			this.promptDeleteClients(selectedClients);
		}
	}

	predeleteClientsData(clientId) {
		if (!clientId) {
			return;
		}

		let business = this.currentBusiness();

		if (clientId.constructor == Array) {
			let list = [];

			for (var i = 0; i < clientId.length; i++) {
				if (typeof clientId[i] !== 'string' && typeof clientId[i] !== 'number') {
					continue;
				}
				list.push({
					clientid: clientId[i],
					businessid: business.id,
					userid: this.props.userInfo.data && this.props.userInfo.data.userid,
				});
			}

			return (list.length > 0 && { items: list }) || null;
		}

		if (typeof clientId == 'string' || typeof clientId == 'number') {
			return {
				ClientId: clientId,
				BusinessId: business.id,
			};
		}

		return null;
	}

	handleSearchChange(search) {
		if (search.trim() == this.state.filter.search) {
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
		console.log('ssssssss');
		if (filter && filter.constructor == Object && Object.keys(filter).length > 0) {
			let params = [];
			let filterFields = Object.keys(filter);
			for (var i = 0; i < filterFields.length; i++) {
				if (
					filter[filterFields[i]] == null ||
					filter[filterFields[i]] === undefined ||
					(typeof filter[filterFields[i]] == 'string' && filter[filterFields[i]].length < 1)
				) {
					continue;
				}
				params.push(`${filterFields[i]}=${encodeURIComponent(filter[filterFields[i]])}`);
			}
			this.props.history.push(`/clients${(params.length > 0 && '?' + params.join('&')) || ''}`);
		}
		this.fetch();
	}

	sortOptions() {
		// 'Newest to Old', 'Company Name A-Z', 'First Name A-Z', 'Total Paid(From highest)', 'Total Outstanding From highest'
		const { filter } = this.state;
		let options = [];
		// Add creation date option
		options.push(
			(filter.sortBy == 'date_created' && filter.sortOrder == 'desc' && 'Oldest to New') || 'Newest to Old'
		);
		// Add company name option
		options.push(
			(filter.sortBy == 'companyname' && filter.sortOrder == 'asc' && 'Company Name Z-A') || 'Company Name A-Z'
		);
		// Add person name option
		options.push(
			(filter.sortBy == 'firstname' && filter.sortOrder == 'asc' && 'First Name Z-A') || 'First Name A-Z'
		);
		// Add person name option
		options.push((filter.sortBy == 'lastname' && filter.sortOrder == 'asc' && 'Last Name Z-A') || 'Last Name A-Z');
		// Add total paid
		options.push(
			(filter.sortBy == 'totalpaid' && filter.sortOrder == 'desc' && 'Total Paid(from lowest)') ||
				'Total Paid(from highest)'
		);
		// Add total outstanding
		options.push(
			(filter.sortBy == 'totaloutstanding' && filter.sortOrder == 'desc' && 'Total Outstanding(from lowest)') ||
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
		let filter = { ...this.state.filter };
		var range = '';
		if (option.toLowerCase() == 'today' || option.toLowerCase() == 'yesterday') range = option.toLowerCase();
		else if (option.toLowerCase().indexOf('month')) range = 'thismonth';
		filter.filter = range;
		this.setState({
			filter: filter,
		});
		// filter.fromDate = Date.now()-1;
		// filter.toDate = Date.now()+1;

		// switch (option) {
		//     // case 'By Date':
		//     //     this.setState({
		//     //         showDateFilter: true
		//     //     });
		//     //     break;
		//     case 'Today':
		//         this.setState({
		//             showDateFilter: false,
		//             filter: filter
		//         });
		//         break;
		// }
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

	conformToInputDate(date) {
		var d = new Date(date);
		return (d.getTime() && `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() + 1}`) || '';
	}
}

const mapStateToProps = ({ userInfo, clientCreate, clientUpdate, selectedAllClients }) => ({
	userInfo,
	clientCreate,
	clientUpdate,
	selectedAllClients,
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
)(withRouter(ClientsHome));
