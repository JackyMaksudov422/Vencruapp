import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ExpenseForm from './ExpenseForm';
import PageDialog from '../presentation/PageDialogs';
import PageModal from '../presentation/PageModal';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import OverlayProgress from '../presentation/OverlayProgress';
import find from 'lodash/find';
import { GET_NEW_EXPENSE_NUMBER } from '../../configs/api.config';
import Button from '../presentation/Button';
import ContentCircularLoader from '../presentation/ContentCircularLoader';
import { DEBUG } from '../../configs/app.config';

/**
 * component template
 */
let Template = ({
	fn,
	isFetching, 
	expenseNumber, 
	errorMessage, 
	isGeneratingExpenseNumber, 
	currentBusiness
}) => (
    <PageModal
        backdropClose={false}
        escClose={false} 
        show={true}
        className='expense-form-page-dialog'
        onDismiss={method => fn.handlePageDialogDismiss(method)}
    >
    	{ expenseNumber && 
	        <ExpenseForm
	            setRef={(ref) => fn.setForm(ref)}
	            title='Expenses'
	            submitLabel='Submit Expenses'
	            onCancel={() => fn.handleCancelPress()}
	            onSubmit={(data) => fn.handleSubmit(data)}
	            disabled={isFetching}
	            expenseNumber={expenseNumber}
	            currentBusiness={currentBusiness}
	        />
    	}

    	{ !expenseNumber && !isGeneratingExpenseNumber && errorMessage &&
            <div className='expense-fetch-error'>
                <h1 className='error-title'>Something Broke Somewhere</h1>
                <p className='error-description'>{ errorMessage }</p>
                <div className='actions-container'>
                    <Button
                        size='sm'
                        onClick={() => fn.generateNewExpenseNumber()}
                    >Try Again</Button>
                </div>
            </div>
        }

        { isGeneratingExpenseNumber && <ContentCircularLoader/> }

        { isFetching && <OverlayProgress/> }
    </PageModal>
);

class ExpensesCreate extends React.Component {
    state = {
        isFetching: false,
        isGeneratingExpenseNumber: false,
        errorMessage: null,
        expenseNumber: null
    };

    componentDidMount(){
    	this.generateNewExpenseNumber();
    }

    componentDidUpdate(prevProps, prevState){
        if( prevProps.expenseCreate.isFetching && 
        	!this.props.expenseCreate.isFetching
        ){
            if(this.props.expenseCreate.errorMessage){
                this.props.showSnackbar(
                	this.props.expenseCreate.errorMessage,
                	{variant: 'error'}
                );
            }
            else{
                this.props.showSnackbar(
                	'New expense created.',
                	{variant: 'success'}
                );
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
        handlePageDialogDismiss: (method) => this.handlePageDialogDismiss(method),
        setForm: (form) => this.setForm(form),
        handleCancelPress: () => this.handleCancelPress(),
        generateNewExpenseNumber: () => this.generateNewExpenseNumber(),
    })

    prps = () => ({
        isFetching: this.props.expenseCreate.isFetching,
        isGeneratingExpenseNumber: this.state.isGeneratingExpenseNumber,
        expenseNumber: this.state.expenseNumber,
        errorMessage: this.state.errorMessage,
        currentBusiness: this.currentBusiness()
    })

    setForm(form){
        this.form = form;
    }

    currentBusiness(){
        const { data } = this.props.userInfo;
        if(data && data.business){
            return find(data.business, item => item.id === data.currentbusinessid) || null;
        }
        return null;
    }
    

    handleSubmit(data){
        let business = this.currentBusiness();
        let fields = Object.keys(data);
        let reqData = new FormData();

        // append submitted data to form data
        for(var i = 0; i < fields.length; i++){
        	// skip empty fields
        	if( data[fields[i]] === undefined ||
        		data[fields[i]] === null
        	){
        		continue;
        	}

        	// append receipt to form data
        	if(fields[i] && fields[i] === 'receipt'){
        		reqData.append(`image`, data[fields[i]], `${data[fields[i]].name}`);
        		continue;
        	}
        	// append other fields to form data
        	reqData.append(`${fields[i]}`, `${data[fields[i]]}`);
        }

        // append business id to form data
        reqData.append('businessid', business ? business.id : null);

        // add expense number
        reqData.append('expensenumber', this.state.expenseNumber || null);
        data['expensenumber'] = this.state.expenseNumber;
        data['businessid'] = business ? business.id : null;

        // do create expenses
        this.props.doCreateExpense(data, {
        	onUploadProgress: progressEvent => this.handleUploadProgress(progressEvent)
        });
    }

    handleUploadProgress(progressEvent){

    }

    handleCancelPress(){
        if(this.props.expenseCreate.isFetching){
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
            default:
                // do nothing
            break;
        }
    }

    generateNewExpenseNumber(){
    	let currentBusiness = this.currentBusiness();
    	this.setState({
    		isGeneratingExpenseNumber: true,
    		errorMessage: null
    	});

    	GET_NEW_EXPENSE_NUMBER(currentBusiness.id).then( expensenumber => {
    		this.setState({
    			isGeneratingExpenseNumber: false,
    			expenseNumber: expensenumber.expensenumber
    		});
    	}).catch(error => {
    		let errorMessage = 'An error occured, please try again.';
    		if( typeof error === 'string' && 
    			error.trim().length > 0
    		){
    			errorMessage = error;
    		}
    		
    		if( typeof error !== 'string' && DEBUG ){
    			console.error(error);
    		}

    		this.setState({
    			isGeneratingExpenseNumber: false,
    			errorMessage: errorMessage
    		});
    	});
    }
}

const mapStateToProps = ({userInfo, expenseCreate}) => ({
    userInfo, 
    expenseCreate
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showAlertDialog: ActionCreators.showAlertDialog,
    showSnackbar: ActionCreators.showSnackbar,
    doCreateExpense: ActionCreators.doCreateExpense
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ExpensesCreate));