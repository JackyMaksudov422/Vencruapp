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
import Dropdown from '../presentation/Dropdown';
import { GET_INVOICES} from '../../configs/api.config';
import OverlayProgress from '../presentation/OverlayProgress';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import moment from 'moment';
import { thousand } from '../../helpers/Misc';
import { CURRENCIES_SIGNS } from '../../configs/data.config';

/**
 * component template
 */
let Template = ({fn, currentBusiness, isFetching, list, selectAll, selected}) => (
    <div className='app-authenticated-body'>
        <div className='vc-clients-deleted-list'>
            
            { currentBusiness &&
                <DashboardSection
                    title={`Draft Invoices`}
                >
                    {/* <div className='spanned h30'>&nbsp;</div> */}
                    <Table
                        controlActions={['Restore']}
                        onControlActionChange={(action) => fn.handleActions(action)}
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
                        {list && list.constructor === Array && list.map((item, index) => {
                            return (
                                <TableRow withSeparator key={index}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selected.indexOf(item.id) !== -1}
                                            square 
                                            value={item.id}
                                            onChange={() => fn.handleClientSelect(item.id)}
                                        />
                                    </TableCell>
                                    <TableCell 
                                        onClick={() => {
                                            fn.handleInvoiceClicked(item.id);
                                        }} showOnMobile>
                                        <h4 className="mt0 normal-font mb5 text-black">{`${item.client.firstname} ${item.client.lastname}`}</h4>
										<h5 className="mv0 normal-font text-gray">{item.invoicenumber}</h5>
                                    </TableCell>
                                    <TableCell
                                        onClick={() => {
                                            fn.handleInvoiceClicked(item.id);
                                        }} >
                                        <span className="text-black">{moment(item.issue_date).format('DD/MM/YYYY')}</span>
                                    </TableCell>
                                    <TableCell
                                        onClick={() => {
                                            fn.handleInvoiceClicked(item.id);
                                        }}>
                                        <span className="text-black">{moment(item.due_date).format('DD/MM/YYYY')}</span>
                                    </TableCell>
                                    <TableCell
                                        onClick={() => {
                                            fn.handleInvoiceClicked(item.id);
                                        }} >
                                        <span className="text-black mr10">
											{`${CURRENCIES_SIGNS[currentBusiness.currency] || '$'}${thousand(
												parseFloat(item.subtotal).toFixed(2)
											)}`}
										</span>
                                        {item.invoicestatus === 'draft' && (
											<span className="invoice-status invoice-status-draft">draft</span>
										)}
                                    </TableCell>
                                    <TableCell 
                                        onClick={() => {
                                            fn.handleInvoiceClicked(item.id);
                                        }} showOnMobile>
                                            <span className="text-lg text-brand-blue md:text-sm md:text-black">
												{`${CURRENCIES_SIGNS[currentBusiness.currency] ||
													'$'}${thousand(
													parseFloat(item.amountdue - item.amountpaid).toFixed(2)
												)}`}
											</span>
                                    </TableCell>
                                    <TableCell>
                                        <Dropdown
                                            iconButton
                                            icon={<i className='material-icons'>more_vert</i>}
                                            options={['Edit']}
                                            align='right'
                                            variant='link-gray'
                                            onChange={(event) => fn.handleActionType(item.id, event.target.value)}
                                        />                                  
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        </TableBody>
                    </Table>
                    {isFetching && <OverlayProgress/>}
                </DashboardSection>
            }
        </div>
    </div>
);

class InvoiceDraft extends React.Component {
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
        selected: []
    };

    componentDidMount(){
        if(this.props.userInfo.data){
            this.fetch();
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(!isEqual(prevProps.userInfo, this.props.userInfo)){
            if(this.props.userInfo && !this.state.ready){
                this.fetch();
            }
        }

        if(!isEqual(prevState.filter, this.state.filter) && !prevState.isFetching){
            this.handleFilterChanged(this.state.filter);
        }

        if(prevProps.location.search !== this.props.location.search){
            this.fetch();
        }
    }

    render(){
        return <Template 
            {...this.prps()} 
            fn={this.fn()} 
        />;
    }

    fn = () => ({
        handleClientSelect: (clientId) => this.handleClientSelect(clientId),
        handleSelectall: () => this.handleSelectall(),
        handleInvoiceClicked: invoiceId => this.handleInvoiceClicked(invoiceId),
        handleActionType: (invoiceId, action) => this.handleActionType(invoiceId, action),
        handleSearchChange: (value) => this.handleSearchChange(value),
    })

    prps = () => ({
        userInfo: this.props.userInfo.data,
        currentBusiness: this.currentBusiness(),
        isFetching: this.state.isFetching,
        list: this.state.list,
        selected: this.state.selected,
        selectAll: this.allClientsAreSelected()
    })

    handleActionType(invoiceId, action) {
        let client = find(this.state.list, (item) => item.id === invoiceId);
        if (!client) {
            return;
        }
        switch (action) {
            case 'Edit':
                this.props.history.push(`/sales/${invoiceId}/edit`)
                break;
            default:
                // do nothing
                break;
        }
    }

    handleInvoiceClicked = invoiceId => {
		this.props.history.push(`/sales/${invoiceId}/edit`);
	};

    handleSelectall(){
        const { list } = this.state;
        if(this.allClientsAreSelected()){
            this.setState({
                selected: []
            });
            return;
        }
        let selectList = [];
        for(var i = 0; i < list.length; i++){
            if(!list[i]['id'] || this.isRestoring(list[i]['id'])){
                continue;
            }
            selectList.push(list[i]['id']);
        }
        this.setState({
            selected: selectList
        })
    }

    handleClientSelect(clientId){
        let selected = [...this.state.selected];

        if(selected.indexOf(clientId) === -1){
            if(!this.isRestoring(clientId)){
                selected.push(clientId);
            }
        }
        else{
            selected.splice(selected.indexOf(clientId), 1);
        }

        this.setState({
            selected: selected
        });
    }

    allClientsAreSelected(){
        return this.state.selected.length > 0 && 
                this.state.list.length > 0 && 
                this.state.selected.length >= this.state.list.length;
    }

    currentBusiness(){
        const { data } = this.props.userInfo;
        if(data && data.business){
            return find(data.business, item => item.id === data.currentbusinessid) || null;
        }
        return null;
    }

    fetch(){
        let business = this.currentBusiness();
        this.setState({ 
            isFetching: true 
        });

        GET_INVOICES({
            businessId: business ? business.id : null,
            sortBy: 'date_created',
            status: 'draft'
        }).then(response => {
            this.setState({ 
                isFetching: false,
                list: response.invoices,
                selected: [],
                selectAll: false
            });
        }).catch( error => {
            let errorMessage = typeof error === 'string' && error.length > 0 && error || 'An error occured while making your request..';
            this.props.showSnackbar(errorMessage);
            this.setState({ 
                isFetching: false,
                page: this.state.page > 1 && this.state.page - 1
            });
        })
    }

}

const mapStateToProps = ({
    userInfo
}) => ({ 
    userInfo
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showSnackbar: ActionCreators.showSnackbar,
    showAlertDialog: ActionCreators.showAlertDialog,
    hideAlertDialog: ActionCreators.hideAlertDialog
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InvoiceDraft));