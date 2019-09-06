import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ExpenseForm from './ExpenseForm';
import PageDialog from '../presentation/PageDialogs';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import OverlayProgress from '../presentation/OverlayProgress';
import { CREATE_EXPENSE, FIND_EXPENSE } from '../../configs/api.config';
import find from 'lodash/find';
import { storageGet } from '../../helpers/Storage';
import { STORAGE_KEYS } from '../../configs/storage.config';
import MessageParser from '../../helpers/MessageParser';
import Button from '../presentation/Button';
import ContentCircularLoader from '../presentation/ContentCircularLoader';

/**
 * component template
 */
let Template = ({
	fn, 
	isFetching, 
	isSaving, 
	data, 
	fetchFailureMessage, 
	currentBusiness
}) => (
    <PageDialog
        backdropClose={false}
        escClose={false} 
        show={true}
        afterDismiss={() => fn.handleAfterDismiss()}
        className='expense-form-page-dialog'
        onDismiss={method => fn.handlePageDialogDismiss(method)}
    >
        { data && 
            <ExpenseForm
                setRef={(ref) => fn.setForm(ref)}
                title='Edit Expense'
                submitLabel='Save Changes'
                onCancel={() => fn.handleCancelPress()}
                onSubmit={(data) => fn.handleSubmit(data)}
                disabled={isFetching}
                data={data}
        		expenseNumber={data.expensenumber}
        		currentBusiness={currentBusiness}
            />
        }

        { !data && !isFetching && fetchFailureMessage &&
            <div className='expense-fetch-error'>
                <h1 className='error-title'>Failed to load Expense info</h1>
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

class ExpensesEdit extends React.Component {
    state = {
        data: null,
        isFetching: false,
        fetchFailureMessage: null
    };

    componentDidMount(){
        this.fetch();
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.expenseUpdate.isFetching && !this.props.expenseUpdate.isFetching){
            if(this.props.expenseUpdate.errorMessage){
                this.props.showSnackbar(this.props.expenseUpdate.errorMessage, {variant: 'error'});
            }
            else{
                this.props.showSnackbar('Expense info updated.', {variant: 'success'});
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
        isSaving: this.props.expenseUpdate.isFetching,
        data: this.state.data,
        fetchFailureMessage: this.state.fetchFailureMessage,
        currentBusiness: this.currentBusiness()
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

    expenseId(){
        const { match } = this.props;
        return match && match.params && parseInt(match.params.expenseId);
    }

    handleSubmit(data){
        if(!this.form.isUpdated()){
            this.props.showSnackbar('You haven\'t made changes to the expense\'s info.', {variant: 'warning'});
            return;
        }

        let business = this.currentBusiness();
        let fields = Object.keys(data);
        let reqData = new FormData();

        // append submitted data to form data
        for(var i = 0; i < fields.length; i++){
        	// skip empty fields
        	if( data[fields[i]] == undefined ||
        		data[fields[i]] == null
        	){
        		continue;
        	}

        	// append receipt to form data
        	if(fields[i] && fields[i] == 'receipt'){
        		reqData.append(`image`, data[fields[i]], `${data[fields[i]].name}`);
        		continue;
        	}
        	// append other fields to form data
        	reqData.append(`${fields[i]}`, `${data[fields[i]]}`);
        }

        // append business id to form data
        reqData.append('businessid', business && business.id || null);

        // add expense number
        reqData.append('expensenumber', this.state.data.expensenumber || null);

        // add expense id to request
        reqData.append('id', this.expenseId() || null);

        data['expensenumber'] = this.state.data.expensenumber;
        data['businessid'] = business ? business.id : null;
        data['id'] = this.expenseId() || null;

        // do update expenses
        this.props.doUpdateExpense(data, {
        	onUploadProgress: event => this.handleUploadProgress(event)
        });
    }

    handleUploadProgress(event){
    	// handle progress event
    }

    fetch(){
        let business = this.currentBusiness();
        let expenseId = this.expenseId();
        this.setState({
            isFetching: true,
            fetchFailureMessage: null
        });
        FIND_EXPENSE(business.id, expenseId).then(response => {
            this.setState({
                isFetching: false,
                fetchFailureMessage: null,
                data: response
            });
        }).catch(errorMessage => {
            this.setState({
                isFetching: false,
                fetchFailureMessage: MessageParser(errorMessage, 'An error occured while fetching the expenses info, please try again shortly.')
            });
        });
    }

    handleAfterDismiss(){

    }

    handleCancelPress(){
        if(this.props.expenseUpdate.isFetching){
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
             'Are you sure, you want discard your unsaved expense info?',
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

const mapStateToProps = ({userInfo, expenseUpdate}) => ({
    userInfo, 
    expenseUpdate
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showAlertDialog: ActionCreators.showAlertDialog,
    showSnackbar: ActionCreators.showSnackbar,
    doUpdateExpense: ActionCreators.doUpdateExpense
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ExpensesEdit));