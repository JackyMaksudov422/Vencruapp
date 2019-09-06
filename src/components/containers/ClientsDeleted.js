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
import ClientBasicInfo from '../presentation/ClientBasicInfo';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import findIndex from 'lodash/findIndex';
import Dropdown from '../presentation/Dropdown';
import { GET_DELETED_CLIENTS, RESTORE_CLIENT,RESTORE_MULTIPLE_CLIENTS } from '../../configs/api.config';
import OverlayProgress from '../presentation/OverlayProgress';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';

/**
 * component template
 */
let Template = ({fn, currentBusiness, isFetching, list, selectAll, selected}) => (
    <div className='app-authenticated-body'>
        <div className='vc-clients-deleted-list'>
            
            { currentBusiness &&
                <DashboardSection
                    title={`Deleted Clients`}
                >
                    <div className='spanned h30'>&nbsp;</div>
                    <button className='vc-button' style={{'color':'white','fontWeight':'700', 'background-color': '#666'}} onClick={() => fn.handleTableRestoreClick(selected)}>Restore</button>
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
                                <TableCell showOnMobile>
                                    Basic Info
                                </TableCell>
                                <TableCell>
                                    Company
                                </TableCell>
                                <TableCell>
                                    Phone
                                </TableCell>
                                <TableCell>
                                    TotalPaid
                                </TableCell>
                                <TableCell showOnMobile>
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
                                        <ClientBasicInfo
                                            name={`${item.firstname} ${item.lastname}`}
                                            email={item.companyemail}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        { item.companyname }
                                    </TableCell>
                                    <TableCell>
                                        { item.phonenumber }
                                    </TableCell>
                                    <TableCell>
                                        { item.totalpaid || `N0.00`}
                                    </TableCell>
                                    <TableCell showOnMobile>
                                        <div className='client-total-outstanding'>
                                            <span className='amount'>{ item.totaloutstanding || `N2500.00` }</span>
                                            <Dropdown
                                                iconButton
                                                icon={<i className='material-icons'>more_vert</i>}
                                                options={['Restore']}
                                                align='right'
                                                variant='link-gray'
                                                onChange={(event) => fn.handleClientAction(item.id, event.target.value)}
                                            />
                                        </div>
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

class ClientsHome extends React.Component {
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

        if( prevProps.clientCreate.isFetching && 
            !this.props.clientCreate.isFetching &&
            !this.props.clientCreate.errorMessage
        ){
            if( this.state.page > 1 || 
                this.state.ToDate || 
                this.state.ToDate
            ){
                this.setState({
                    filter: Object.assign({}, this.state.filter, {
                        page: 1,
                        FromDate: null,
                        ToDate: null
                    })
                });
            }
            else{
                this.fetch();
            }
        }

        if( prevProps.clientUpdate.isFetching && 
            !this.props.clientUpdate.isFetching &&
            !this.props.clientUpdate.errorMessage
        ){
            this.updateClient(this.props.clientUpdate.data);
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
        handleClientAction: (clientId, action) => this.handleClientAction(clientId, action),
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
    handleClientAction(clientId, action) {
        let client = find(this.state.list, (item) => item.id === clientId);
        if (!client) {
            return;
        }
        switch (action) {
            case 'Edit':
                this.props.history.push(`clients/${clientId}/edit`)
                break;
            case 'Business Card':
                this.props.history.push(`clients/${clientId}/business-card`)
                break;
            case 'Restore':
                console.log("Got restore option...")
                this.promptRestoreClients(clientId)
                break;
            default:
                // do nothing
                break;
        }
    }

    handleActions(action){
        console.log(action);
        switch (action) {
            case 'Edit':
                // this.props.history.push(`clients/${clientId}/edit`)
                break;
            case 'Business Card':
                // this.props.history.push(`clients/${clientId}/business-card`)
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
        setTimeout(() => {
            GET_DELETED_CLIENTS({
                BusinessId: business ? business.id : null
            }).then(response => {
                this.setState({ 
                    isFetching: false,
                    list: response.clients,
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
        }, 1000);
    }

    promptRestoreClients(clientId){
        if(this.isRestoring(clientId)){
            return;
        }
        if(clientId && clientId.constructor === Array && clientId.length < 1){
            return;
        }
        this.props.showAlertDialog(
            ``,
            `Are you sure you want to restore the selected client${clientId && clientId.constructor === Array && clientId.length >= 2 && 's' || ''}?`,
            [
                {text: 'No', onClick: () => this.props.hideAlertDialog(), variant: 'gray'},
                {text: 'Yes, Restore', onClick: () => this.doRestoreClient(clientId)},
            ]
        );
    }

    doRestoreClient(clientId){
        if(this.isRestoring(clientId)){
            return;
        }

        if(!this.prepRestoreClientsData(clientId)){

        }
        
        this.addToRestoreList(clientId)
        
        this.setState({
            isFetching: true
        });
        if(typeof clientId === 'number'){
            console.log('First case');
            RESTORE_CLIENT(
                this.prepRestoreClientsData(clientId)
            ).then(() => {
                this.props.showSnackbar(`Client${clientId && clientId.constructor === Array && 's' || '' } restored`, {variant: 'success'});
                
                this.removeFromRestoreList(clientId);
                setTimeout(() => {
                    this.setState({
                        isFetching: false
                    }, () => {
                        this.fetch()
                    });
                }, 100);
            }).catch(error => {
                let errorMessage = typeof error === 'string' && error.length > 0 && error || `Failed to restore selected client${clientId && clientId.constructor === Array && clientId.length > 0 && 's' || ''}.`;
                this.props.showSnackbar(errorMessage, {variant: 'error'});
                this.removeFromRestoreList(clientId);
                this.setState({ 
                    isFetching: false
                });
            });
        }
        else{
            console.log(this.prepRestoreClientsData(clientId));
            RESTORE_MULTIPLE_CLIENTS(
                this.prepRestoreClientsData(clientId)
            ).then(() => {
                this.props.showSnackbar(`Client${clientId && clientId.constructor === Array && 's' || '' } restored`, {variant: 'success'});
                
                this.removeFromRestoreList(clientId);
                setTimeout(() => {
                    this.setState({
                        isFetching: false
                    }, () => {
                        this.fetch()
                    });
                }, 100);
            }).catch(error => {
                let errorMessage = typeof error === 'string' && error.length > 0 && error || `Failed to restore selected client${clientId && clientId.constructor === Array && clientId.length > 0 && 's' || ''}.`;
                this.props.showSnackbar(errorMessage, {variant: 'error'});
                this.removeFromRestoreList(clientId);
                this.setState({ 
                    isFetching: false
                });
            });
        }
    }
        

    isRestoring(clientId){
        if(clientId && clientId.constructor === Array){
            for(var i = 0; i < clientId.length; i++){
                if(this.state.deletingList.indexOf(clientId[i]) !== -1){
                    return true;
                }
            }
            return false;
        }
        return this.state.deletingList.indexOf(clientId) !== -1;
    }

    addToRestoreList(clientId){
        let deletingList = [].concat(this.state.deletingList);
        if(clientId && clientId.constructor === Array){
            for(var i = 0; i < clientId.length; i++){
                if(deletingList.indexOf(clientId[i]) === -1){
                    deletingList.push(clientId[i]);
                }
            }
            this.setState({
                deletingList: deletingList
            });
            return;
        }
        
        deletingList.push(clientId);
        this.setState({
            deletingList: deletingList
        });
    }

    removeFromRestoreList(clientId){
        let deletingList = [].concat(this.state.deletingList);
        if(clientId && clientId.constructor === Array){
            for(var i = 0; i < clientId.length; i++){
                if(deletingList.indexOf(clientId[i]) !== -1){
                    deletingList.splice(deletingList.indexOf(clientId[i]), 1);
                }
            }
            this.setState({
                deletingList: deletingList
            });
            return;
        }
        
        deletingList.splice(deletingList.indexOf(clientId), 1);
        this.setState({
            deletingList: deletingList
        });
    }

    updateClient(clientInfo){
        let list = [...this.state.list];
        let clientIndex = findIndex(list, item => item.id === clientInfo.id);
        if(clientIndex !== -1){
            let clientInfoUpdate = Object.assign({}, list[clientIndex], clientInfo)
            list.splice(clientIndex, 1, clientInfoUpdate);
            this.setState({
                list: list
            });
        }
    }

    handleTableRestoreClick(selectedClients){
        console.log("Restoring several .....");
        if(selectedClients && selectedClients.constructor === Array && selectedClients.length > 0){
            this.promptRestoreClients(selectedClients);
        }
    }

    prepRestoreClientsData(clientId){
        if(!clientId){
            return;
        }

        let business = this.currentBusiness();

        if(clientId.constructor === Array){

            let list = [];

            for(var i = 0; i < clientId.length; i++){
                if( typeof clientId[i] !== 'string' &&
                    typeof clientId[i] !== 'number'
                ){
                    continue;
                }
                list.push({
                    clientid: clientId[i],
                    businessid: business.id,
                    userid: this.props.userInfo.data && this.props.userInfo.data.userid,
                });
            }

            return list.length > 0 && {userid:list[0].userid,items: list} || null;
        }

        if(typeof clientId === 'string' || typeof clientId === 'number'){
            return {
                ClientId: clientId,
                BusinessId: business.id
            }
        }

        return null;
    }

    handleSearchChange(search){
        console.log("client-deleted",search);
        this.setState({
            filter: Object.assign({}, this.state.filter, {
                Search: search
            })
        });
    }

    handleFilterChanged(filter){
        if(filter && filter.constructor === Object && Object.keys(filter).length > 0){
            let params = [];
            let filterFields = Object.keys(filter);
            for(var i = 0; i < filterFields.length; i++){
                if( filter[filterFields[i]] === null ||
                    filter[filterFields[i]] === undefined ||
                    (typeof filter[filterFields[i]] === 'string' && filter[filterFields[i]].length < 1)
                ){
                    continue;
                }
                params.push(`${filterFields[i]}=${encodeURIComponent(filter[filterFields[i]])}`);
            }
            this.props.history.push(`/clients${params.length > 0 && '?'+params.join('&') || ''}`);
        }
    }
}

const mapStateToProps = ({
    userInfo,
    clientCreate,
    clientUpdate
}) => ({ 
    userInfo,
    clientCreate,
    clientUpdate
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showSnackbar: ActionCreators.showSnackbar,
    showAlertDialog: ActionCreators.showAlertDialog,
    hideAlertDialog: ActionCreators.hideAlertDialog
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ClientsHome));