import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Select from '../presentation/Select';
import Button from '../presentation/Button';
import BankAdd from './BankAdd';
import { ActionCreators } from '../../data/actionCreators';
import { bindActionCreators } from 'redux';
import propTypes from 'prop-types';
const PAYMENT_OPTIONS = require('../../assets/payment-options.jpg');
const TEMPLATE_SIMPLE = require('../../assets/invoice-simple-preview.jpg');
const TEMPLATE_MODERN = require('../../assets/invoice-modern-preview.jpg');
const THEME_COLORS = [
	'default', 'purple',
	'orange', 'green',
	'red', 'yellow',
	'black'
];
const FONT_STYLES = {
	'avenir-next': 'Avenir Next',
	'lato': 'Lato',
	'roboto': 'Roboto'
};

class InvoicePaperEditor extends React.Component {

	static propTypes = {
		themeColor: propTypes.oneOf(THEME_COLORS),
		template: propTypes.oneOf([ 'simple', 'modern' ]),
    	fontStyle: propTypes.oneOf(Object.keys(FONT_STYLES)),
    	onPaymentChange: propTypes.func,
    	onCustomizeChange: propTypes.func,
    	// bankAccount: propTypes.number
	};

	static defaultProps = {
		themeColor: 'default',
		template: 'simple',
    	fontStyle: 'avenir-next',
    	bankAccount: null
	};

    state = {
    	activeTab: 'customize',
    	template: 'simple',
    	themeColor: 'default',
    	fontStyle: 'avenir-next',
    	bankAccount: null,
    	addNew: null
    };

    componentDidMount(){
    	const {
    		themeColor,
    		template,
    		fontStyle,
    		bankAccount
    	} = this.props;
    	this.setState({
    		themeColor: themeColor,
    		template: template,
    		fontStyle: fontStyle,
    		bankAccount: bankAccount
    	});
    }

    render(){
    	const {
    		activeTab,
    		addNew
    	} = this.state;
        return (
        	<div
        		className='invoice-paper-editor d-none d-md-block'
        	>
        		{ addNew === 'bankAccount' && 
					<BankAdd
						onCancel={() => this.setState({
							addNew: null
						})}
						onComplete={this.handleBankCreated.bind(this)}
					/> 
				}

    			<div 
    				className='editor-tabs-container'
    			>
    				<div className='editor-tab-navs'>
        				<div 
        					className={`editor-tab-item ${activeTab == 'customize' ? 'active' : ''}`}
        				>
        					<button
        						type='button'
        						className='editor-tab-button'
        						onClick={() => this.setState({
        							activeTab: 'customize'
        						})}
        					>
        						Customize Invoice
        					</button>
        				</div>
        				<div className={`editor-tab-item ${activeTab == 'payment' ? 'active' : ''}`}>
        					<button
        						type='button'
        						className='editor-tab-button'
        						onClick={() => this.setState({
        							activeTab: 'payment'
        						})}
        					>
        						Setup Payment
        					</button>
        				</div>
    				</div>
    				{ this.renderCutomizeContent() }
    				{ this.renderSetupPaymentContent() }
    			</div>
		    </div>
        );
    }

    renderCutomizeContent(){
    	const {
    		activeTab,
    		template,
    		themeColor,
    		fontStyle,
    	} = this.state;

    	if(activeTab !== 'customize') return;

    	return (
			<div 
				className='editor-tab-content'
			>
				<div>
					{/* theme selector */}
					<div className='spanned mb40'>
						<h3 className='text-center normal-font mb30'>
							Choose Template
						</h3>
						<div className='template-slider'>
							<button 
								className='template-slider-nav'
								type='button'
								onClick={() => this.setState({
									template: 'simple'
								}, () => {
									this.hanldeCustomizeChangeListener()
								})}
							>
								<i 
									className='material-icons'
								>chevron_left</i>
							</button>
							<div className='template-preview'>
								{ template === 'modern'  && <img src={TEMPLATE_MODERN} /> }
								{ template === 'simple'  && <img src={TEMPLATE_SIMPLE} /> }
							</div>
							<button 
								className='template-slider-nav'
								type='button'
								onClick={() => this.setState({
									template: 'modern'
								}, () => {
									this.hanldeCustomizeChangeListener()
								})}
							>
								<i 
									className='material-icons'
								>chevron_right</i>
							</button>
						</div>
						<h3 className='spanned text-center normal-font text-black mt20 mb10'>
							{template === 'modern' && 'Modern'}
							{template === 'simple' && 'Simple'}
						</h3>
					</div>

					{/* theme color selector */}
					<div className='spanned mb40'>
						<h3 className='text-center normal-font mb30'>
							Choose a theme color
						</h3>

						<ul className='color-picker'>
							{ THEME_COLORS.map((item, index) => (
								<li 
									key={index}
									className='color-picker-item'
								>
									<button
										className={`color-${item}`}
										onClick={() => this.setState({
											themeColor: item
										}, () => {
											this.hanldeCustomizeChangeListener()
										})}
									>
										{ themeColor == item ? 
											<i 
												className='material-icons'
											>check</i> :
											<i>{` `}</i>
										}
									</button>
								</li>
							))}
						</ul>
					</div>

					{/* font selector */}
					<div className='spanned'>
						<div
							className='row justify-content-md-center'
						>
							<div className='col-md-12'>
								<h3 className='text-center normal-font mb30'>
									Select your font
								</h3>
								<Select
									placeholder='Select font style'
									value={fontStyle}
									onChange={e => this.setState({
										fontStyle: e.target.value
									}, () => {
										this.hanldeCustomizeChangeListener()
									})}
									options={FONT_STYLES}
								/>	
							</div>
						</div>
					</div>
				</div>
			</div>
    	);
    }

    renderSetupPaymentContent(){
    	const {
    		activeTab,
    		addNew
    	} = this.state;
    	const {
    		bankAccount
    	} = this.props;

    	if(activeTab !== 'payment') return;

    	return (
			<div 
				className='editor-tab-content'
			>
				<div>
					<div 
						className='spanned mb100'
					>
						<h2
							className='text-black mv40 text-left normal-font'
						>
							Select Bank to Accept Payment
						</h2>
						<Select
							setRef={ref => this.bankAccountsSelect = ref}
							options={this.getSelectBanksList()}
							onChange={e => {
								if(e.target.value !== 'add-new'){
									this.handleChangeBankAccount(
										e.target.value
									);
								}
								this.setState({
									addNew: e.target.value === 'add-new'
												 ? 'bankAccount' : addNew
								});
							}}
							value={bankAccount || ''}
						/>
					</div>

					<div
						className='spanned'

					>
						<h2
							className='text-black mv40 text-center normal-font'
						>
							Connect Online Payment
						</h2>
						<p className='text-center'>
							Accept all major cards and currencies.&nbsp; 
							Let clients pay with their cards online on your invoice.
						</p>

						<div 
							className='payment-options-image-container mb40'
						>
							<img
								src={PAYMENT_OPTIONS}
							/>
						</div>
						<Button
							type='button'
							variant='primary'
							block
						>Coming Soon</Button>
					</div>
				</div>
			</div>
    	);	
    }

    getSelectBanksList(){
    	const { bankAccounts } = this.props;
    	let list = [
    		{'': 'Select Bank Account'},
    		{'add-new': '+ Add new'}
    	];

    	if( !bankAccounts ||
    		bankAccounts.constructor !== Array
    	){
    		return list;
    	}

    	for(var i = 0; i < bankAccounts.length; i++){
    		list.push({
    			[bankAccounts[i]['id']]: bankAccounts[i]['bankname'] + ' - ' + bankAccounts[i]['accountnumber']
    		});
    	}

    	return list;
    }

    handleBankCreated(){
    	this.setState({
    		addNew: null
    	}, 
    	() => this.props.addNewBankAccount(
    			this.state.bankAccount
    		)
    	);
    }

    hanldeCustomizeChangeListener(){
    	let {
    		themeColor,
    		fontStyle,
    		template
    	} = this.state;

    	if(this.props.onCustomizeChange){
    		this.props.onCustomizeChange({
    			themeColor,
    			fontStyle,
    			template
    		});
    	}
    }

    handleChangeBankAccount(bankAccount){
    	if(this.props.onPaymentChange){
    		this.props.onPaymentChange({
    			bankAccount
    		});
    	}
    }

}

const mapStateToProps = ({
	bankAccounts
}) => ({ 
	bankAccounts: bankAccounts.data || []
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
	addNewBankAccount: ActionCreators.addNewBankAccount,
}, dispatch);

export default connect(mapStateToProps)(withRouter(InvoicePaperEditor));