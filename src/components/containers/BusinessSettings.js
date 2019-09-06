import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SettingsUserCard from '../presentation/SettingsUserCard';
import DashboardSection from '../presentation/DashboardSection';
import SettingsTab from '../presentation/SettingsTab';
import Button from '../presentation/Button';
import FormComponent from './FormComponent';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import * as Rules from '../../helpers/Rules';
import Input from '../presentation/Input';
import Select from '../presentation/Select';
import { CURRENCIES, INDUSTRIES } from '../../configs/data.config';
import NumberFormat from 'react-number-format';
import propTypes from 'prop-types';
import Dropzone from '../presentation/Dropzone';
import ImageCropper from '../presentation/ImageCropper';
import { UPDATE_BUSINESS_INFO, GET_CURRENCIES } from '../../configs/api.config';
import isEqual from 'lodash/isEqual';
import OverlayProgress from '../presentation/OverlayProgress';
import MessageParser from '../../helpers/MessageParser';
import { isValidPhoneNumber } from 'react-phone-number-input';
import Typography from '../presentation/Typography';
import { DEBUG } from '../../configs/app.config';
import PageModal from '../presentation/PageModal';
import SubscriptionPlans from '../containers/SubscriptionPlans'

function TaxNumberFormat(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      prefix='#'
    />
  );
}

TaxNumberFormat.propTypes = {
  inputRef: propTypes.func.isRequired,
  onChange: propTypes.func.isRequired,
};

const Template = ({
	fn,
	formData,
	loginProvider,
	industryNames,
	industryServices,
	selectedLogo,
	newLogo,
	isFetching,
	currentBusiness,
	currencies,
	showPlans,
	userInfo
}) => (
	<div className='app-authenticated-body settings-page business-settings'>

		{ selectedLogo && 
			<ImageCropper
				image={selectedLogo}
				onCancelCrop={fn.handleCancelLogoCrop}
				onCrop={fn.handleOnCropLogo}
				width={300}
				title={'Crop Business Logo'}
			/>
		}

		<form onSubmit={fn.handleSubmit} >
			
    		{/* user info section */}
    		<DashboardSection>
    			{/* settings user card */}
    			<SettingsUserCard/>
    		</DashboardSection>

    	 	{/* tabs */}
    		<DashboardSection>
    			<SettingsTab showMobileNav={false} >
    				<div className='row'>
    					<div className='col-md-8'>
		    				<div className='row'>
		    					<div className='col-md-6 mb-4'>
									<label className='input-label'>Company</label>
				                    <Input
				                        variant={
				                        	!fn.fieldIsValid('companyname') && 
				                        	!fn.fieldIsFocused('companyname') && 
				                        	fn.fieldIsTouched('companyname') && 
				                        	'danger' ||
				                        	'default'
				                       	}
				                        onChange={
				                        	event => fn.handleFieldValueChange('companyname', event.target.value)
				                        }
				                        onFocus={(event) => fn.handleFieldFocus('companyname')}
				                        onBlur={(event) => fn.handleFieldBlur('companyname')}
				                        value={formData.companyname}
				                        className='mb5 mt10'
				                    />

				                    {	!fn.fieldIsValid('companyname') && 
				                        !fn.fieldIsFocused('companyname') && 
				                        fn.fieldIsTouched('companyname') &&
				                        <Typography
				                            size='sm' 
				                            variant='danger'
				                            className='mt0'
				                        >{fn.fieldHasError('companyname')}</Typography>
				                    }
		    					</div>

		    					<div className='col-md-6 mb-2'>
									<label className='input-label'>Company Industry</label>
				                    <Select
				                        variant={
				                        	!fn.fieldIsValid('industry') && 
				                        	!fn.fieldIsFocused('industry') && 
				                        	fn.fieldIsTouched('industry') && 
				                        	'danger' ||
				                        	'default'
				                       	}
				                        onChange={
				                        	event => fn.handleFieldValueChange('industry', event.target.value)
				                        }
				                        onFocus={(event) => fn.handleFieldFocus('industry')}
				                        onBlur={(event) => fn.handleFieldBlur('industry')}
				                        value={formData.industry}
				                        classes={{container: 'mb5 mt10'}}
				                        options={industryNames}
				                    />

				                    {	!fn.fieldIsValid('industry') && 
				                        !fn.fieldIsFocused('industry') && 
				                        fn.fieldIsTouched('industry') &&
				                        <Typography
				                            size='sm' 
				                            variant='danger'
				                            className='mt0'
				                        >{fn.fieldHasError('industry')}</Typography>
				                    }
		    					</div>
		    				</div>

		    				<div className='row'>
		    					<div className='col-md-6 mb-2'>
									<label className='input-label'>Services</label>
				                    <Select
				                        variant={
				                        	!fn.fieldIsValid('service') && 
				                        	!fn.fieldIsFocused('service') && 
				                        	fn.fieldIsTouched('service') && 
				                        	'danger' ||
				                        	'default'
				                       	}
				                        onChange={
				                        	event => fn.handleFieldValueChange('service', event.target.value)
				                        }
				                        onFocus={(event) => fn.handleFieldFocus('service')}
				                        onBlur={(event) => fn.handleFieldBlur('service')}
				                        value={formData.service}
				                        classes={{container: 'mb5 mt10'}}
				                        options={industryServices}
				                    />

				                    {	!fn.fieldIsValid('service') && 
				                        !fn.fieldIsFocused('service') && 
				                        fn.fieldIsTouched('service') &&
				                        <Typography
				                            size='sm' 
				                            variant='danger'
				                            className='mt0'
				                        >{fn.fieldHasError('service')}</Typography>
				                    }
		    					</div>

		    					<div className='col-md-6 mb-4'>
									<label className='input-label'>Address</label>
				                    <Input
				                        variant={
				                        	!fn.fieldIsValid('address') && 
				                        	!fn.fieldIsFocused('address') && 
				                        	fn.fieldIsTouched('address') && 
				                        	'danger' ||
				                        	'default'
				                       	}
				                        onChange={
				                        	event => fn.handleFieldValueChange('address', event.target.value)
				                        }
				                        onFocus={(event) => fn.handleFieldFocus('address')}
				                        onBlur={(event) => fn.handleFieldBlur('address')}
				                        value={formData.address}
				                        className='mb5 mt10'
				                    />

				                    {	!fn.fieldIsValid('address') && 
				                        !fn.fieldIsFocused('address') && 
				                        fn.fieldIsTouched('address') &&
				                        <Typography
				                            size='sm' 
				                            variant='danger'
				                            className='mt0'
				                        >{fn.fieldHasError('address')}</Typography>
				                    }
		    					</div>
		    				</div>

		    				<div className='row'>
		    					<div className='col-md-6 mb-4'>
									<label className='input-label'>City</label>
				                    <Input
				                        variant={
				                        	!fn.fieldIsValid('city') && 
				                        	!fn.fieldIsFocused('city') && 
				                        	fn.fieldIsTouched('city') && 
				                        	'danger' ||
				                        	'default'
				                       	}
				                        onChange={
				                        	event => fn.handleFieldValueChange('city', event.target.value)
				                        }
				                        onFocus={(event) => fn.handleFieldFocus('city')}
				                        onBlur={(event) => fn.handleFieldBlur('city')}
				                        value={formData.city}
				                        className='mb5 mt10'
				                    />

				                    {	!fn.fieldIsValid('city') && 
				                        !fn.fieldIsFocused('city') && 
				                        fn.fieldIsTouched('city') &&
				                        <Typography
				                            size='sm' 
				                            variant='danger'
				                            className='mt0'
				                        >{fn.fieldHasError('city')}</Typography>
				                    }
		    					</div>

		    					<div className='col-md-6 mb-2'>
									<label className='input-label'>Default Currency</label>
				                    <Select
				                        variant={
				                        	!fn.fieldIsValid('currency') && 
				                        	!fn.fieldIsFocused('currency') && 
				                        	fn.fieldIsTouched('currency') && 
				                        	'danger' ||
				                        	'default'
				                       	}
				                        onChange={
				                        	event => fn.handleFieldValueChange('currency', event.target.value)
				                        }
				                        onFocus={(event) => fn.handleFieldFocus('currency')}
				                        onBlur={(event) => fn.handleFieldBlur('currency')}
				                        value={formData.currency}
				                        classes={{container: 'mb5 mt10'}}
										options={Object.assign({"": "- Select currency -"}, currencies)}
										disabled
				                    />
									

				                    {	!fn.fieldIsValid('currency') && 
				                        !fn.fieldIsFocused('currency') && 
				                        fn.fieldIsTouched('currency') &&
				                        <Typography
				                            size='sm' 
				                            variant='danger'
				                            className='mt0'
				                        >{fn.fieldHasError('currency')}</Typography>
				                    }
		    					</div>
		    				</div>

		    				<div className='row'>
		    					<div className='col-md-6 mb-4'>
									<label className='input-label'>Tax</label>
				                    <Input
				                    	type='number'
				                    	min='0.0'
				                    	step='0.10'
				                        variant={
				                        	!fn.fieldIsValid('tax') && 
				                        	!fn.fieldIsFocused('tax') && 
				                        	fn.fieldIsTouched('tax') && 
				                        	'danger' ||
				                        	'default'
				                       	}
				                        onChange={
				                        	event => fn.handleFieldValueChange('tax', event.target.value)
				                        }
				                        onFocus={(event) => fn.handleFieldFocus('tax')}
				                        onBlur={(event) => fn.handleFieldBlur('tax')}
				                        value={formData.tax}
				                        className='mb5 mt10'
				                        prepend={<h4 className='text-black mv0'>%</h4>}
				                    />

				                    {	!fn.fieldIsValid('tax') && 
				                        !fn.fieldIsFocused('tax') && 
				                        fn.fieldIsTouched('tax') &&
				                        <Typography
				                            size='sm' 
				                            variant='danger'
				                            className='mt0'
				                        >{fn.fieldHasError('tax')}</Typography>
				                    }
		    					</div>

		    					<div className='col-md-6 mb-4'>
									<label className='input-label'>VAT Number</label>
				                    <Input
				                        variant={
				                        	!fn.fieldIsValid('vatnumber') && 
				                        	!fn.fieldIsFocused('vatnumber') && 
				                        	fn.fieldIsTouched('vatnumber') && 
				                        	'danger' ||
				                        	'default'
				                       	}
				                        onChange={
				                        	event => fn.handleFieldValueChange('vatnumber', event.target.value)
				                        }
				                        onFocus={(event) => fn.handleFieldFocus('vatnumber')}
				                        onBlur={(event) => fn.handleFieldBlur('vatnumber')}
				                        value={formData.vatnumber}
				                        className='mb5 mt10'
				                        component={props => TaxNumberFormat({...props})}
				                    />

				                    {	!fn.fieldIsValid('vatnumber') && 
				                        !fn.fieldIsFocused('vatnumber') && 
				                        fn.fieldIsTouched('vatnumber') &&
				                        <Typography
				                            size='sm' 
				                            variant='danger'
				                            className='mt0'
				                        >{fn.fieldHasError('vatnumber')}</Typography>
				                    }
		    					</div>
		    				</div>
		    				<div className='row'>
								<div className='col-md-6 mb-4'>
									<label className='input-label'>Phone</label>
					               	<Input
					                	type='phone'
					                    variant={
					                    	!fn.fieldIsValid('phonenumber') && 
					                    	!fn.fieldIsFocused('phonenumber') && 
					                    	fn.fieldIsTouched('phonenumber') && 
					                    	'danger' ||
					                    	'default'
					                   	}
					                    onChange={
					                    	value => fn.handleFieldValueChange('phonenumber', value)
					                    }
					                    onFocus={(event) => fn.handleFieldFocus('phonenumber')}
					                    onBlur={(event) => fn.handleFieldBlur('phonenumber')}
					                    value={formData.phonenumber}
					                    className='mb5 mt10'
					               	/>

				               	 	{	!fn.fieldIsValid('phonenumber') && 
				                    	!fn.fieldIsFocused('phonenumber') && 
				                    	fn.fieldIsTouched('phonenumber') &&
				                    	<Typography
					                        size='sm' 
					                        variant='danger'
					                        className='mt0'
				                    	>{fn.fieldHasError('phonenumber')}</Typography>
				                	}
					    		</div>

		    					<div className='col-md-6 mb-4'>
									<label className='input-label'>Domain</label>
					               	<Input
				                     	variant={
					                    	!fn.fieldIsValid('domain') && 
					                    	!fn.fieldIsFocused('domain') && 
					                    	fn.fieldIsTouched('domain') && 
					                    	'danger' ||
					                    	'default'
				                   		}
				                    	onChange={
				                    		event => fn.handleFieldValueChange('domain', event.target.value)
				                    	}
				                    	onFocus={(event) => fn.handleFieldFocus('domain')}
				                    	onBlur={(event) => fn.handleFieldBlur('domain')}
				                    	value={formData.domain}
				                    	className='mb5 mt10'
					               	/>

					               	{	!fn.fieldIsValid('domain') && 
				                    	!fn.fieldIsFocused('domain') && 
				                    	fn.fieldIsTouched('domain') &&
				                    	<Typography
					                        size='sm' 
					                        variant='danger'
					                        className='mt0'
				                    	>{fn.fieldHasError('domain')}</Typography>
					               	}
					    		</div>
							</div>

							<div className='flex flex-col'>

								<div className='mb-4'>
									<label className='input-label social-links'>Facebook URL</label>
				                   	<Input
				                        variant={
				                        	!fn.fieldIsValid('facebookurl') && 
				                        	!fn.fieldIsFocused('facebookurl') && 
				                        	fn.fieldIsTouched('facebookurl') && 
				                        	'danger' ||
				                        	'default'
				                       	}
				                        onChange={
				                        	event => fn.handleFieldValueChange('facebookurl', event.target.value)
				                        }
				                        onFocus={(event) => fn.handleFieldFocus('facebookurl')}
				                        onBlur={(event) => fn.handleFieldBlur('facebookurl')}
				                        value={formData.facebookurl}
				                        className='mb5 mt10'
				                    />

					                {	!fn.fieldIsValid('facebookurl') && 
				                        !fn.fieldIsFocused('facebookurl') && 
				                        fn.fieldIsTouched('facebookurl') &&
				                        <Typography
				                            size='sm' 
				                            variant='danger'
				                            className='mt0'
				                        >{fn.fieldHasError('facebookurl')}</Typography>
					                }
		    					</div>
								<div className='mb-4'>
									<label className='input-label social-links'>Instagram URL</label>
					               	<Input
					                    variant={
					                    	!fn.fieldIsValid('instagramurl') && 
					                    	!fn.fieldIsFocused('instagramurl') && 
					                    	fn.fieldIsTouched('instagramurl') && 
					                    	'danger' ||
					                    	'default'
					                   	}
					                    onChange={
					                    	event => fn.handleFieldValueChange('instagramurl', event.target.value)
					                    }
					                    onFocus={(event) => fn.handleFieldFocus('instagramurl')}
					                    onBlur={(event) => fn.handleFieldBlur('instagramurl')}
					                    value={formData.instagramurl}
					                    className='mb5 mt10'
					               	/>

				                	{	!fn.fieldIsValid('instagramurl') && 
				                    	!fn.fieldIsFocused('instagramurl') && 
				                    	fn.fieldIsTouched('instagramurl') &&
				                    	<Typography
				                        size='sm' 
				                        variant='danger'
				                        className='mt0'
				                    	>{fn.fieldHasError('instagramurl')}</Typography>
				                	}
				    			</div>

								<div className='mb-4'>
									<label className='input-label social-links'>Twitter URL</label>
					              	<Input
					                  variant={
					                  	!fn.fieldIsValid('twitterurl') && 
					                  	!fn.fieldIsFocused('twitterurl') && 
					                  	fn.fieldIsTouched('twitterurl') && 
					                  	'danger' ||
					                  	'default'
					                 	}
					                  onChange={
					                  	event => fn.handleFieldValueChange('twitterurl', event.target.value)
					                  }
					                  onFocus={(event) => fn.handleFieldFocus('twitterurl')}
					                  onBlur={(event) => fn.handleFieldBlur('twitterurl')}
					                  value={formData.twitterurl}
					                  className='mb5 mt10'
					              	/>

					              	{ 	!fn.fieldIsValid('twitterurl') && 
					                  	!fn.fieldIsFocused('twitterurl') && 
					                  	fn.fieldIsTouched('twitterurl') &&
						                <Typography
						                    size='sm' 
						                    variant='danger'
						                    className='mt0'
						                 >{fn.fieldHasError('twitterurl')}</Typography>
					              	}
			    				</div>
								<div className='hidden md:block'>
									<Button
										block
										variant='primary'
										type='submit'
									>
										Save
									</Button>
								</div>
							</div>
    						
    					</div>
    					<div className='col-md-4'>
    						<div className='spanned mb30'>
								<label className='input-label mb12'>LOGO (MAX 160X200)</label>
	    						<Dropzone
	    							cancelable={newLogo ? true : false}
	    							selected={newLogo || currentBusiness && currentBusiness.logourl || ''}
	    							onChange={fn.handleNewLogoSelect}
	    							onCancel={fn.handleCancelNewLogo}
	    						/>
    						</div>
							<div className='md:hidden'>
								<Button
								block
								variant='primary'
								type='submit'
							>
								Save
							</Button>
							</div>
    					</div>
    				</div>

    				<div className='spanned mb-12 md:mb-0'>
					
    					<p className='text-base text-black mt50 mb-3'>Plan Details</p>
    					{/* <Button
    						type='button'
    						variant='link-primary' 
    						className='link-primary pl0 pr30 bold'
    						style={{outline: 'none'}}
						>Standard Plan</Button> */}
						{userInfo && userInfo.userplan.planKey === "PLN_trail" &&
							<div>
								<p className='italic text-sm text-black mb-3'>Currently on a <span className='text-brand-blue'>30 day trial.</span> Upgrade to continue to enjoy these benefits.</p>
								<Button
									type='button'
									variant='primary'
									onClick={fn.toggleSubPlans}
								>Upgrade</Button>
								{showPlans &&
									<PageModal
										backdropClose={false}
										escClose={false} 
										show={true}
										className='text-black'
										onDismiss={method => fn.handlePlansDialogDismiss(method)}
									>
										<SubscriptionPlans
										/>
									</PageModal>
								}
							</div>
						}
    				</div>
    			</SettingsTab>
    		</DashboardSection>
		</form>
		{ isFetching && <OverlayProgress /> }
	</div>
);

class BusinessSettings extends FormComponent {

	constructor(){
		super(null, {
	    	form: {
	    		companyname: '',
	    		address: '',
	    		city: '',
	    		industry: '',
	    		phonenumber: '',
	    		service: 'Other',
	    		currency: '',
	    		tax: '0.0',
	    		vatnumber: '',
	    		logourl: '',
	    		domain: '',
	    		facebookurl: '',
	    		instagramurl: '',
	    		twitterurl: '',
	    	},
    		newLogo: null,
    		selectedLogo: null,
			isFetching: false,
			currencies: {},
			showPlans: false
		});
		document.getElementById("pageName").innerText = "Business Settings";
		
	}

    componentDidMount(){
    	const {userInfo, currentBusiness} = this.props;

    	this.mounted = true;

		this.fetch()

    	this.addBusinessInfoToForm();
    }

    componentDidUpdate(prevProps, prevState){
    	if(prevState.form.industry !== this.state.form.industry){
    		this.setState({
    			form: Object.assign({}, this.state.form, {
    				service: this.getIndustryServices(this.state.form.industry)[0] || ''
    			})
    		})
    	}

    	if(!isEqual(prevProps.currentBusiness, this.props.currentBusiness)){
    		this.addBusinessInfoToForm()
    	}
    }

    componentWillUnMount(){
    	this.mounted = false;
    }

    renderMethod(){
        return (
        	<Template
        		{...this.prps()}
        		fn={this.fn()}
        	/>
        );
    }

    fn = () => ({
    	handleSubmit: event =>  this.handleSubmit(event),
    	fieldHasError: (field) => this.fieldHasError(field),
    	fieldIsValid: (field) => this.fieldIsValid(field),
    	fieldIsTouched: (field) => this.fieldIsTouched(field),
    	fieldIsFocused: (field) => this.fieldIsFocused(field),
    	handleFieldFocus: (field) => this.handleFieldFocus(field),
    	handleFieldBlur: (field) => this.handleFieldBlur(field),
    	handleFieldValueChange: (field, value) => this.handleFieldValueChange(field, value),
    	handleCancelLogoCrop: () => this.setState({selectedLogo: null}),
    	handleOnCropLogo: (logo) => this.setState({newLogo: logo, selectedLogo: null}),
    	handleCancelNewLogo: () => this.handleCancelNewLogo(),
		handleNewLogoSelect: (event) => this.handleNewLogoSelect(event),
		toggleSubPlans: () => this.toggleSubPlans(),
		handlePlansDialogDismiss: (method) => this.handlePageDialogDismiss(method)
    });

    prps = () => ({
    	formData: this.state.form,
    	loginProvider: this.props.userInfo.loginprovider,
    	industryNames: this.getIndustryNames(),
    	industryServices: this.getIndustryServices(this.state.form.industry),
    	newLogo: this.state.newLogo,
    	selectedLogo: this.state.selectedLogo,
    	isFetching: this.state.isFetching,
		currentBusiness: this.props.currentBusiness,
		currencies: this.state.currencies,
		showPlans: this.state.showPlans,
		userInfo: this.props.userInfo
	});
	
	fetch(){
		let currencies = {}
        GET_CURRENCIES().then((res) => {
			res.forEach(element => {
				var sign = element.substr(0, element.indexOf(' '))
				currencies[sign] = element
			});

            this.setState({
				currencies: currencies
            })
        })
	}

	toggleSubPlans(){
		this.setState({
			showPlans: !this.state.showPlans
		})
	}

	handlePageDialogDismiss(method){
        switch(method){
            case 'backdrop':
            case 'escape':
                this.toggleSubPlans();
            break;
        }
    }

    validationData = () => ({
    	...this.state.form
    });

    validationRules = () => ({
    	companyname: {
    		required: Rules.required
    	},
    	address: {
    		required: Rules.required
    	},
    	city: {
    		required: Rules.required
    	},
    	industry: {
    		required: Rules.required,
    		isIn: value => Rules.isIn(this.getIndustryNames(), value)
    	},
    	service: {
    		required: Rules.required,
    		isIn: value => Rules.isIn(this.getIndustryServices(this.state.form.industry), value)
    	},
    	currency: {
    		required: Rules.required,
    		isIn: value => Rules.isIn(Object.keys(this.state.currencies), value)
    	},
    	tax: {
    		required: value => Rules.sometimes(Rules.isPercent, value)
    	},
    	domain: {
    		isUrl: value => Rules.sometimes(Rules.isUrl, value)
    	},
    	facebookurl: {
    		isFacebookUrl: value => Rules.sometimes(Rules.isFacebookUrl, value)
    	},
    	twitterurl: {
    		isTwitterUrl: value => Rules.sometimes(Rules.isTwitterUrl, value)
    	},
    	instagramurl: {
    		isInstagramUrl: value => Rules.sometimes(Rules.isInstagramUrl, value)
    	},
    	phonenumber: {
    		isPhone: value => Rules.sometimes(isValidPhoneNumber, value)
    	},
    });

    validationMessages = () => ({
    	companyname: {
    		required: 'The company name is required.'
    	},
    	address: {
    		required: 'The company addres is required.'
    	},
    	city: {
    		required: 'Address city is required.'
    	},
    	industry: {
    		required: 'Industry is required.',
    		isIn: 'Please select an industry from the list.'
    	},
    	service: {
    		required: 'Please select your service type.',
    		isIn: 'Please select a service type from the list.'
    	},
    	currency: {
    		required: 'Please select a currency.',
    		isIn: ''
    	},
    	tax: {
    		required: 'Please specify amount of tax.'
    	},
    	domain: {
    		isUrl: 'Please enter a valid url. E.g. www.example.com'
    	},
    	facebookurl: {
    		isFacebookUrl: 'Please enter a valid facebook url. E.g. http://facebook.com/example.'
    	},
    	twitterurl: {
    		isTwitterUrl: 'Please enter a valid twitter url. E.g. http://twitter.com/example.'
    	},
    	instagramurl: {
    		isInstagramUrl: 'Please enter a valid instagram url. E.g. http://instagram.com/example.'
    	},
    	phonenumber: {
    		isPhone: 'Please enter a valid phone number.'
    	},
	});

	getIndustryNames(){
        let industryNames = [];
        for(var i = 0; i < INDUSTRIES.length; i++){
            industryNames.push(INDUSTRIES[i]['name']);
        }
        return industryNames;
    }

	getIndustryServices(industryName){
        let industry = INDUSTRIES.find(item => item.name == industryName);
        if(!industry){
        	return ['Other'];
        }
        return industry['services'];
    }

    handleNewLogoSelect(event){
    	if( !event || 
    		!event.target || 
    		!event.target.files || 
    		event.target.files.length < 1 
    	){
    		return;
    	}

    	// get the selected file
    	let file = event.target.files[0];

    	// check file type
    	if([
    		'image/png',
    		'image/jpg',
    		'image/jpeg'
    		].indexOf(file.type) == -1
    	){
    		this.props.showSnackbar(
    			'File must be jpeg or png in format.', 
    			{
    				variant: 'warning'
    			}
    		);
    		return;
    	}

    	// check file size
    	if(file.size / 1024 >= 1025){
    		this.props.showSnackbar(
    			'Image file size must be 1mb or less.', 
    			{
    				variant: 'warning'
    			}
    		);
    		return;
    	}

    	// instantiate file reader
    	let fr = new FileReader();

    	// read selected file as data url
    	fr.readAsDataURL(file);

    	// handle when file conversion is successful
    	fr.onload = (event) => {
    		this.setState({
    			selectedLogo: event.currentTarget.result
    		}, () => {
    			this.logoFile = file;
    		});
    	};

    	// handle when file conversion fails
    	fr.onerror = (error) => {
    		if(DEBUG){
    			console.error(error);
    		}
    		this.props.showSnackbar(
    			'Unable to select file, please try again in a moment.',
    			{
    				variant: 'warning'
    			}
    		);
    	};
    }

    handleCancelNewLogo(){
    	this.logoFile = undefined;
    	this.setState({
    		newLogo: null,
    		selectedLogo: null
    	})
    }

    handleSubmit(event){
		event.preventDefault();

		window.scrollTo(0,0);
    	// get form data
    	let updateData = Object.assign({}, this.props.currentBusiness, this.state.form);

    	// add new avatar if any is selected
    	if(this.state.newLogo){
    		let newLogo = this.state.newLogo.split(',');
    		updateData['image'] = newLogo[1] || undefined;
    	}else{
			updateData['image'] = this.state.form.logourl
		}

    	// stop if no change was made
    	if(!isEqual(updateData, this.state.initialForm)){
	    	// do update
    		this.doUpdate(updateData);
    	}
    }

    doUpdate(data){
    	this.setState({
    		isFetching: true
    	}, () => {
    			setTimeout(() => {
    			  UPDATE_BUSINESS_INFO(data).then(response => {
    			  	if(this.mounted){
	    			  	this.setState({
	    			  		isFetching: false,
	    			  		initialForm: data,
	    			  		selectedLogo: null,
	    			  		newLogo: null
	    			  	}, () => {
	    			  		this.props.showSnackbar('Business information updated.', {variant: 'success'});
	    			  		this.props.setCurrentBusiness(response);
	    			  	});
    			  	}
    			  }).catch(error => {
    			  	if(this.mounted){
	    			  	// 
	    			  	let errorMessage = typeof error == 'string' && error || 'An error occured, please try again.';
	    			  	errorMessage = MessageParser(errorMessage);

	    			  	// 
	    			  	this.props.showSnackbar(errorMessage, {variant: 'error'});

	    			  	// 
	    			  	this.setState({
	    			  		isFetching: false
	    			  	});
    			  	}
    			  });
    			}, 1000);
    	});
    }

    addBusinessInfoToForm(){
    	const { currentBusiness } = this.props;

    	let form = {
    		companyname: currentBusiness && currentBusiness.companyname || '',
    		address: currentBusiness && currentBusiness.address || '',
    		city: currentBusiness && currentBusiness.city || '',
    		industry: currentBusiness && currentBusiness.industry || '',
    		phonenumber: currentBusiness && currentBusiness.phonenumber || '',
    		service: currentBusiness && currentBusiness.service || 'Other',
    		currency: currentBusiness && currentBusiness.currency || '',
    		tax: currentBusiness && currentBusiness.tax || '0.0',
    		vatnumber: currentBusiness && currentBusiness.vatnumber || '',
    		logourl: currentBusiness && currentBusiness.logourl || '',
    		domain: currentBusiness && currentBusiness.domain || '',
    		facebookurl: currentBusiness && currentBusiness.facebookurl || '',
    		instagramurl: currentBusiness && currentBusiness.instagramurl || '',
    		twitterurl: currentBusiness && currentBusiness.twitterurl || '',
    	};

    	this.setState({
    		form: form,
    		initialForm: Object.assign({}, this.state.form, form)
    	});
    }
}

const mapStateToProps = ({userInfo, currentBusiness}) => ({ 
	userInfo: userInfo.data,
	currentBusiness: currentBusiness.data || null
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
	showSnackbar: ActionCreators.showSnackbar,
	setCurrentBusiness: ActionCreators.setCurrentBusiness
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BusinessSettings));