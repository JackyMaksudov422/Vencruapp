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

class InvoicePaperEditorMobile extends React.Component {

	static propTypes = {
		themeColor: propTypes.oneOf(THEME_COLORS),
		template: propTypes.oneOf([ 'simple', 'modern' ]),
    	fontStyle: propTypes.oneOf(Object.keys(FONT_STYLES)),
    	onPaymentChange: propTypes.func,
    	onCustomizeChange: propTypes.func,
    	bankAccount: propTypes.number
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
        		className='invoice-paper-editor'
        	>

    			<div 
    				className='editor-tabs-container mb-0'
    			>
    				{ this.renderCutomizeContent() }
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
				className='editor-tab-content p-0'
			>
				<div>
					{/* theme color selector */}
					<div className='spanned mb-4'>
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

}

export default connect()(withRouter(InvoicePaperEditorMobile));