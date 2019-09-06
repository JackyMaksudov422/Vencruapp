import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BankInfoForm from './BankInfoForm';
import PageDialog from '../presentation/PageDialogs';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import OverlayProgress from '../presentation/OverlayProgress';
import find from 'lodash/find';
import { UPDATE_BANK } from '../../configs/api.config';
import propTypes from 'prop-types';

/**
 * component template
 */
let Template = ({
	fn,
	isFetching,
	currentBusiness,
	data
}) => (
    <PageDialog
        backdropClose={false}
        escClose={false} 
        show={true}
        className='bank-form-page-dialog'
        onDismiss={method => fn.handlePageDialogDismiss(method)}
    >
        <BankInfoForm
            setRef={(ref) => fn.setForm(ref)}
            title='Edit Bank Info'
            submitLabel='Save Changes'
            onCancel={() => fn.handleCancelPress()}
            onSubmit={(data) => fn.handleSubmit(data)}
            disabled={isFetching}
            currentBusiness={currentBusiness}
            data={data}
        />

        { isFetching && <OverlayProgress/> }
    </PageDialog>
);

class BankEdit extends React.Component {

	static propTypes = {
		onComplete: propTypes.func.isRequired
	};

    state = {
        isFetching: false,
    };

    componentDidMount(){
    	this.mounted = true;
    }

    componentWillUnmount(){
    	this.mounted = false;
    }

    render(){
        return <Template 
            {...this.prps()} 
            fn={this.fn()} 
        />;
    }

    fn = () => ({
        handleSubmit: (data) => this.handleSubmit(data),
        handlePageDialogDismiss: method => this.handlePageDialogDismiss(
        	method
        ),
        setForm: (form) => this.setForm(form),
        handleCancelPress: () => this.handleCancelPress(),
    })

    prps = () => ({
        isFetching: this.state.isFetching,
        currentBusiness: this.currentBusiness(),
        data: this.props.data
    })

    setForm(form){
        this.form = form;
    }

    currentBusiness(){
        const { data } = this.props.userInfo;
        if(data && data.business){
            return find(
            	data.business, item => item.id == data.currentbusinessid
            ) || null;
        }
        return null;
    }

    handleSubmit(data){
        let business = this.currentBusiness();
        let fields = Object.keys(data);
        let reqData = {
        	...data,
        	businessid: business.id,
        	id: this.props.data && this.props.data.id

        };

        // do create banks
        this.save(reqData);
    }

    save(data){
    	this.setState({
    		isFetching: true
    	}, () => {
    		setTimeout(() => {
		    	UPDATE_BANK(data)
		    	.then(response => {
		    		if(this.mounted)
		    		{
		    			this.setState({
		    				isFetching: false
		    			}, () => {
		    				this.props.onComplete(response);
		    				this.form.reset();
		    			});

		    			this.props.showSnackbar(
		    				'Bank updated successfully!',
		    				{
		    					variant: 'success'
		    				}
		    			);
		    		}
		    	})
		    	.catch(error => {
		    		if(this.mounted)
		    		{
		    			let errorMessage = typeof error == 'string' && 
		    				error || 
		    				'Failed to save new bank info.';

		    			this.setState({
		    				isFetching: false
		    			});

		    			this.props.showSnackbar(
		    				errorMessage,
		    				{
		    					variant: 'error'
		    				}
		    			);
		    		}
		    	});
    		}, 1000)
    	});
    }

    handleCancelPress(){
        if(this.state.isFetching){
            return;
        }
        if( !this.form ||
            !this.form.isUpdated()
        ){
            if(typeof this.props.onCancel == 'function'){
            	this.props.onCancel();
            }
            return; 
         }
         this.props.showAlertDialog(
             ` `, 
             'Are you sure, you want discard your unsaved bank info?',
             [
                 {text: 'No'},
                 {	
                 	text: 'Yes, discard', 
                 	onClick: 
                 	typeof this.props.onCancel == 'function' 
                 	? () => this.props.onCancel() : null
                }
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

const mapStateToProps = ({userInfo, bankCreate}) => ({
    userInfo, 
    bankCreate
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showAlertDialog: ActionCreators.showAlertDialog,
    showSnackbar: ActionCreators.showSnackbar,
    doCreateExpense: ActionCreators.doCreateExpense
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BankEdit));