import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FormComponent from './FormComponent';
import * as Rules from '../../helpers/Rules';
import Input from '../presentation/Input';
import Select from '../presentation/Select';
import Checkbox from '../presentation/Checkbox';
import Button from '../presentation/Button';
import Typography from '../presentation/Typography';
import propTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { 
	ROLE_DESCRIPTIONS,
	ROLE_TYPES,
	PRIVILEGES
} from '../../configs/data.config.js';
import { ActionCreators } from '../../data/actionCreators';
import { bindActionCreators } from 'redux';
import chunk from 'lodash/chunk';

/**
 * component template
 */
let Template = ({
	fn, 
	form, 
	title, 
	submitLabel, 
	disabled
}) => (
    <form className='vc-team-members-form edit-team-member' onSubmit={(ev) => fn.handlSubmit(ev)}>
    	<div className='vc-team-members-form-header'>
            <h1 className='title'>
                { title }
            </h1>
            <h6 className='subtitle'>
            	Team members will not have access to business settings and editing.
            </h6>
    	</div>
    	<div className='vc-team-members-form-body'>
            <div className='form-fields'>
                <div className='form-fields-inner'>
                	<div className='row fields-row'>
                		<div className='col-md-6 mb20'>
                			<label className='input-label'>First Name</label>
                            <Input 
                                size='sm'
                                noIcon
                                disabled={disabled}
                                value={form.firstname} 
                                onFocus={() => fn.handleFieldFocus('firstname')}
                                onBlur={() => fn.handleFieldBlur('firstname')}
                                variant={fn.fieldIsTouched('firstname') &&
                                		fn.fieldHasError('firstname') &&
                                		!fn.fieldIsFocused('firstname') 
                                		? 'danger' : 'default'
                                }
                                onChange={(event) => fn.handleFieldValueChange(
                                	'firstname',
                                	event.target.value
                                )}
                            />
                            {
                                fn.fieldHasError('firstname') && 
                                !fn.fieldIsFocused('firstname') && 
                                fn.fieldIsTouched('firstname') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >{fn.fieldHasError('firstname')}</Typography>
                            }
                		</div>
	            		<div className='col-md-6 mb20'>
	            			<label className='input-label'>Last Name</label>
	                        <Input 
	                            size='sm'
	                            noIcon
	                            disabled={disabled}
	                            value={form.lastname} 
	                            onFocus={() => fn.handleFieldFocus('lastname')}
	                            onBlur={() => fn.handleFieldBlur('lastname')}
	                            variant={fn.fieldIsTouched('lastname') && 
	                            		fn.fieldHasError('lastname') && 
	                            		!fn.fieldIsFocused('lastname') 
	                            		? 'danger' : 'default'
	                            }
	                            onChange={(event) => fn.handleFieldValueChange(
	                            	'lastname', event.target.value
	                            )}
	                        />
	                        {
	                            fn.fieldHasError('lastname') && 
	                            !fn.fieldIsFocused('lastname') && 
	                            fn.fieldIsTouched('lastname') &&
	                            <Typography
	                                size='sm' 
	                                variant='danger'
	                                className='mt0'
	                            >{fn.fieldHasError('lastname')}</Typography>
	                        }
	            		</div>
                	</div>
                	<div className='row fields-row'>
                		<div className='col-md-12 mb20'>
                			<label className='input-label'>Email Address</label>
                            <Input 
                                size='sm'
                                noIcon
                                disabled={disabled}
                                value={form.memberemail} 
                                onFocus={() => fn.handleFieldFocus('memberemail')}
                                onBlur={() => fn.handleFieldBlur('memberemail')}
                                variant={fn.fieldIsTouched('memberemail') && 
                                		fn.fieldHasError('memberemail') && 
                                		!fn.fieldIsFocused('memberemail') 
                                		? 'danger' : 'default'
                                }
                                onChange={(event) => fn.handleFieldValueChange(
                                	'memberemail', event.target.value
                                )}
                            />
                            {
                                fn.fieldHasError('memberemail') && 
                                !fn.fieldIsFocused('memberemail') && 
                                fn.fieldIsTouched('memberemail') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >
                                	{fn.fieldHasError('memberemail')}
                                </Typography>
                            }
                		</div>
                	</div>

                	<div className='row fields-row mb20 role-description1'>
                		<div className='col-md-6 mb20'>
                			<label 
                				className='input-label'
                			>
                				Role Description
                			</label>
                            <Select 
                                size='sm'
                                disabled={disabled}
                                value={form.roles} 
                                onFocus={() => fn.handleFieldFocus(
                                	'roles'
                                )}
                                onBlur={() => fn.handleFieldBlur(
                                	'roles'
                                )}
                                variant={fn.fieldIsTouched('roles') && 
                                		fn.fieldHasError('roles') && 
                                		!fn.fieldIsFocused('roles') 
                                		? 'danger' : 'default'
                                }
                                options={{
                            		'': 'Select Role Description',
                            		...ROLE_DESCRIPTIONS
                            	}}
                                onChange={
                                	event => fn.handleFieldValueChange(
                                		'roles', event.target.value
                                	)
                                }
                            />
                            {
                                fn.fieldHasError('roles') && 
                                !fn.fieldIsFocused('roles') && 
                                fn.fieldIsTouched('roles') &&
                                <Typography
                                    size='sm' 
                                    variant='danger'
                                    className='mt0'
                                >
                                	{fn.fieldHasError('roles')}
                                </Typography>
                            }
                		</div>

                		<div className='col-md-6 mb20  role-description2'>
                			<label 
                				className='input-label'
                			>
                				Role Description
                			</label>
                			<div className='spanned flex-row justify-space-between-list pt23'>
        						<Checkbox
        							value={'admin'}
        							checked={form.roles === 'admin'}
        							square
        							label={ROLE_TYPES['admin']}
        						/>
        						<Checkbox
        							value={'staff'}
        							checked={form.roles === 'accountant'}
        							square
        							label={ROLE_TYPES['staff']}
        						/>
        						<Checkbox
        							value={'constractor'}
        							checked={form.roles === 'contractor'}
        							square
        							label={ROLE_TYPES['constractor']}
        						/>
                			</div>	
                		</div>
                	</div>

                	<div className='row fields-row mb20 priviliges'>
                		<div className='col-md-12 mb20'>
                			<label 
                				className='input-label'
                			>
                				Privileges
                			</label>
                			<div className='spanned'>
                				{chunk(Object.keys(PRIVILEGES), 3).map((item, index) => {
                					return (
                						<ul className='spanned mb0 list-unstyled' key={index}>
		                					{ item.map((item, index) => {
			                					return (
			                						<li key={index}>
				                						<Checkbox
				                							value={PRIVILEGES[item].label}
				                							checked={PRIVILEGES[item].roles.indexOf(form.roles) !== -1}
				                							square
				                							label={PRIVILEGES[item].label}
				                						/>
			                						</li>
			                					);
		                					})}
                						</ul>
                					)

                				})}
                			</div>	
                		</div>
                	</div>

                	<div className='row fields-row text-left mb20'>
                		<div className='col-md-12 text-center'>
                			<Button 
                				variant='link-gray'
                				type='button'
                				onClick={fn.handleCancelPress}
                			>
                				Cancel
                			</Button>
                			<Button 
                				variant='primary'
                			>
                				{ submitLabel || 'Submit'}
                			</Button>
                		</div>
                	</div>
                </div>
            </div>
    	</div>
    </form>
);

class TeamMemberForm extends FormComponent {

    static propTypes = {
        setRef: propTypes.func
    };
    
    constructor(props){
        super(props, {
            form: {
                firstname: '',
                lastname: '',
                memberemail: '',
                roles: ''
            }
        });
    }

    componentDidMount(){
        if(typeof this.props.setRef == 'function'){
            this.props.setRef(this);
        }
        if(this.props.data){
            this.setState({
                form: {
	                firstname: this.props.data.firstname || '',
	                lastname: this.props.data.lastname,
	                memberemail: this.props.data.memberemail,
	                roles: this.props.data.roles
                },
                initialForm: {
                	firstname: this.props.data.firstname || '',
	                lastname: this.props.data.lastname,
	                memberemail: this.props.data.memberemail,
	                roles: this.props.data.roles
                }
            })
        }
    }

    componentWillUnmount(){
        if(typeof this.props.setRef == 'function'){
            this.props.setRef(undefined);
        }
    }

    renderMethod(){
        return <Template 
            {...this.prps()} 
            fn={this.fn()} 
        />;
    }

    fn = () => ({
        // bound functions go here
        fieldHasError: (field) => this.fieldHasError(field),
        fieldIsTouched: (field) => this.fieldIsTouched(field),
        fieldIsFocused: (field) => this.fieldIsFocused(field),
        handleFieldBlur: (field) => this.handleFieldBlur(field),
        handleFieldFocus: (field) => this.handleFieldFocus(field),
        handleFieldValueChange: (field, value) => this.handleFieldValueChange(
        											field,
        											value
        										),
        handlSubmit: (ev) => this.handlSubmit(ev),
        handleCancelPress: this.props.onCancel ? 
        					() => this.props.onCancel() :
        					null,
    })

    prps = () => ({
        form: this.state.form,
        disableSubmit: this.disableSubmit(),
        disabled: this.props.disabled || false,
        title: this.props.title,
        submitLabel: this.props.submitLabel,
        currentBusiness: this.props.currentBusiness
    })

    disableSubmit(){
        if(!this.formIsValid()){
            return true;
        }
        if(this.props.disabled){
            return true;
        }
        return false;
    }

    validationData(){
        return Object.assign({}, this.state.form, {
        	Receipt: this.state.selectedReceipt
        });
    }

    validationRules(){
        return {
            firstname: {
                required: Rules.required
            },
            lastname: {
                required: Rules.required,
            },
            memberemail: {
                required: Rules.required,
                isEmail: Rules.isEmail,
            },
            roles: {
                required: Rules.required,
                isIn: value => Rules.isIn(
                	Object.keys(ROLE_DESCRIPTIONS), 
                	value
                ),
            }
        }
    }

    validationMessages(){
        return {
            firstname: {
                required: `Please enter team member's first name.`
            },
            lastname: {
                required: `Please enter team member's last name.`,
            },
            memberemail: {
                required: `Please enter the team member's email address.`,
                isEmail: `You entered an invalid email address.`,
            },
            roles: {
                required: `Please select a role.`,
                isIn: `Invalid role selected.`,
            }
        }
    }

    handlSubmit(ev){
        ev.preventDefault();
        let formData = this.state.form && {...this.state.form} || {};
        let fields = Object.keys(formData);
        if(fields.length < 1){
            return;
        }
        this.setState({
            touched: fields
        }, () => {
            if(this.formIsValid()){
                if(typeof this.props.onSubmit == 'function'){
                    this.props.onSubmit(Object.assign({}, {
                    	firstname: formData.firstname,
                    	lastname: formData.lastname,
                    	memberemail: formData.memberemail,
                    	roles: formData.roles
                    }));
                }
            }
        });
    }

    isUpdated(){
        const { data } = this.props;
        const { form, initialForm } = this.state; 
        
        if( data ){
            let dataForm = {
                firstname: data.firstname || '',
                lastname: data.lastname || '',
                memberemail: data.memberemail || '',
                roles: data.roles || ''
            };
            return !isEqual(dataForm, form);
        }
        
        return !isEqual(initialForm, form);
    }

    reset(){
    	if(this.props.data){
    		return;
    	}
    	this.setState({
    		form: {
    			...this.state.initialForm
    		},
    		touched: []
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
	showSnackbar: ActionCreators.showSnackbar
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)
					  (withRouter(TeamMemberForm));