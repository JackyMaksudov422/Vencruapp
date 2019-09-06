import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SettingsUserCard from '../presentation/SettingsUserCard';
import DashboardSection from '../presentation/DashboardSection';
import SettingsTab from '../presentation/SettingsTab';
import Button from '../presentation/Button';
import BankAdd from './BankAdd';
import BankEdit from './BankEdit';
import BankAccountsManager from './BankAccountsManager';

const Template = ({
	fn,
	formType,
	selectedBank
}) => (
	<div 
		className='app-authenticated-body payment-settings-page  business-settings'
	>
		{/* user info section */}
		<DashboardSection>
			{/* settings user card */}
			<SettingsUserCard/>
		</DashboardSection>

	 	{/* tabs */}
		<DashboardSection>
			<SettingsTab showMobileNav={false}>
				<h3
					className='italic normal-font mb64 mt0'
				>
					Get paid faster by including bank&nbsp;
					info and accepting online payment.
				</h3>
				<div className='row'>
					<div 
						className='col-md-6 online-payment-column'
					>
						<label 
							className='input-label spanned mb10'
						>
							Company
						</label>
						<Button
							variant='primary'
							className='connect-pnline-payment-button'
						>
							Connect Online Payments
						</Button>
					</div>

					<div className='col-md-6'>
						<BankAccountsManager />
					</div>
				</div>
			</SettingsTab>
		</DashboardSection>

		{ formType == 'add-bank' && 
			<BankAdd
				onCancel={fn.handleAddBankCancel}
				onComplete={fn.handleAddBankComplete}
			/> 
		}

		{ formType == 'edit-bank' &&
			selectedBank &&
			<BankAdd
				data={selectedBank}
				onCancel={fn.handleEditBankCancel}
				onComplete={fn.handleEditBankComplete}
			/>
		}
	</div>
);

class PaymentSettings extends React.Component {
    state = {
    	formType: null,
    	selectedBank: null
    };

    render(){
		document.getElementById("pageName").innerText = "Payment Settings";

        return (
        	<Template
        		{...this.prps()}
        		fn={this.fn()}
        	/>
        );
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
        })
    })

    setRef(name, ref){
    	if(this[name]) return;
    	this[name] = ref;
    }	

    prps = () => ({
        // template props go here
        selectedBank: this.state.selectedBank,
        formType: this.state.formType
    })

    handleAddBankComplete(newBank){
    	this.setState({
    		formType: null
    	});
    }

    handleEditBankComplete(editedBank){
    	this.setState({
    		formType: null
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
}

const mapStateToProps = (state) => ({ 
    // states go here
});

export default connect(mapStateToProps)(withRouter(PaymentSettings));