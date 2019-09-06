import * as React from 'react';
import withRouter from 'react-router-dom/withRouter';
import Link from 'react-router-dom/Link';
import { connect } from 'react-redux';
import DashboardSection from '../presentation/DashboardSection';
import Table from '../presentation/Table';
import TableHead from '../presentation/TableHead';
import TableBody from '../presentation/TableBody';
import Checkbox from '../presentation/Checkbox';
import TableRow from '../presentation/TableRow';
import TableCell from '../presentation/TableCell';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import findIndex from 'lodash/findIndex';
import Dropdown from '../presentation/Dropdown';
import { GET_ITEMS, DELETE_ITEM } from '../../configs/api.config';
import OverlayProgress from '../presentation/OverlayProgress';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import Button from '../presentation/Button';
import Input from '../presentation/Input';
import Request from '../../helpers/Request';
import MessageParser from '../../helpers/MessageParser';
import ItemsQuickStatistics from '../presentation/ItemsQuickStatistics';
import PlainCard from '../presentation/PlainCard';
import Typography from '../presentation/Typography';
import { STORAGE_KEYS } from '../../configs/storage.config';
import { storageStore, storageGet } from '../../helpers/Storage';
import { thousand } from '../../helpers/Misc';
import { CURRENCIES_SIGNS } from '../../configs/data.config';

let itemsHome = [];
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
	<div className="vc-items-home item-responsive">
		{/* Show welcome card only when there are no items */}
		{allItems && allItems.length < 1 && (
			<PlainCard collapsable className="text-center" onCollapse={fn.handleWelcomeCardCollapse}>
				<div className="mb-8 md:mb-0" />
				<Typography align="center" variant="active" className="mb40" size="lg">
					Grow your business by managing your products & services list{' '}
				</Typography>
				<img src={require('../../assets/Know_Cus.png')} style={{ maxWidth: 100 }} alt="" />
				<Typography className="mb-24 md:mb-12 mt20">
					Understand your <span className="text-primary">per product profits</span> by creating and managing
					your <span className="text-primary">products and services</span>.
				</Typography>
				<Link to="items/create" className="vc-button vc-button-primary">
					Add Item
				</Link>
				<div className="mb-20 md:mb-0" />
			</PlainCard>
		)}

		<div className="desktop-items">
			{currentBusiness && (
				<ItemsQuickStatistics
					setRef={ref => fn.setRef('quickStatistics', ref)}
					businessId={currentBusiness.id}
				/>
			)}
		</div>

		{/* Disable quick stats on mobile if there are no items */}
		{allItems && allItems.length > 0 && (
			<div className="mobile-items">
				{currentBusiness && (
					<ItemsQuickStatistics
						cls="mobile-card-layout"
						setRef={ref => fn.setRef('quickStatistics', ref)}
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
				aria-labelledby="items-filter-alert-dialog-title"
				aria-describedby="items-filter-alert-dialog-description"
				className="items-filter-alert-dialog"
			>
				<DialogTitle id="items-filter-alert-dialog-title" className="items-filter-alert-dialog-title">
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
				<DialogActions className="items-filter-alert-dialog-actions text-center pb20 ph15">
					<Button size="sm" type="button" variant="link-gray" onClick={() => fn.dismissFilterDialog()}>
						Close
					</Button>
					<Button size="sm" type="button" variant="primary" onClick={() => fn.submitDateFilter()}>
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		)}

		{currentBusiness && (
			<div className="spanned hidden md:block md:mt-8 md:mb-3">
				<Link className="vc-button vc-button-primary vc-button-small" to="items/create">
					Add Item
				</Link>
			</div>
		)}

		{allItems && allItems.length > 0 && currentBusiness && (
			<DashboardSection title="Items List">
				<div className="spanned h30">&nbsp;</div>
				<Table
					sortOptions={sortOptions}
					handleControlSearchOnChange={value => fn.handleSearchChange(value)}
					onControlSortChange={value => fn.handleSortChange(value)}
					onControlFilterChange={value => fn.handleFilterChange(value)}
					defaultSearch={filter.search}
					pagination={pagination}
					onPaginationNav={nav => fn.handlePaginationNav(nav)}
					selectedItems={selected}
					controlLeftActions={[
						<Dropdown
							noArrow
							options={['Export List', 'Import List']}
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

						//             <Button
						//                 variant='gray'
						//                 onClick={() => fn.handleExport(selected)}
						//                 disabled={selected.length < 1}
						//                 size='sm'
						//             >
						//                 Export List
						//         </Button>,
						//             <Button
						//                 variant='gray'
						//                 onClick={() => fn.handleImport()}
						//                 size='sm'
						//             >
						//                 Import List
						// </Button>,
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
						<Link to="#" onClick={() => fn.clearSelectedItems()}>
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
						<Link to="/items/deleted-list">Deleted Items</Link>,
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
							<TableCell>Stock Number</TableCell>
							<TableCell>Item</TableCell>
							<TableCell showOnMobile mobileOnly>
								Item Info
							</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Number Of Time's Sold</TableCell>
							<TableCell>Cost Of Good</TableCell>
							<TableCell showOnMobile>Unit Price</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{/* table body */}
						{list &&
							list.constructor === Array &&
							list.map((item, index) => {
								return (
									<TableRow withSeparator key={index}>
										<TableCell showOnMobile>
											<Checkbox
												checked={selected.indexOf(item.id) !== -1}
												square
												value={item.id}
												onChange={() => fn.handleItemSelect(item.id)}
											/>
										</TableCell>
										<TableCell>{item.stocknumber}</TableCell>
										<TableCell>{item.productname}</TableCell>
										<TableCell showOnMobile mobileOnly>
											<span className="item-name">{item.productname}</span>
											<span className="item-description">{item.description}</span>
											<span className="item-number">{item.stocknumber}</span>
										</TableCell>
										<TableCell>{item.description}</TableCell>
										<TableCell>{item.utime || 0}</TableCell>
										<TableCell>{item.costofitem || 0}</TableCell>
										<TableCell showOnMobile>
											<div className="item-unit-price">
												<span className="amount">
													{CURRENCIES_SIGNS[currentBusiness.currency]}
													{thousand(parseInt(item.unitprice).toFixed(2))}
												</span>
												<span className="hidden md:block">
													<Dropdown
														className="d-none d-md-inline-block"
														iconButton
														icon={<i className="material-icons">more_vert</i>}
														options={['Edit', 'Delete']}
														destructiveOption={1}
														align="right"
														variant="link-gray"
														onChange={event =>
															fn.handleItemAction(item.id, event.target.value)
														}
													/>
												</span>
											</div>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
				<div className="md:block">{isFetching && <OverlayProgress />}</div>
			</DashboardSection>
		)}

		{/* {currentBusiness &&
                <div className='spanned mv15 text-center'>
                    <Link to='/items/deleted-list'>Deleted Items</Link>
                </div>
            } */}
	</div>
);

class ItemsHome extends React.Component {
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
			list: [],
			allItems: [], // contains list of all retrieved items
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
			showWelcomeCard: !storageGet(STORAGE_KEYS.ITEMS_WELCOME_CARD_CLOSED) ? true : false,
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
			prevProps.itemCreate.isFetching &&
			!this.props.itemCreate.isFetching &&
			!this.props.itemCreate.errorMessage
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
			prevProps.itemUpdate.isFetching &&
			!this.props.itemUpdate.isFetching &&
			!this.props.itemUpdate.errorMessage
		) {
			this.updateItemsList(this.props.itemUpdate.data);

			if (this.recentlyAdded) {
				this.recentlyAdded.fetch();
			}

			if (this.quickStatistics) {
				this.quickStatistics.fetch();
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		return nextProps.selectedAllItems.checked ? this.handleSelectall() : this.setState({ selected: [] });
	}

	render() {
		return <Template {...this.prps()} fn={this.fn()} />;
	}

	fn = () => ({
		handleItemSelect: itemId => this.handleItemSelect(itemId),
		handleSelectall: () => this.handleSelectall(),
		clearSelectedItems: () => this.clearSelectedItems(),
		handleItemAction: (itemId, action) => this.handleItemAction(itemId, action),
		isDeleting: itemId => this.isDeleting(itemId),
		handleTableDeleteClick: selectedItems => this.handleTableDeleteClick(selectedItems),
		handleTableEditClick: selectedItem => this.handleTableEditClick(selectedItem),
		handleSearchChange: value => this.handleSearchChange(value),
		handleSortChange: value => this.handleSortChange(value),
		handleFilterChange: value => this.handleFilterChange(value),
		handlePaginationNav: value => this.handlePaginationNav(value),
		dismissFilterDialog: () => this.dismissFilterDialog(),
		submitDateFilter: () => this.submitDateFilter(),
		handleFilterDialogClose: () => this.handleFilterDialogClose(),
		handleFilterInputChange: (field, event) => this.handleFilterInputChange(field, event),
		setRef: (name, ref) => this.setRef(name, ref),
		addItem: () => this.props.history.push('items/create'),
		handleActionSelect: (selectedItems, action) => this.handleActionSelect(selectedItems, action),
		handleExport: selectedItems => this.handleExport(selectedItems),
		handleImport: () => this.props.history.push('items/importcsv'),
		handleWelcomeCardCollapse: () => storageStore(STORAGE_KEYS.ITEMS_WELCOME_CARD_CLOSED, 1),
	});
	handleActionSelect(selectedItems, action) {
		console.log(action);
		switch (action) {
			case 'Export List':
				this.handleExport(selectedItems);
				break;
			case 'Import List':
				this.props.history.push('items/importcsv');
				break;
			default:
				// do nothing
				break;
		}
	}
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
		selectAll: this.allItemsAreSelected(),
		sortOptions: this.sortOptions(),
		filter: this.state.filter,
		pagination: this.state.pagination,
		showDateFilter: this.state.showDateFilter,
		filterForm: this.state.filterForm,
		showWelcomeCard: this.state.showWelcomeCard,
	});

	handleExport(selectedItems) {
		for (var i = 0; i < selectedItems.length; i++) {
			let item = find(this.state.list, item => item.id == selectedItems[i]);
			itemsHome.push(item);
		}

		var headers = {
			id: 'Id', // remove commas to avoid errors
			stocknumber: 'Stock Number',
			productname: 'Product Name',
			description: 'Description',
			unitprice: 'Unit Price',
			userid: 'User Id',
			businessid: 'Business Id',
			costofitem: 'Cost Of Item',
			date_created: 'Date Created',
		};
		var itemsFormatted = [];

		// format the data
		itemsHome.forEach(item => {
			itemsFormatted.push({
				id: item.id,
				stocknumber: item.stocknumber,
				productname: item.productname,
				description: item.description,
				unitprice: item.unitprice,
				userid: item.userid,
				businessid: item.businessid,
				costofitem: item.costofitem,
				date_created: item.date_created,
			});
		});

		var fileTitle = 'Exported_Items_List'; // or 'my-unique-title'

		this.exportCSVFile(headers, itemsFormatted, fileTitle);
	}

	exportCSVFile(headers, items, fileTitle) {
		if (headers) {
			items.unshift(headers);
		}

		// Convert Object to JSON
		var jsonObject = JSON.stringify(items);

		var csv = this.convertToCSV(jsonObject);

		var exportedFilename = fileTitle + '.csv' || 'export.csv';

		var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		if (navigator.msSaveBlob) {
			// IE 10+
			navigator.msSaveBlob(blob, exportedFilename);
		} else {
			var link = document.createElement('a');
			if (link.download !== undefined) {
				// feature detection
				// Browsers that support HTML5 download attribute
				var url = URL.createObjectURL(blob);
				link.setAttribute('href', url);
				link.setAttribute('download', exportedFilename);
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

	handleItemAction(itemId, action) {
		console.log(itemId, action);
		let item = find(this.state.list, item => item.id == itemId);
		if (!item) {
			return;
		}
		switch (action) {
			case 'Edit':
				this.props.history.push(`items/${itemId}/edit`);
				break;
			case 'Business Card':
				this.props.history.push(`items/${itemId}/business-card`);
				break;
			case 'Delete':
				this.promptDeleteItems(itemId);
				break;
			default:
				// do nothing
				break;
		}
	}

	handleSelectall() {
		const { list, selected } = this.state;
		if (this.allItemsAreSelected()) {
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

	handleItemSelect(itemId) {
		let selected = [...this.state.selected];

		if (selected.indexOf(itemId) == -1) {
			if (!this.isDeleting(itemId)) {
				selected.push(itemId);
			}
		} else {
			selected.splice(selected.indexOf(itemId), 1);
		}

		this.setState({
			selected: selected,
		});
	}

	allItemsAreSelected() {
		return (
			this.state.selected.length > 0 &&
			this.state.list.length > 0 &&
			this.state.selected.length >= this.state.list.length
		);
	}

	clearSelectedItems() {
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
			GET_ITEMS({
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
						list: response.products,
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
							allItems: response.products,
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

	promptDeleteItems(itemId) {
		if (this.isDeleting(itemId)) {
			return;
		}
		if (itemId && itemId.constructor === Array && itemId.length < 1) {
			return;
		}
		this.props.showAlertDialog(
			``,
			`Are you sure you want to delete the selected item${(itemId &&
				itemId.constructor === Array &&
				itemId.length >= 2 &&
				's') ||
				''}?`,
			[
				{ text: 'No', onClick: () => this.props.hideAlertDialog() },
				{ text: 'Yes', onClick: () => this.doDeleteItem(itemId), variant: 'destructive' },
			]
		);
	}

	doDeleteItem(itemId) {
		if (this.isDeleting(itemId)) {
			return;
		}

		if (!this.prepDeleteItemsData(itemId)) {
			return;
		}

		this.addToDeleteList(itemId);

		this.setState({
			isFetching: true,
		});

		DELETE_ITEM(this.prepDeleteItemsData(itemId))
			.then(() => {
				this.props.showSnackbar(`Item${(itemId && itemId.constructor === Array && 's') || ''} deleted`, {
					variant: 'success',
				});
				this.removeFromDeleteList(itemId);
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
					`Failed to delete selected item${(itemId &&
						itemId.constructor == Array &&
						itemId.length > 0 &&
						's') ||
						''}.`;
				this.props.showSnackbar(MessageParser(errorMessage), { variant: 'error' });
				this.removeFromDeleteList(itemId);
				this.setState({
					isFetching: false,
				});
			});
	}

	isDeleting(itemId) {
		if (itemId && itemId.constructor == Array) {
			for (var i = 0; i < itemId.length; i++) {
				if (this.state.deletingList.indexOf(itemId[i]) != -1) {
					return true;
				}
			}
			return false;
		}
		return this.state.deletingList.indexOf(itemId) != -1;
	}

	addToDeleteList(itemId) {
		let deletingList = [].concat(this.state.deletingList);
		if (itemId && itemId.constructor === Array) {
			for (var i = 0; i < itemId.length; i++) {
				if (deletingList.indexOf(itemId[i]) == -1) {
					deletingList.push(itemId[i]);
				}
			}
			this.setState({
				deletingList: deletingList,
			});
			return;
		}

		deletingList.push(itemId);
		this.setState({
			deletingList: deletingList,
		});
	}

	removeFromDeleteList(itemId) {
		let deletingList = [].concat(this.state.deletingList);
		if (itemId && itemId.constructor == Array) {
			for (var i = 0; i < itemId.length; i++) {
				if (deletingList.indexOf(itemId[i]) != -1) {
					deletingList.splice(deletingList.indexOf(itemId[i]), 1);
				}
			}
			this.setState({
				deletingList: deletingList,
			});
			return;
		}

		deletingList.splice(deletingList.indexOf(itemId), 1);
		this.setState({
			deletingList: deletingList,
		});
	}

	updateItemsList(itemInfo) {
		let list = [...this.state.list];
		let itemIndex = findIndex(list, item => item.id == itemInfo.id);
		if (itemIndex !== -1) {
			let itemInfoUpdate = Object.assign({}, list[itemIndex], itemInfo);
			list.splice(itemIndex, 1, itemInfoUpdate);
			this.setState({
				list: list,
			});
		}
	}

	handleTableEditClick(selectedItem) {
		if (selectedItem && selectedItem.constructor === Array && selectedItem.length > 0) {
			this.props.history.push(`/items/${selectedItem[0]}/edit`);
		}
	}

	handleTableDeleteClick(selectedItems) {
		if (selectedItems && selectedItems.constructor === Array && selectedItems.length > 0) {
			this.promptDeleteItems(selectedItems);
		}
	}

	prepDeleteItemsData(itemId) {
		if (!itemId) {
			return;
		}

		let business = this.currentBusiness();

		if (itemId.constructor == Array) {
			let list = [];

			for (var i = 0; i < itemId.length; i++) {
				if (typeof itemId[i] !== 'string' && typeof itemId[i] !== 'number') {
					continue;
				}
				list.push({
					productid: itemId[i],
					businessid: business.id,
					userid: this.props.userInfo.data && this.props.userInfo.data.userid,
				});
			}

			return (list.length > 0 && { items: list }) || null;
		}

		if (typeof itemId == 'string' || typeof itemId == 'number') {
			return {
				productid: itemId,
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
			this.props.history.push(`/items${(params.length > 0 && '?' + params.join('&')) || ''}`);
		}
		this.fetch();
	}

	sortOptions() {
		// 'Newest to Old', 'Stock Number 0-9', 'Item Name A-Z', 'Time\'s Sold(From highest)', 'Unit Price From highest'
		const { filter } = this.state;
		let options = [];
		// Add creation date option
		options.push(
			(filter.sortBy == 'date_created' && filter.sortOrder == 'desc' && 'Oldest to New') || 'Newest to Old'
		);
		// Add company name option
		options.push(
			(filter.sortBy === 'stocknumber' && filter.sortOrder == 'asc' && 'Stock Number 9-0') || 'Stock Number 0-9'
		);
		// Add person name option
		options.push((filter.sortBy === 'item' && filter.sortOrder == 'asc' && 'Item Name Z-A') || 'Item Name A-Z');
		// Add total paid
		options.push(
			(filter.sortBy === 'nooftimessold' && filter.sortOrder == 'desc' && 'From Lowest Sale') ||
				'From Highest Sale'
		);
		// Add total outstanding
		options.push(
			(filter.sortBy === 'unitprice' && filter.sortOrder === 'desc' && 'Unit Price(from lowest)') ||
				'Unit Price(from highest)'
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
			case 'Stock Number 9-0':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'stocknumber',
						sortOrder: 'desc',
					}),
				});
				break;
			case 'Stock Number 0-9':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'stocknumber',
						sortOrder: 'asc',
					}),
				});
				break;
			case 'Item Name Z-A':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'item',
						sortOrder: 'asc',
					}),
				});
				break;
			case 'Item Name A-Z':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'item',
						sortOrder: 'desc',
					}),
				});
				break;
			case 'From Lowest Sale':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'nooftimessold',
						sortOrder: 'asc',
					}),
				});
				break;
			case 'From Highest Sale':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'nooftimessold',
						sortOrder: 'desc',
					}),
				});
				break;
			case 'Unit Price(from lowest)':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'unitprice',
						sortOrder: 'asc',
					}),
				});
				break;
			case 'Unit Price(from highest)':
				this.setState({
					filter: Object.assign({}, filter, {
						sortBy: 'unitprice',
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

	conformToInputDate(date) {
		var d = new Date(date);
		return (d.getTime() && `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() + 1}`) || '';
	}
}

const mapStateToProps = ({ userInfo, itemCreate, itemUpdate, selectedAllItems }) => ({
	userInfo,
	itemCreate,
	itemUpdate,
	selectedAllItems: selectedAllItems,
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
)(withRouter(ItemsHome));
