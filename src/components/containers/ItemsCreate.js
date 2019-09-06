import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ItemForm from './ItemForm';
import PageDialog from '../presentation/PageDialogs';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import OverlayProgress from '../presentation/OverlayProgress';
import { CREATE_ITEM } from '../../configs/api.config';
import find from 'lodash/find';
import { storageGet } from '../../helpers/Storage';
import { STORAGE_KEYS } from '../../configs/storage.config';

/**
 * component template
 */
let Template = ({fn, isFetching}) => (
    <PageDialog
        backdropClose={false}
        escClose={false} 
        show={true}
        afterDismiss={() => fn.handleAfterDismiss()}
        className='item-form-page-dialog item-stock-update'
        onDismiss={method => fn.handlePageDialogDismiss(method)}
    >
        <ItemForm
            setRef={(ref) => fn.setForm(ref)}
            title='Add New Item'
            submitLabel='Add Item'
            onCancel={() => fn.handleCancelPress()}
            onSubmit={(data) => fn.handleSubmit(data)}
            disabled={isFetching}
        />
        { isFetching && <OverlayProgress/> }
    </PageDialog>
);

class ItemsCreate extends React.Component {
    state = {
        isFetching: false
    };

    componentDidUpdate(prevProps, prevState){
        if(prevProps.itemCreate.isFetching && !this.props.itemCreate.isFetching){
            if(this.props.itemCreate.errorMessage){
                this.props.showSnackbar(this.props.itemCreate.errorMessage, {variant: 'error'});
            }
            else{
                this.props.showSnackbar('New item created.', {variant: 'success'});
    
                if(this.props.onCreated){
                    this.props.onCreated()
                }else this.props.history.goBack();
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
        handleCancelPress: () => this.handleCancelPress()
    })

    prps = () => ({
        isFetching: this.props.itemCreate.isFetching
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

    handleSubmit(data){
        let business = this.currentBusiness();
        data.businessid = business && business.id || null
        this.props.doCreateItem(data);
    }

    handleAfterDismiss(){

    }

    handleCancelPress(){
        if(this.props.itemCreate.isFetching){
            return;
        }
        if( !this.form ||
            !this.form.isUpdated()
        ){
            this.cancel();
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
    cancel(){
    	if(typeof this.props.onCancel === 'function'){
    		this.props.onCancel();
    		return;
    	}
    	this.props.history.goBack();
    }
}

const mapStateToProps = ({userInfo, itemCreate}) => ({
    userInfo, 
    itemCreate
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showAlertDialog: ActionCreators.showAlertDialog,
    showSnackbar: ActionCreators.showSnackbar,
    doCreateItem: ActionCreators.doCreateItem
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ItemsCreate));