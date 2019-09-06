import * as React from 'react';
import { withRouter } from 'react-router-dom';
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
import { GET_DELETED_ITEMS, RESTORE_ITEM } from '../../configs/api.config';
import OverlayProgress from '../presentation/OverlayProgress';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import Button from '../presentation/Button';
import { CURRENCIES_SIGNS } from '../../configs/data.config';
import { thousand } from '../../helpers/Misc';

/**
 * component template
 */
let Template = ({ fn, currentBusiness, isFetching, list, selectAll, selected }) => (
    <div className='app-authenticated-body'>
        <div className='vc-items-deleted-list'>
            {currentBusiness &&
                <DashboardSection
                    title={`Deleted Items`}
                >
                    <div className='spanned h30'>&nbsp;</div>
                    <Table
                        controlActions={['Restore']}
                        onControlActionChange={(action) => fn.handleActions(action)}
                        controlLeftActions={[
                            <Button
                                variant='gray'
                                onClick={() => fn.handleRestore(selected)}
                                disabled={selected.length < 1}
                                size='sm'
                            >
                                Restore
                            </Button>
                        ]}
                    >
                        {/* table head */}
                        <TableHead>
                            <TableRow type='th'>
                                <TableCell>
                                    <Checkbox
                                        square
                                        checked={selectAll}
                                        onChange={() => fn.handleSelectall()}
                                    />
                                </TableCell>
                                <TableCell>
                                    Stock Number
                                </TableCell>
                                <TableCell>
                                    Item
                                </TableCell>
                                <TableCell showOnMobile mobileOnly>
                                    Item Info
                                </TableCell>
                                <TableCell>
                                    Description
                                </TableCell>
                                <TableCell>
                                    Number Of Time's Sold
                                </TableCell>
                                <TableCell>
                                    Cost Of Good
                                </TableCell>
                                <TableCell showOnMobile>
                                    Unit Price
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {/* table body */}
                            {list && list.constructor === Array && list.map((item, index) => {
                                return (
                                    <TableRow withSeparator key={index}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selected.indexOf(item.id) !== -1}
                                                square
                                                value={item.id}
                                                onChange={() => fn.handleItemSelect(item.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {item.stocknumber}
                                        </TableCell>
                                        <TableCell>
                                            {item.productname}
                                        </TableCell>
                                        <TableCell showOnMobile mobileOnly>
                                            <span className="item-name">{item.productname}</span>
                                            <span className="item-description">{item.description}</span>
                                            <span className="item-number">{item.stocknumber}</span>                                                                                                                                    
                                        </TableCell>
                                        <TableCell>
                                            {item.description}
                                        </TableCell>
                                        <TableCell>
                                            {item.utime || 0}
                                        </TableCell>
                                        <TableCell>
                                            {item.costofitem || 0}
                                        </TableCell>
                                        <TableCell showOnMobile>
                                            <div className='item-unit-price'>
                                                <span className='amount'>
                                                    { CURRENCIES_SIGNS[currentBusiness.currency] }
                                                    { thousand(parseInt(item.unitprice).toFixed(2)) }
                                                </span>
                                                <Dropdown
                                                    iconButton
                                                    icon={<i className='material-icons'>more_vert</i>}
                                                    options={['Restore']}
                                                    align='right'
                                                    variant='link-gray'
                                                    onChange={(event) => fn.handleItemAction(item.id, event.target.value)}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                    {isFetching && <OverlayProgress />}
                </DashboardSection>
            }
        </div>
    </div>
);

class ItemsHome extends React.Component {
    state = {
        isFetching: false,
        filter: {
            page: 1,
            fromDate: null,
            toDate: null,
            sortBy: null,
            sortOrder: 'desc',
        },
        list: [],
        ready: false,
        selected: [],
        deletingList: []
    };

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

        if (prevProps.location.search !== this.props.location.search) {
            this.fetch();
        }

        if (prevProps.itemCreate.isFetching &&
            !this.props.itemCreate.isFetching &&
            !this.props.itemCreate.errorMessage
        ) {
            if (this.state.page > 1 ||
                this.state.ToDate ||
                this.state.ToDate
            ) {
                this.setState({
                    filter: Object.assign({}, this.state.filter, {
                        page: 1,
                        FromDate: null,
                        ToDate: null
                    })
                });
            }
            else {
                this.fetch();
            }
        }

        if (prevProps.itemUpdate.isFetching &&
            !this.props.itemUpdate.isFetching &&
            !this.props.itemUpdate.errorMessage
        ) {
            this.updateItem(this.props.itemUpdate.data);
        }
    }

    render() {
        return <Template
            {...this.prps()}
            fn={this.fn()}
        />;
    }

    fn = () => ({
        handleItemSelect: (itemId) => this.handleItemSelect(itemId),
        handleSelectall: () => this.handleSelectall(),
        handleItemAction: (itemId, action) => this.handleItemAction(itemId, action),
        isRestoring: (itemId) => this.isRestoring(itemId),
        handleTableRestoreClick: (selectedItems) => this.handleTableRestoreClick(selectedItems),
        handleSearchChange: (value) => this.handleSearchChange(value),
        handleActions: (action) => this.handleActions(action),
        handleRestore: (selected) => this.handleRestore(selected),
    })

    prps = () => ({
        userInfo: this.props.userInfo.data,
        currentBusiness: this.currentBusiness(),
        isFetching: this.state.isFetching,
        list: this.state.list,
        selected: this.state.selected,
        selectAll: this.allItemsAreSelected()
    })

    handleItemAction(itemId, action) {
        console.log(itemId, action)
        let item = find(this.state.list, (item) => item.id === itemId);
        if (!item) {
            return;
        }
        switch (action) {
            case 'Edit':
                this.props.history.push(`items/${itemId}/edit`)
                break;
            case 'Business Card':
                this.props.history.push(`items/${itemId}/business-card`)
                break;
            case 'Restore':
                console.log('Heya');
                this.promptRestoreItems(itemId)
                break;
            default:
                // do nothing
                break;
        }
    }

    handleRestore(selected) {
        this.promptRestoreItems(selected)
    }

    handleActions(action) {
        console.log(action);
        switch (action) {
            case 'Edit':
                // this.props.history.push(`items/${itemId}/edit`)
                break;
            case 'Business Card':
                // this.props.history.push(`items/${itemId}/business-card`)
                break;
            case 'Restore':
                this.promptRestoreItems(this.state.selected);
                break;
            default:
                // do nothing
                break;
        }
    }

    handleSelectall() {
        const { list } = this.state;
        if (this.allItemsAreSelected()) {
            this.setState({
                selected: []
            });
            return;
        }
        let selectList = [];
        for (var i = 0; i < list.length; i++) {
            if (!list[i]['id'] || this.isRestoring(list[i]['id'])) {
                continue;
            }
            selectList.push(list[i]['id']);
        }
        this.setState({
            selected: selectList
        })
    }

    handleItemSelect(itemId) {
        let selected = [...this.state.selected];

        if (selected.indexOf(itemId) === -1) {
            if (!this.isRestoring(itemId)) {
                selected.push(itemId);
            }
        }
        else {
            selected.splice(selected.indexOf(itemId), 1);
        }

        this.setState({
            selected: selected
        });
    }

    allItemsAreSelected() {
        return this.state.selected.length > 0 &&
            this.state.list.length > 0 &&
            this.state.selected.length >= this.state.list.length;
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
        this.setState({
            isFetching: true
        });
        setTimeout(() => {
            GET_DELETED_ITEMS({
                BusinessId: business ? business.id : null
            }).then(response => {
                this.setState({
                    isFetching: false,
                    list: response.products,
                    selected: [],
                    selectAll: false
                });
            }).catch(error => {
                let errorMessage = 'An error occured while making your request.';
                if(typeof error === 'string' && error.trim().length > 0){
                    errorMessage = error;
                }
                this.props.showSnackbar(
                    errorMessage, 
                    {variant: 'error'}
                );
                this.setState({
                    isFetching: false,
                    page: this.state.page > 1 && this.state.page - 1
                });
            })
        }, 1000);
    }

    promptRestoreItems(itemId) {
        if (this.isRestoring(itemId)) {
            return;
        }
        if (itemId && itemId.constructor === Array && itemId.length < 1) {
            return;
        }
        this.props.showAlertDialog(
            ``,
            `Are you sure you want to restore the selected item${itemId && itemId.constructor === Array && itemId.length >= 2 && 's' || ''}?`,
            [
                { text: 'No', onClick: () => this.props.hideAlertDialog(), variant: 'gray' },
                { text: 'Yes, Restore', onClick: () => this.doRestoreItem(itemId) },
            ]
        );
    }

    doRestoreItem(itemId) {
        if (this.isRestoring(itemId)) {
            return;
        }

        if (!this.prepRestoreItemsData(itemId)) {

        }

        this.addToRestoreList(itemId)

        this.setState({
            isFetching: true
        });

        RESTORE_ITEM(
            this.prepRestoreItemsData(itemId)
        ).then(() => {
            this.props.showSnackbar(`Item${itemId && itemId.constructor === Array && 's' || ''} restored`, { variant: 'success' });
            this.removeFromRestoreList(itemId);
            setTimeout(() => {
                this.setState({
                    isFetching: false
                }, () => {
                    this.fetch()
                });
            }, 100);
        }).catch(error => {
            let errorMessage = typeof error === 'string' && error.length > 0 && error || `Failed to restore selected item${itemId && itemId.constructor === Array && itemId.length > 0 && 's' || ''}.`;
            this.props.showSnackbar(errorMessage, { variant: 'error' });
            this.removeFromRestoreList(itemId);
            this.setState({
                isFetching: false
            });
        });
    }

    isRestoring(itemId) {
        if (itemId && itemId.constructor === Array) {
            for (var i = 0; i < itemId.length; i++) {
                if (this.state.deletingList.indexOf(itemId[i]) !== -1) {
                    return true;
                }
            }
            return false;
        }
        return this.state.deletingList.indexOf(itemId) !== -1;
    }

    addToRestoreList(itemId) {
        let deletingList = [].concat(this.state.deletingList);
        if (itemId && itemId.constructor === Array) {
            for (var i = 0; i < itemId.length; i++) {
                if (deletingList.indexOf(itemId[i]) === -1) {
                    deletingList.push(itemId[i]);
                }
            }
            this.setState({
                deletingList: deletingList
            });
            return;
        }

        deletingList.push(itemId);
        this.setState({
            deletingList: deletingList
        });
    }

    removeFromRestoreList(itemId) {
        let deletingList = [].concat(this.state.deletingList);
        if (itemId && itemId.constructor === Array) {
            for (var i = 0; i < itemId.length; i++) {
                if (deletingList.indexOf(itemId[i]) !== -1) {
                    deletingList.splice(deletingList.indexOf(itemId[i]), 1);
                }
            }
            this.setState({
                deletingList: deletingList
            });
            return;
        }

        deletingList.splice(deletingList.indexOf(itemId), 1);
        this.setState({
            deletingList: deletingList
        });
    }

    updateItem(itemInfo) {
        let list = [...this.state.list];
        let itemIndex = findIndex(list, item => item.id === itemInfo.id);
        if (itemIndex !== -1) {
            let itemInfoUpdate = Object.assign({}, list[itemIndex], itemInfo)
            list.splice(itemIndex, 1, itemInfoUpdate);
            this.setState({
                list: list
            });
        }
    }

    handleTableRestoreClick(selectedItems) {
        if (selectedItems && selectedItems.constructor === Array && selectedItems.length > 0) {
            this.promptRestoreItems(selectedItems);
        }
    }

    prepRestoreItemsData(itemId) {
        if (!itemId) {
            return;
        }

        let business = this.currentBusiness();

        if (itemId.constructor === Array) {

            let list = [];

            for (var i = 0; i < itemId.length; i++) {
                if (typeof itemId[i] !== 'string' &&
                    typeof itemId[i] !== 'number'
                ) {
                    continue;
                }
                list.push({
                    productid: itemId[i],
                    businessid: business.id,
                    userid: this.props.userInfo.data && this.props.userInfo.data.userid,
                });
            }

            return list.length > 0 && { items: list } || null;
        }

        if (typeof itemId === 'string' || typeof itemId === 'number') {
            return {
                productid: itemId,
                businessid: business.id
            }
        }

        return null;
    }

    handleSearchChange(search) {
        this.setState({
            filter: Object.assign({}, this.state.filter, {
                Search: search
            })
        });
    }

    handleFilterChanged(filter) {
        if (filter && filter.constructor === Object && Object.keys(filter).length > 0) {
            let params = [];
            let filterFields = Object.keys(filter);
            for (var i = 0; i < filterFields.length; i++) {
                if (filter[filterFields[i]] === null ||
                    filter[filterFields[i]] === undefined ||
                    (typeof filter[filterFields[i]] === 'string' && filter[filterFields[i]].length < 1)
                ) {
                    continue;
                }
                params.push(`${filterFields[i]}=${encodeURIComponent(filter[filterFields[i]])}`);
            }
            this.props.history.push(`/items${params.length > 0 && '?' + params.join('&') || ''}`);
        }
    }
}

const mapStateToProps = ({
    userInfo,
    itemCreate,
    itemUpdate
}) => ({
    userInfo,
    itemCreate,
    itemUpdate
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showSnackbar: ActionCreators.showSnackbar,
    showAlertDialog: ActionCreators.showAlertDialog,
    hideAlertDialog: ActionCreators.hideAlertDialog
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ItemsHome));