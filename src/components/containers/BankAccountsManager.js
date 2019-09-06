import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Rules from '../../helpers/Rules';
import Input from '../presentation/Input';
import Select from '../presentation/Select';
import Button from '../presentation/Button';
import Dropzone from '../presentation/Dropzone';
import Typography from '../presentation/Typography';
import propTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { 
	EXPENSE_CATEGORIES, 
	CURRENCIES_SIGNS,
	ACCOUNT_TYPES
} from '../../configs/data.config.js';
import { ActionCreators } from '../../data/actionCreators';
import { bindActionCreators } from 'redux';
import cloneDeep from 'lodash/cloneDeep';
import InputMask from 'react-input-mask';
import NumberFormat from 'react-number-format';
import {
	GET_BANKS,
	DELETE_BANK
} from '../../configs/api.config';
import BankAdd from './BankAdd';
import BankEdit from './BankEdit';
const logo = require('../../assets/logo.png');

/**
 * component template
 */
let Template = ({
	fn, 
	list,
	formType,
	selectedBank,
	isFetching,
	errorMessage,
	isDeleting,
}) => (
	<React.Fragment>
		<div className='vc-banks-manager'>
			<div className='main'>
				<label 
					className='input-label spanned mb10 text-left'
				>
					Bank Accounts
				</label>
				{ list && list.length < 1 &&
					<Button
						variant='primary'
						className='add-bank-info-button'
						onClick={fn.addBank}
					>
						Add Bank Information
					</Button>
				}

				{ list && list.length > 0 &&
					<ul className='banks-list'>
						{ list.map((item, index) => {
							if(isDeleting == item.id){
								return null
							}
							return (
								<li 
									key={index}
									className='banks-list-item'
								>
									<span>
										{item.bankname}
										{` - `}
										{item.accountnumber}
										{ ACCOUNT_TYPES[item.accounttype] &&
											<span>
												{` - `}
												{ACCOUNT_TYPES[item.accounttype] || ''}
											</span>
										}
									</span>
									<Button
										size='sm'
										variant='link-primary'
										type='button'
										className='pl15 pr7'
										onClick={() => fn.editBank(item)}
									>
										Edit
									</Button>
									<Button
										size='sm'
										variant='link-danger'
										type='button'
										className='pl7 pr15'
										onClick={() => fn.deletBank(item)}
									>
										Remove
									</Button>
								</li>
							)
						})}
					</ul>
				}
				{ list && list.length > 0 &&
					<Button 
						variant='link-primary'
						className='add-button'
						onClick={fn.addBank}
						type='button'
					>
						<i className="icon ion-md-add-circle-outline"></i>
						&nbsp;
						<span>Add Bank Account</span>
					</Button>
				}

				{ !isFetching && errorMessage && 
					<div className='load-failure text-center pv60'>
						<i className="icon ion-md-close-circle-outline"></i>{` `}
						<span>{errorMessage}</span><br/>
						<Button 
							variant='outline-primary'
							size='sm'
							onClick={fn.fetch}
						>Try Again</Button>
					</div>
				}
			</div>
		</div>

		{ formType == 'add-bank' && 
			<BankAdd
				onCancel={fn.handleAddBankCancel}
				onComplete={fn.handleAddBankComplete}
			/> 
		}

		{ formType == 'edit-bank' &&
			selectedBank &&
			<BankEdit
				data={selectedBank}
				onCancel={fn.handleEditBankCancel}
				onComplete={fn.handleEditBankComplete}
			/>
		}
	</React.Fragment>
);

class BankAccountsManager extends React.Component {

    static propTypes = {
        setRef: propTypes.func,
        onRequestCreate: propTypes.func,
        onRequestEdit: propTypes.func,
    };

    state = {
    	isFetching: false,
    	errorMessage: true,
    	list: [],
    	formType: null,
    	selectedBank: null,
    	isDeleting: null
    };
    
    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.mounted = true;
        if(typeof this.props.setRef == 'function'){
        	this.props.setRef(this);
        }
        this.fetch();
    }

    componentWillUnmount(){
        this.mounted = false;
        if(typeof this.props.setRef == 'function'){
        	this.props.setRef(undefined);
        }
    }

    render(){
        return <Template 
            {...this.prps()} 
            fn={this.fn()} 
        />;
    }

    fn = () => ({
    	handleAddBankComplete: (bankInfo) => this.handleAddBankComplete(
    		bankInfo
    	),
    	handleEditBankComplete: (bankInfo) => this.handleEditBankComplete(
    		bankInfo
    	),
    	handleAddBankCancel: (bankInfo) => this.handleAddBankCancel(),
    	handleEditBankCancel: (bankInfo) => this.handleEditBankCancel(),
    	setRef: (name, ref) => this.setRef(name, ref),
        addBank: () => this.setState({
        	formType: 'add-bank',
        	selectedBank: null
        }),
        editBank: bank => this.setState({
        	formType: 'edit-bank',
        	selectedBank: bank
        }),
        fetch: () => this.fetch(),
        deletBank: bank => this.deletBank(bank),
    });

    prps = () => ({
        isFetching: this.state.isFetching,
        isDeleting: this.state.isDeleting,
        list: this.state.list,
        selectedBank: this.state.selectedBank,
        formType: this.state.formType,
        errorMessage: this.state.errorMessage
    });

    setRef(name, ref){
    	if(this[name]) return;
    	this[name] = ref;
    }

    handleAddBankComplete(newBank){
    	this.setState({
    		formType: null
    	}, () => {
    		const { 
    			isFetching, 
    			errorMessage, 
    			list
    		} = this.state;

    		if(list && list.length > 0){
    			this.takeData([newBank]);
    			return;
    		}

    		if(!isFetching && 
    			errorMessage && 
    			(!list || list.length < 1))
    		{
    			this.fetch();
    		}

    	} );
    }

    handleEditBankComplete(editedBank){
    	this.setState({
    		formType: null
    	}, () => {
    		let banksList = [...this.state.list];
    		let index = banksList.findIndex(item => item.id == editedBank.id);
    		if(index >= 0){
    			banksList[index] = {
    				...banksList[index], 
    				...editedBank
    			};
    			this.setState({
    				list: banksList
    			});
    		}
    	});
    }

    handleAddBankCancel(){
    	this.setState({
    		formType: null
    	})
    }

    handleEditBankCancel(){
    	this.setState({
    		formType: null,
    		selectedBank: null
    	})
    }

    fetch(){
    	const { currentBusiness } = this.props;
    	this.setState({
    		isFetching: true,
    		errorMessage: null
    	}, () => {
    		setTimeout(() => {
    		  	GET_BANKS(
    		  		currentBusiness && currentBusiness.id
    		  	).then(response => {
    		  		if(this.mounted){
    		  			this.setState({
    		  				isFetching: false,
    		  				list: response.banks
    		  			});
    		  		}
    		  	}).catch(error => {
    		  		if(this.mounted)
    		  		{
    		  			let errorMessage = typeof error == 'string' &&
							error || 
							'Failed to load banks list.';

    		  			this.setState({
    		  				isFetching: false,
    		  				errorMessage
    		  			});
    		  		}
    		  	});
    		}, 1000);
    	})
    }

    takeData(data){
    	let list = [].concat(
			data,
			this.state.list
    	);
    	this.setState({
    		list: list
    	});
    }

    handleRequestEdit(bankInfo){
    	if(typeof this.props.onRequestEdit == 'function'){
    		this.props.onRequestEdit(bankInfo);
    	}
    }

    deletBank(bank){
    	if(this.state.isDeleting){
    		return;
    	}
    	const { currentBusiness } = this.props;
    	let reqData = {
    		id: bank.id,
    		businessid: currentBusiness && currentBusiness.id
    	};

    	this.props.showAlertDialog(
    		'',
    		'Are you sure you want to remove this bank account information?',
    		[
    			{ text: 'No' },
    			{  text: 'Yes, Remove', 
    				onClick: () => this.doDeleteBank(reqData),
    				variant: 'destructive'
    			}
    		]
    	);

    }

    doDeleteBank(data){
    	this.setState({
    		isDeleting: data.id
    	}, () => {
    		setTimeout(() => {
    		  	DELETE_BANK(data).then(response => {
    		  		if(this.mounted){
    		  			const { list } = this.state;

    		  			// get index of deleted item
    		  			let index = list.findIndex(
	  						item => item.id == data.id
	  					);

    		  			// delete item from banks list if found
    		  			if(index >= 0){
    		  				list.splice(index, 1);
    		  			}

    		  			// show success message
    		  			this.props.showSnackbar(
							'Bank information deleted.',
							{ variant: 'success' }
						);

    		  			// update component state
    		  			this.setState({
    		  				isDeleting: null,
    		  				list: list
    		  			});
    		  		}
    		  	}).catch(error => {
    		  		if(this.mounted){
    		  			let errorMessage = typeof error == 'string' &&
							error || 
							'Failed delete bank information.';

						this.props.showSnackbar(
							errorMessage,
							{ variant: 'error' }
						);

    		  			this.setState({
    		  				isDeleting: null,
    		  			});
    		  		}
    		  	});
    		}, 1000);
    	})
    }
}

const mapStateToProps = ({
	userInfo
}) => ({
	userInfo: userInfo.data,
	currentBusiness: userInfo.data && 
					userInfo.data.business && 
					userInfo.data
						.business
						.find(
							item => item.id == userInfo.data.currentbusinessid
						)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
	showSnackbar: ActionCreators.showSnackbar,
	showAlertDialog: ActionCreators.showAlertDialog,
}, dispatch);

export default connect(
					mapStateToProps,
					mapDispatchToProps
				)(withRouter(BankAccountsManager));