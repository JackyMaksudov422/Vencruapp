import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SettingsUserCard from '../presentation/SettingsUserCard';
import DashboardSection from '../presentation/DashboardSection';
import SettingsTab from '../presentation/SettingsTab';
import FormComponent from './FormComponent';
import Button from '../presentation/Button';
import ImageCropper from '../presentation/ImageCropper';
import * as Rules from '../../helpers/Rules';
import { ActionCreators } from '../../data/actionCreators';
import { bindActionCreators } from 'redux';
import Input from '../presentation/Input';
import Typography from '../presentation/Typography';
import isEqual from 'lodash/isEqual';
import { UPDATE_PROFILE } from '../../configs/api.config';
import MessageParser from '../../helpers/MessageParser';
import OverlayProgress from '../presentation/OverlayProgress';
import { DEBUG } from '../../configs/app.config';

const Template = ({
	fn,
	selectedImage,
	newAvatar,
	formData,
	loginProvider,
	isFetching
}) => (
	<div className='app-authenticated-body settings-page business-settings'>
			<form onSubmit={(event) => fn.handleSubmit(event)}>
    	 	{/* tabs */}
    		<DashboardSection>
    			<SettingsTab showMobileNav={false}>
    				<div className='row md:w-2/3'>
    					<div className='col-md-6 mb-2'>
								<label className='input-label'>First Name</label>
                <Input
                    variant={
                    	!fn.fieldIsValid('firstname') && 
                    	!fn.fieldIsFocused('firstname') && 
                    	fn.fieldIsTouched('firstname') && 
                    	'danger' ||
                    	'default'
                   	}
                    onChange={
                    	event => fn.handleFieldValueChange('firstname', event.target.value)
                    }
                    onFocus={(event) => fn.handleFieldFocus('firstname')}
                    onBlur={(event) => fn.handleFieldBlur('firstname')}
                    value={formData.firstname}
                    className='mb5 mt10'
                />

                {	!fn.fieldIsValid('firstname') && 
                    !fn.fieldIsFocused('firstname') && 
                    fn.fieldIsTouched('firstname') &&
                    <Typography
                        size='sm' 
                        variant='danger'
                        className='mt0'
                    >{fn.fieldHasError('firstname')}</Typography>
                }
    					</div>

    					<div className='col-md-6 mb-2'>
								<label className='input-label'>Last Name</label>
                <Input
                    variant={
                    	!fn.fieldIsValid('lastname') && 
                    	!fn.fieldIsFocused('lastname') && 
                    	fn.fieldIsTouched('lastname') && 
                    	'danger' ||
                    	'default'
                   	}
                    onChange={
                    	event => fn.handleFieldValueChange('lastname', event.target.value)
                    }
                    onFocus={(event) => fn.handleFieldFocus('lastname')}
                    onBlur={(event) => fn.handleFieldBlur('lastname')}
                    value={formData.lastname}
                    className='mb5 mt10'
                />

                {	!fn.fieldIsValid('lastname') && 
                    !fn.fieldIsFocused('lastname') && 
                    fn.fieldIsTouched('lastname') &&
                    <Typography
                        size='sm' 
                        variant='danger'
                        className='mt0'
                    >{fn.fieldHasError('lastname')}</Typography>
                }
    					</div>

							<div className='col-md-6 mb-2'>
								<label className='input-label'>{loginProvider == 'google' && 'Google '}Email</label>
                <Input
                    variant={
                    	loginProvider != 'google' &&
                    	!fn.fieldIsValid('email') && 
                    	!fn.fieldIsFocused('email') && 
                    	fn.fieldIsTouched('email') && 
                    	'danger' ||
                    	'default'
                   	}
                    onChange={
                    	loginProvider != 'google' ?
                    	event => fn.handleFieldValueChange('email', event.target.value)
                    	: undefined
                    }
                    onFocus={loginProvider != 'google' ? event => fn.handleFieldFocus('email') : undefined}
                    onBlur={loginProvider != 'google' ? event => fn.handleFieldBlur('email') : undefined}
                    value={formData.email}
                    className='mb5 mt10'
					// readOnly={loginProvider == 'google'}
					readOnly
                />
				{
					<Typography
						size='sm' 
						variant='default'
						className='mt0'
					>Email hello@vencru.com to change your email address</Typography>
				}

                {	loginProvider != 'google' && !fn.fieldIsValid('email') && 
                    !fn.fieldIsFocused('email') && 
                    fn.fieldIsTouched('email') &&
                    <Typography
                        size='sm' 
                        variant='danger'
                        className='mt0'
                    >{fn.fieldHasError('email')}</Typography>
                }
	    				</div>
	    			</div>
					<div className='mt-4'>
						<Button 
							variant='success'
							children='Save'
							block
						/>
    				</div>
    			</SettingsTab>
    		</DashboardSection>
		</form>
		{ isFetching && <OverlayProgress/> }
	</div>
);

class ProfileSettings2 extends FormComponent {

	constructor(){
		super(null, {
	    	form: {
	    		firstname: '',
	    		lastname: '',
	    		email: '',
	    		profileimageurl: '',
	    	},
	    	selectedImage: null,
	    	newAvatar: null,
	    	isFetching: false
		});
		document.getElementById("pageName").innerText = "Profile Settings";
	}

    componentDidMount(){
    	const {userInfo, currentBusiness} = this.props;

    	this.mounted = true;

    	// 
    	let form = {
    		firstname: userInfo.firstname || '',
    		lastname: userInfo.lastname || '',
    		email: userInfo.email || '',
    		profileimageurl: userInfo && userInfo.profileimageurl || '',
    	};

    	// 
    	if(userInfo){
    		this.setState({
    			form: Object.assign({}, this.state.form, form),
    			initialForm: Object.assign({}, this.state.form, form)
    		});
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
    	handleProfilePictureSelect: event => this.handleProfilePictureSelect(event),
    	fieldHasError: (field) => this.fieldHasError(field),
    	fieldIsValid: (field) => this.fieldIsValid(field),
    	fieldIsTouched: (field) => this.fieldIsTouched(field),
    	fieldIsFocused: (field) => this.fieldIsFocused(field),
    	handleFieldFocus: (field) => this.handleFieldFocus(field),
    	handleFieldBlur: (field) => this.handleFieldBlur(field),
    	handleCancelAvatarCrop: () => this.setState({selectedImage: null}),
    	handleOnCropAvatar: (avatar) => this.setState({newAvatar: avatar, selectedImage: null}),
    	handleFieldValueChange: (field, value) => this.handleFieldValueChange(field, value),
    	handleUndoProfilePictureSelect: () => this.handleUndoProfilePictureSelect()
    });

    prps = () => ({
    	selectedImage: this.state.selectedImage,
    	newAvatar: this.state.newAvatar,
    	formData: this.state.form,
    	loginProvider: this.props.userInfo.loginprovider,
    	isFetching: this.state.isFetching
    });

    validationData = () => ({
    	...this.state.form
	});

    validationRules = () => ({
    	firstname: {
    		required: Rules.required
    	},
    	lastname: {
    		required: Rules.required
    	},
    	email: this.props.userInfo.loginprovider != 'google' &&  {
    		required: Rules.required,
    		email: Rules.isEmail
    	} || undefined
    });

    validationMessages = () => ({
    	firstname: {
    		required: 'Your first name is required.'
    	},
    	lastname: {
    		required: 'Your last name is required.'
    	},
    	email: this.props.userInfo.loginprovider != 'google' && {
    		required: 'Your email address is required.',
    		email: 'Please enter a valid email address.'
    	} || undefined
	});

    handleProfilePictureSelect(event){
    	if( !event || 
    		!event.target || 
    		!event.target.files || 
    		event.target.files.length < 1 
    	){

    		return;
    	}

    	// get the selected file
    	let file = event.target.files[0];

    	// cehck file type
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

    	// cehck file size
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
    			selectedImage: event.currentTarget.result
    		}, () => {
    			this.file = file;
    		});
    	};

    	// handle when file conversion fails
    	fr.onerror = (error) => {
    		if(DEBUG){
    			console.error(error);
    		}
    		this.props.showSnackbar(
    			'Unable to select file, please tray gain in a moment.',
    			{
    				variant: 'warning'
    			}
    		);
    	};
    }

    handleUndoProfilePictureSelect() {
    	this.setState({
    		selectedImage: null,
    		newAvatar: null
    	}, () => {
    		this.file = null;
    	});
    }

    handleSubmit(event){
		event.preventDefault();
		window.scrollTo(0,0)
    	const { userInfo } = this.props

    	// get form data
    	let updateData = {...this.state.form};

    	// add new avatar if any is selected
    	if(this.state.newAvatar){
    		let newAvatar = this.state.newAvatar.split(',');
    		updateData['image'] = newAvatar[1] || null;
    	}

    	// stop if no change was made
    	if(!isEqual(updateData, this.state.initialForm)){

    		// set email address
    		updateData.emailaddress = updateData.email;
    		updateData.profileimageurl = userInfo.profileimageurl;
    		delete updateData.email;

	    	// remove profile image url
	    	delete updateData.profileimageurl;

	    	// update progile
    		this.doUpdate(updateData);
    	}
    }

    doUpdate(data){
    	this.setState({
    		isFetching: true
    	}, () => {
    			setTimeout(() => {
    			  UPDATE_PROFILE(data).then(response => {
    			  	if(this.mounted){
	    			  	this.setState({
	    			  		isFetching: false,
	    			  		initialForm: data,
	    			  		selectedImage: null,
	    			  		newAvatar: null
	    			  	}, () => {
	    			  		this.props.showSnackbar('Profile setting updated.', {variant: 'success'});
	    			  		this.props.setUserInfo(response);
	    			  	});
    			  	}
    			  }).catch(error => {
    			  	if(this.mounted){
	    			  	let errorMessage = typeof error == 'string' && error || 'An error occured, please try again.';
	    			  	errorMessage = MessageParser(errorMessage);

	    			  	this.props.showSnackbar(errorMessage, {variant: 'error'});

	    			  	this.setState({
	    			  		isFetching: false
	    			  	});
    			  	}
    			  });
    			}, 1000);
    	});
    }
}

const mapStateToProps = ({userInfo, currentBusiness}) => ({ 
	userInfo: userInfo.data,
	currentBusiness: currentBusiness.data || null,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
	showSnackbar: ActionCreators.showSnackbar,
	setUserInfo: ActionCreators.setUserInfo
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProfileSettings2));