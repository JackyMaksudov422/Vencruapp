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
import { GET_INVOICES, RESTORE_INVOICE,RESTORE_MULTIPLE_CLIENTS } from '../../configs/api.config';
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
                    title={`Cancelled Invoices`}
                >
                    <div className='spanned h30'>&nbsp;</div>
                    <button className='vc-button' style={{'color':'white','fontWeight':'700', 'backgroundColor': '#666'}} onClick={() => fn.handleTableRestoreClick(selected)}>Restore</button>
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
                                    <TableCell showOnMobile>
                                        <h4 className="mt0 normal-font mb5 text-black">{`${item.client.firstname} ${item.client.lastname}`}</h4>
										<h5 className="mv0 normal-font text-gray">{item.invoicenumber}</h5>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-black">{moment(item.issue_date).format('DD/MM/YYYY')}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-black">{moment(item.due_date).format('DD/MM/YYYY')}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-black mr10">
											{`${CURRENCIES_SIGNS[currentBusiness.currency] || '$'}${thousand(
												parseFloat(item.subtotal).toFixed(2)
											)}`}
										</span>
                                        {item.invoicestatus === 'Cancelled' && (
											<span className="invoice-status invoice-status-cancelled">
												Cancelled
											</span>
										)}
                                    </TableCell>
                                    <TableCell showOnMobile>
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
                                            options={['Restore', 'Delete']}
                                            destructiveOption={1}
                                            align='right'
                                            variant='link-gray'
                                            onChange={(event) => fn.handleInvoiceActions(item.id, event.target.value)}
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

class InvoicesCancelled extends React.Component {
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

    componentDidMount(){
        if(this.props.userInfo.data){
            this.fetch();
        }
    }

    componentDidUpdate(prevProps, prevState){
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
        handleInvoiceActions: (clientId, action) => this.handleInvoiceActions(clientId, action),
        isRestoring: (clientId) => this.isRestoring(clientId),
        handleTableRestoreClick: (selectedClients) => this.handleTableRestoreClick(selectedClients),
        handleSearchChange: (value) => this.handleSearchChange(value),
        handleActions: (action) => this.handleActions(action)
    })

    prps = () => ({
        userInfo: this.props.userInfo.data,
        currentBusiness: this.currentBusiness(),
        isFetching: this.state.isFetching,
        list: this.state.list,
        selected: this.state.selected,
        selectAll: this.allClientsAreSelected()
    })

    handleInvoiceActions(invoiceId, action) {
        let invoice = find(this.state.list, (item) => item.id === invoiceId);
        if (!invoice) {
            return;
        }
        switch (action) {
            case 'Restore':
            this.promptRestoreClients(invoiceId)
                break;
            case 'Delete':
                break;
            default:
                break;
        }
    }

    handleActions(action){
        switch (action) {
            case 'Edit':
                // this.props.history.push(`clients/${clientId}/edit`)
                break;
            case 'Restore':
                this.promptRestoreClients(this.state.selected);
                break;
            default:
                // do nothing
                break;
        }
    }

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

    handleClientSelect(invoiceId){
        let selected = [...this.state.selected];

        if(selected.indexOf(invoiceId) === -1){
            if(!this.isRestoring(invoiceId)){
                selected.push(invoiceId);
            }
        }
        else{
            selected.splice(selected.indexOf(invoiceId), 1);
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
                status: 'cancelled'
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

    promptRestoreClients(invoiceId){
        if(this.isRestoring(invoiceId)){
            return;
        }
        if(invoiceId && invoiceId.constructor === Array && invoiceId.length < 1){
            return;
        }
        this.props.showAlertDialog(
            ``,
            `Are you sure you want to restore the selected client${invoiceId && invoiceId.constructor === Array && invoiceId.length >= 2 && 's' || ''}?`,
            [
                {text: 'No', onClick: () => this.props.hideAlertDialog(), variant: 'gray'},
                {text: 'Yes, Restore', onClick: () => this.doRestoreClient(invoiceId)},
            ]
        );
    }
        
    isRestoring(invoiceId){
        if(invoiceId && invoiceId.constructor === Array){
            for(var i = 0; i < invoiceId.length; i++){
                if(this.state.deletingList.indexOf(invoiceId[i]) !== -1){
                    return true;
                }
            }
            return false;
        }
        return this.state.deletingList.indexOf(invoiceId) !== -1;
    }

    handleTableRestoreClick(selectedInvoices){
        if(selectedInvoices && selectedInvoices.constructor === Array && selectedInvoices.length > 0){
            this.promptRestoreClients(selectedInvoices);
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InvoicesCancelled));