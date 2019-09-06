import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ItemForm from './ItemForm';
import PageDialog from '../presentation/PageDialogs';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import OverlayProgress from '../presentation/OverlayProgress';
import {  FIND_ITEM } from '../../configs/api.config';
import find from 'lodash/find';
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
        className='item-form-page-dialog item-stock-update'
        onDismiss={method => fn.handlePageDialogDismiss(method)}
    >
        { data && 
            <ItemForm
                setRef={(ref) => fn.setForm(ref)}
                title='Stock Update'
                submitLabel='Save Changes'
                onCancel={() => fn.handleCancelPress()}
                onSubmit={(data) => fn.handleSubmit(data)}
                disabled={isFetching}
                data={data}
            />
        }

        { !data && !isFetching && fetchFailureMessage &&
            <div className='item-fetch-error'>
                <h1 className='error-title'>Failed to load Item info</h1>
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

class ItemsEdit extends React.Component {
    state = {
        data: null,
        isFetching: false,
        fetchFailureMessage: null
    };

    componentDidMount(){
        this.fetch();
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.itemUpdate.isFetching && !this.props.itemUpdate.isFetching){
            if(this.props.itemUpdate.errorMessage){
                this.props.showSnackbar(this.props.itemUpdate.errorMessage, {variant: 'error'});
            }
            else{
                this.props.showSnackbar('Item info updated.', {variant: 'success'});
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
        isSaving: this.props.itemUpdate.isFetching,
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

    itemId(){
        const { match } = this.props;
        return match && match.params && parseInt(match.params.itemId);
    }

    handleSubmit(data){        
        data.userid = this.props.userInfo.data.userid
        
        if(!this.form.isUpdated()){
            this.props.showSnackbar(
            	'You haven\'t made changes to the item\'s info.',
            	{variant: 'warning'}
            );
            return;
        }
        let business = this.currentBusiness();
        data.businessid = business ? business.id : null;
        data.id = this.itemId() || null;
        this.props.doUpdateItem(data);
    }

    fetch(){
        let business = this.currentBusiness();
        let itemId = this.itemId();
        this.setState({
            isFetching: true,
            fetchFailureMessage: null
        });
        FIND_ITEM(business.id, itemId).then(response => {
            this.setState({
                isFetching: false,
                fetchFailureMessage: null,
                data: response
            });
        }).catch(errorMessage => {
            this.setState({
                isFetching: false,
                fetchFailureMessage: MessageParser(errorMessage, 'An error occured while fetching the items info, please try again shortly.')
            });
        });
    }

    handleAfterDismiss(){

    }

    handleCancelPress(){
        if(this.props.itemUpdate.isFetching){
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
             'Are you sure, you want discard your unsaved item info?',
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

const mapStateToProps = ({userInfo, itemUpdate}) => ({
    userInfo, 
    itemUpdate
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showAlertDialog: ActionCreators.showAlertDialog,
    showSnackbar: ActionCreators.showSnackbar,
    doUpdateItem: ActionCreators.doUpdateItem
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ItemsEdit));