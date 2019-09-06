import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ClientForm from './ClientForm';
import PageDialog from '../presentation/PageDialogs';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import OverlayProgress from '../presentation/OverlayProgress';
import { CREATE_CLIENT, FIND_CLIENT } from '../../configs/api.config';
import find from 'lodash/find';
import { storageGet } from '../../helpers/Storage';
import { STORAGE_KEYS } from '../../configs/storage.config';
import MessageParser from '../../helpers/MessageParser';
import Button from '../presentation/Button';
import ContentCircularLoader from '../presentation/ContentCircularLoader';

/**
 * component template
 */
let Template = ({fn, isFetching, isSaving, data, fetchFailureMessage}) => (
    <PageDialog
        backdropClose={false}
        escClose={false} 
        show={true}
        afterDismiss={() => fn.handleAfterDismiss()}
        className='edit-client-page-dialog'
        onDismiss={method => fn.handlePageDialogDismiss(method)}
    >
        { data && 
            <ClientForm
                setRef={(ref) => fn.setForm(ref)}
                title='Edit Client'
                submitLabel='Save Changes'
                onCancel={() => fn.handleCancelPress()}
                onSubmit={(data) => fn.handleSubmit(data)}
                disabled={isFetching}
                data={data}
            />
        }

        { !data && !isFetching && fetchFailureMessage &&
            <div className='client-fetch-error'>
                <h1 className='error-title'>Failed to load Client info</h1>
                <p className='error-description'>{ fetchFailureMessage }</p>
                <div className='actions-container'>
                    <Button
                        size='sm'
                        onClick={() => fn.fetch()}
                    >Try Again</Button>
                </div>
            </div>
        }

        { (isFetching || !fetchFailureMessage && !data) && <ContentCircularLoader/> }

        { (isSaving) && <OverlayProgress/> }
    </PageDialog>
);

class ClientsEdit extends React.Component {
    state = {
        data: null,
        isFetching: false,
        fetchFailureMessage: null
    };

    componentDidMount(){
        this.fetch();
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.clientUpdate.isFetching && !this.props.clientUpdate.isFetching){
            if(this.props.clientUpdate.errorMessage){
                this.props.showSnackbar(this.props.clientUpdate.errorMessage, {variant: 'error'});
            }
            else{
                this.props.showSnackbar('Client info updated.', {variant: 'success'});
                this.props.history.goBack();
            }
        }
    }

    render(){
        return <Template 
            {...this.prps()} 
            fn={this.fn()} 
        />;
    }

    fn = () => ({
        handleSubmit: (data) => this.handleSubmit(data),
        handleAfterDismiss: () => this.handleAfterDismiss(),
        handlePageDialogDismiss: (method) => this.handlePageDialogDismiss(method),
        setForm: (form) => this.setForm(form),
        handleCancelPress: () => this.handleCancelPress(),
        fetch: () => this.fetch()
    })

    prps = () => ({
        isFetching: this.state.isFetching,
        isSaving: this.props.clientUpdate.isFetching,
        data: this.state.data,
        fetchFailureMessage: this.state.fetchFailureMessage
    })

    setForm(form){
        this.form = form;
    }

    currentBusiness(){
        const { data } = this.props.userInfo;
        if(data && data.business){
            return find(data.business, item => item.id == data.currentbusinessid) || null;
        }
        return null;
    }

    clientId(){
        const { match } = this.props;
        return match && match.params && parseInt(match.params.clientId);
    }

    handleSubmit(data){
        if(!this.form.isUpdated()){
            this.props.showSnackbar('You haven\'t made changes to the client\'s info.', {variant: 'warning'});
            return;
        }
        let business = this.currentBusiness();
        data.BusinessId = business ? business.id : null;
        data.Id = this.clientId() || null
        this.props.doUpdateClient(data);
    }

    fetch(){
        let business = this.currentBusiness();
        let clientId = this.clientId();
        this.setState({
            isFetching: true,
            fetchFailureMessage: null
        });
        FIND_CLIENT(business.id, clientId).then(response => {
            this.setState({
                isFetching: false,
                fetchFailureMessage: null,
                data: response
            });
        }).catch(errorMessage => {
            this.setState({
                isFetching: false,
                fetchFailureMessage: MessageParser(errorMessage, 'An error occured while fetching the clients info, please try again shortly.')
            });
        });
    }

    handleAfterDismiss(){

    }

    handleCancelPress(){
        if(this.props.clientUpdate.isFetching){
            return;
        }
        if( !this.form ||
            !this.form.isUpdated()
        ){
            this.props.history.goBack();
            return; 
         }
         this.props.showAlertDialog(
             ` `, 
             'Are you sure, you want discard your unsaved client info?',
             [
                 {text: 'No'},
                 {text: 'Yes, discard', onClick: () => this.props.history.goBack()}
             ]
         )
    }

    handlePageDialogDismiss(method){
        switch(method){
            case 'backdrop':
            case 'escape':
                this.handleCancelPress();
            break;
        }
    }
}

const mapStateToProps = ({userInfo, clientUpdate}) => ({
    userInfo, 
    clientUpdate
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showAlertDialog: ActionCreators.showAlertDialog,
    showSnackbar: ActionCreators.showSnackbar,
    doUpdateClient: ActionCreators.doUpdateClient
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ClientsEdit));