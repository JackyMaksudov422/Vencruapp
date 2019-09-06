import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import * as Rules from '../../helpers/Rules';
import Grid from '@material-ui/core/Grid/Grid';
import Validator from '../../modules/Validator';
import Typography from '../presentation/Typography';
import Input from '../presentation/Input';
import Select from '../presentation/Select';
import OnboardingStep from './OnboardingStep';
import Checkbox from '../presentation/Checkbox';
import isEqual from 'lodash/isEqual';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { COUNTRIES_LIST } from '../../configs/data.config';

/**
 * component template
 */
let Template = ({
    fn,
    validationData,
    validationRules,
    validationMessages,
    firstname,
    lastname,
    companyname,
    phonenumber,
    address,
    isincorporated,
    error,
    showError
}) => (
    <div>
        <Validator
            form={validationData}
            rules={validationRules}
            messages={validationMessages}
            onChange={(state) => fn.handleValidatorChange(state)}
        />

        <div className='onboarding-business-card'>
            <div className='content'>
                <Typography 
                    align='center' 
                    size='lg' 
                    variant='active'
                    className='spanned md:mt-16 mb-2'
                >Create your business card</Typography>
                <Typography 
                    align='center' 
                    className='spanned mt-0 md:mb-6'
                >Creating your business card will make sending invoices and campaigns easier.</Typography>

                <div className='form-container md:mb-2 py-0 justify-center'>
                    <div className='fields-container'>
                    {showError && 
                        <div className="onboarding-error mb-2">
                            {error}
                        </div>
                    }
                        <div className='container-fluid'>
                            <div className='row mb20'>
                                <div className='col-md-6'>
                                    <div className='spanned'>
                                        <Input 
                                            size='sm'
                                            noIcon
                                            label='First Name' 
                                            value={firstname} 
                                            onFocus={() => fn.handleFocus('firstname')}
                                            onBlur={() => fn.handleBlur('firstname')}
                                            variant={fn.isTouched('firstname') && fn.hasError('firstname') && !fn.isFocused('firstname') ? 'danger' : 'default'}
                                            onChange={(event) => fn.handleFieldChange('firstname', event.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='spanned'>
                                        <Input 
                                            size='sm'
                                            noIcon
                                            label='Last Name' 
                                            value={lastname} 
                                            onFocus={() => fn.handleFocus('lastname')}
                                            onBlur={() => fn.handleBlur('lastname')}
                                            variant={fn.isTouched('lastname') && fn.hasError('lastname') && !fn.isFocused('lastname') ? 'danger' : 'default'}
                                            onChange={(event) => fn.handleFieldChange('lastname', event.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='row mb20'>
                                <div className='col-md-12'>
                                    <div className='spanned'>
                                        <Input 
                                            size='sm'
                                            noIcon
                                            label='Address' 
                                            value={address} 
                                            onFocus={() => fn.handleFocus('address')}
                                            onBlur={() => fn.handleBlur('address')}
                                            variant={fn.isTouched('address') && fn.hasError('address') && !fn.isFocused('address') ? 'danger' : 'default'}
                                            onChange={(event) => fn.handleFieldChange('address', event.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='row mb20'>
                                <div className='col-md-6'>
                                    <div className='spanned'>
                                        <Input 
                                            size='sm'
                                            noIcon
                                            label='Company' 
                                            value={companyname} 
                                            onFocus={() => fn.handleFocus('companyname')}
                                            onBlur={() => fn.handleBlur('companyname')}
                                            variant={fn.isTouched('companyname') && fn.hasError('companyname') && !fn.isFocused('companyname') ? 'danger' : 'default'}
                                            onChange={(event) => fn.handleFieldChange('companyname', event.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='spanned'>
                                        <Input 
                                            size='sm'
                                            noIcon
                                            type='phone'
                                            label='Phone Number' 
                                            value={phonenumber} 
                                            onFocus={() => fn.handleFocus('phonenumber')}
                                            onBlur={() => fn.handleBlur('phonenumber')}
                                            variant={fn.isTouched('phonenumber') && fn.hasError('phonenumber') && !fn.isFocused('phonenumber') ? 'danger' : 'default'}
                                            onChange={(value) => fn.handleFieldChange('phonenumber', value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='design-space'>&nbsp;</div>
                </div>
                <div className='spanned text-center'>
                    <Checkbox 
                        checked={isincorporated == 1}
                        square 
                        onChange={(event) => fn.handleFieldChange('isincorporated', event.target.checked ? 1 : 0 )}
                        label='My Business Is incorporated/registered'
                    />
                </div>


            </div>
        </div>
    </div>
);

class OnboardingBusinessCard extends OnboardingStep {
    static propTypes = {
        initialData: propTypes.oneOfType([propTypes.object]).isRequired,
        onSubmit: propTypes.func.isRequired,
        setRef: propTypes.func.isRequired,
        onValidityChange: propTypes.func.isRequired,
    }

    state = {
        initialized: false,
        firstname: '',
        lastname: '',
        companyname: '',
        phonenumber: '',
        address: '',
        isincorporated: true,
        validation: {
            fields: null,
            valid: false
        },
        touched: [],
        focused: [],
        showError : false,
        error : null
    };

    constructor(){
        super();
    }

    checkFormError = () => {
        let error = null
        
        this.setState({
            showError : false
        })

        if (this.state.validation.valid){
            this.setState({
                error : null
            })
            return
        }
        else {
            for (let item of Object.keys(this.state.validation.fields)){
                const field = this.state.validation.fields[item]                
                if (field.error === null){
                    continue   
                }
                else{
                    error = field.error
                    break
                }
            }
        }

        this.setState({
            error : error
        })
    }

    componentDidMount(){
        this.initialize(this.props.initialData);
        this.props.setRef(this);
    }

    componentDidUpdate(prevProps, prevState){
        if(!isEqual(prevProps.initialData, this.props.initialData)){
            this.initialize(this.props.initialData);
        }
    }

    render(){
        if(!this.props.active || !this.state.initialized){
            return null;
        }

        return <Template 
            {...this.prps()} 
            fn={this.fn()}            
        />;
    }

    fn = () => ({
        handleValidatorChange: (state) => this.handleValidatorChange(state, this.checkFormError),
        handleFieldChange: (field, value) => this.handleFieldChange(field, value),
        hasError: (field) => this.hasError(field),
        isFocused: (field) => this.isFocused(field),
        isTouched: (field) => this.isTouched(field),
        handleBlur: (field) => this.handleBlur(field),
        handleFocus: (field) => this.handleFocus(field),
    })

    prps = () => ({
        validationRules: this.validationRules(),
        validationMessages: this.validationMessages(),
        validationData: this.validationData(),
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        companyname: this.state.companyname,
        phonenumber: this.state.phonenumber,
        address: this.state.address,
        city: this.state.city,
        country: this.state.country,
        isincorporated: this.state.isincorporated,
        error : this.state.error,
        showError : this.state.showError
    })

    validationData(){
        return {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            companyname: this.state.companyname,
            phonenumber: this.state.phonenumber,
            address: this.state.address,
            
            isincorporated: this.state.isincorporated
        }
    }

    validationRules(){
        return {
            firstname: {
                required: Rules.required
            },
            lastname: {
                required: Rules.required
            },
            companyname: {
                required: Rules.required
            },
            phonenumber: {
                required: Rules.required,
                isPhone: isValidPhoneNumber,
            },
            address: {
                // required: Rules.required
            },
            city: {
                // required: Rules.required
            },
            country: {
                required: Rules.required
            }
        };
    }

    validationMessages(){
        return {
            firstname: {
                required: 'Please enter your first name.'
            },
            lastname: {
                required: 'Please enter your last name.'
            },
            companyname: {
                required: 'Please enter your company name.'
            },
            phonenumber: {
                required: 'Please enter your phone number.',
                isPhone: 'Please enter your phone number starting with country code.',
            },
            address: {
                // required: 'Please enter your company\'s/business address.'
            },
            city: {
                // required: 'Your city is required.'
            },
            country: {
                required: 'Please enter your country\'s name.'
            }
        };
    }

    submit(){
        this.setState({
            touched: [
                'firstname', 
                'lastname', 
                'companyname', 
                'phonenumber', 
                'address', 
                
                'isincorporated'
            ]
        });
        if( !this.props.active ||
            !this.isValid()
        ){
            this.setState({
                showError : true
            })
            return;
        }
        this.props.onSubmit({
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            companyname: this.state.companyname,
            phonenumber: this.state.phonenumber,
            address: this.state.address,
            isincorporated: this.state.isincorporated
        });
    }

    initialize(initialData){
        this.setState({
            initialized: true,
            firstname: initialData.firstname || '',
            lastname: initialData.lastname || '',
            companyname: initialData.companyname || '',
            phonenumber: initialData.phonenumber || '',
            address: initialData.address || '',
            isincorporated: typeof initialData.isincorporated == 'number' ? initialData.isincorporated : 0
        });
    }
}

const mapStateToProps = (state) => ({ 
    // states go here
});

export default connect(mapStateToProps)(withRouter(OnboardingBusinessCard));