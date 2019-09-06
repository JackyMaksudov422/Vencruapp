import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import Request from '../../helpers/Request';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Typography from '../presentation/Typography';
import Progress from '../presentation/Progress';
import OnboardingBusinessCard from './OnboardingBusinessCard';
import OnboardingIndustry from './OnboardingIndustry';
import OnboardingAboutBusiness from './OnboardingAboutBusiness';
import Button from '../presentation/Button';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import logo from '../../assets/v-icon.png';
import Dropdown from '../presentation/Dropdown';


let Template = ({
    fn, 
    next,
    ready,
    loading,
    activeStep, 
    stepFormIsValid
}) => (
    <div className='onboarding-component'>
        <nav className="navbar bg-white">
            <a className="navbar-brand" href="/">
                <i className="material-icons">format_align_left</i>
                <img src={logo} className="d-inline-block align-top" alt=""/>
                
            </a>
        </nav>
        <div className='onboarding-background'>
            <div className='left'></div>
            <div className='right'></div>
        </div>
        <div className='content'>
            <div className='content-inner'>
                <div className='content-main'>
                    <div className='content-main-inner'>
                        <OnboardingBusinessCard
                            setRef={ref => fn.setStepRef('1', ref)}
                            onSubmit={(data) => fn.handleStepSubmit(1, data)}
                            active={activeStep == 1}
                            initialData={fn.getSectionData(1)}
                            onValidityChange={() => fn.checkCurrentStepValidity()}
                        />
                        <OnboardingIndustry
                            setRef={ref => fn.setStepRef('2', ref)}
                            onSubmit={(data) => fn.handleStepSubmit(2, data)}
                            active={activeStep == 2}
                            onValidityChange={() => fn.checkCurrentStepValidity()}
                            initialData={fn.getSectionData(2)}
                        />
                        <OnboardingAboutBusiness
                            setRef={ref => fn.setStepRef('3', ref)}
                            onSubmit={(data) => fn.handleStepSubmit(3, data)}
                            active={activeStep == 3}
                            initialData={fn.getSectionData(3)}
                            onValidityChange={() => fn.checkCurrentStepValidity()}
                        />
                    </div>
                    { activeStep > 0 && activeStep < 4 &&     
                        
                        <div className='footer'>
                            <div className="row">
                            {/* back button */}
                            { activeStep > 1 &&
                                
                                <Button
                                    variant='link-primary'
                                    className='onboarding-nav back col-5'
                                    size='sm'
                                    onClick={() => fn.handleNavClick('back')}
                                >
                                    <div className='prev-btn-div'><i className='material-icons'>arrow_back_ios</i>Previous Step</div>
                                </Button>
                            }
                            {/* continue button */}
                            <Button 
                                // disabled={!stepFormIsValid}
                                variant='primary' 
                                className='onboarding-nav col-6' 
                                size='sm'
                                onClick={() => fn.handleNavClick('continue')}
                            >Continue</Button>
                            <div className="col-1"></div>
                            </div>
                        </div>
                    }
                    { loading && 
                        <div className='loading-overlay'>
                                <LinearProgress color='secondary' />
                        </div>
                    }
                </div>
            </div>
            <div className='right-pane'>
                <div className='right-header header mb-12'>
                    <img src={require('../../assets/portfolio.png')} alt=""/>
                    <Typography variant='white' className='title'>Setup your business</Typography>
                </div>
                <ul className='steps-list'>
                    { activeStep > 0 && activeStep < 4 &&
                        <React.Fragment>
                            {/* create business card */}
                            <li className={`step-item${activeStep == 1 ? ' active' : ''} mb-12`}>
                                <span className='step-number-container'>1</span>
                                <span className='step-label'>Create your Business Card</span>
                            </li>

                            {/* select industry */}
                            <li className={`step-item${activeStep == 2 ? ' active' : ''} mb-12`}>
                                <span className='step-number-container'>2</span>
                                <span className='step-label'>About Your Industry</span>
                            </li>

                            {/* about business */}
                            <li className={`step-item${activeStep == 3 ? ' active' : ''}`}>
                                <span className='step-number-container'>3</span>
                                <span className='step-label'>About your business</span>
                            </li>
                        </React.Fragment>

                    }
                </ul>
                <div className='justify-center ml-auto mr-auto mt-18'>
                    <p className='text-base'>Need a helping hand?</p>
                    <p>mail us at <span className='text-white'>hello@vencru.com</span> or</p>
                    <p>WhatsApp us at <span className='text-white'>+23481 818 63898</span></p>
                </div>
            </div>
        </div>
    </div>  
);

class Onboarding extends React.Component {
    state = {
        validation: {
            valid: false,
            fields: null
        },
        focused: [],
        touched: [],
        activeStep: 0,
        ready: false,
        onboardingData: {},
        stepFormIsValid: false
    };

    constructor(){
        super();
        let request = new Request();
        this.next = request.get('next', '/');

        // bind methods
        this.handleStepSubmit = this.handleStepSubmit.bind(this);
        this.setStepRef = this.setStepRef.bind(this);
        this.getSectionData = this.getSectionData.bind(this);
        this.handleNavClick = this.handleNavClick.bind(this);
        this.checkCurrentStepValidity = this.checkCurrentStepValidity.bind(this);
    }

    componentDidUpdate(prevProps, prevState){
        if( prevProps.userInfo.isFetching && 
            !this.props.userInfo.isFetching
        ){
            this.afterGetUserInfo();
        }

        if( prevProps.onboarding.isFetching &&
            !this.props.onboarding.isFetching
        ){
            this.handleDoOnboardingComplete();
        }

        if( prevState.activeStep != this.state.activeStep ){
            this.handleOnStepChange();
        }

        if(!isEqual(prevProps.userInfo.data, this.props.userInfo.data)){
            this.setInitialStep();
        }
    }

    componentDidMount(){
        this.shouldGetUserInfo();
        // this.setInitialStep();
    }

    render() {
        if(this.state.activeStep == 0 && !this.state.ready){
            return <Progress color='primary' />;
        }
        return <Template 
                    {...this.prps()} 
                    fn={this.fn()}
                />
    }

    prps = () => ({
        activeStep  : this.state.activeStep,
        userInfo    : this.props.userInfo,
        loading     : this.loading(),
        ready       : this.state.ready,
        next        : this.next,
        routeMatch  : this.props.match,
        canShowWaiting: (!this.props.userInfo && !this.props.userInfo.data),
        stepFormIsValid: this.state.stepFormIsValid
    })

    fn = () => ({
        handleStepSubmit        : this.handleStepSubmit,
        setStepRef              : this.setStepRef,
        getSectionData          : this.getSectionData,
        handleNavClick          : this.handleNavClick,
        checkCurrentStepValidity: this.checkCurrentStepValidity
    })

    loading = () => {
        const { ready } = this.state;
        const { onboarding, userInfo } = this.props;
        return !ready || onboarding.isFetching || userInfo.isFetching;
    }

    shouldGetUserInfo = () => {
        const { userInfo, getUserInfo } = this.props;

        if(!userInfo.isFetching){
            getUserInfo();
            return;
        }

        this.setInitialStep();
    }

    afterGetUserInfo(){
        const { userInfo } = this.props;
        if(userInfo.data){
            this.setInitialStep();
        }
    }

    handleSubmit = () => {
        this.props.doOnboarding({
            firstname: this.state.onboardingData.firstname,
            lastname: this.state.onboardingData.lastname,
            phonenumber: this.state.onboardingData.phonenumber,
            companyname: this.state.onboardingData.companyname,
            isincorporated: this.state.onboardingData.isincorporated,
            address: this.state.onboardingData.address,
            industry: this.state.onboardingData.industry,
            employeesize: this.state.onboardingData.employeesize,
            currency: this.state.onboardingData.currency,
            onlinepayment: this.state.onboardingData.onlinepayment,
        });
    }

    handleDoOnboardingComplete(){
        if(!this.props.onboarding.failed){
            this.props.getUserInfo();
            this.setState({ activeStep: 4 });
            this.props.history.replace('/', {onboardingComplete: true});
            return;
        }
        let message = this.props.onboarding.message || 'An error occured, please try again in a moment.';
        this.props.showSnackbar(message, { variant: 'error' });
    }

    setInitialStep(){
        const { data } = this.props.userInfo;
        const { Business } = data || {};

        if(!data){
            return;
        }

        if(this.getCurrentStep() == 4){
            this.props.history.replace('/');
            return;
        }

        this.setState({
            activeStep: this.getCurrentStep(),
            business: find(Business, {iscurrentbusiness: true}),
            ready: true
        });
    }

    getCurrentStep(){
        const { data, currentBusiness } = this.props.userInfo;
        const { Business } = data || {};
        let field;
        let fieldsList;
        let business
        let requiredFields = [
            {
                fields: ['firstname', 'lastname', 'companyname', 'phonenumber', 'address', 'isincorporated'],
                step: 1
            },
            {
                step: 2,
                fields:['industry']
            },
            {
                fields: ['Employeesize', 'currency', 'onlinePayment'],
                step: 3
            },
        ];

        if(!currentBusiness){
            return 1;
        }

        // if(!business.isowner){
        //     this.props.history.replace('/');
        //     return null;
        // }

        for(var i = 0; i < requiredFields.length; i++){
            fieldsList = requiredFields[i]['fields'];
            for(var j = 0; j < fieldsList.length; j++){
                field = fieldsList[j];
                if(currentBusiness[field] === null){
                    return requiredFields[i]['step'];
                }
                if( typeof currentBusiness[field] == 'string' &&
                    currentBusiness[field].trim().length < 1
                ){
                    return requiredFields[i]['step'];
                }
            }
        }

        return 4;
    }

    setStepRef(step, ref){
        this[step] = ref;
    }

    getSectionData(step){
        const { currentBusiness, userInfo } = this.props;
        let stepData = {};
        let fields = [];

        let steps = {
            1: ['firstname', 'lastname', 'companyname', 'phonenumber', 'address','isincorporated'],
            2: ['industry'],
            3: ['employeesize', 'currency', 'onlinepayment']
        };
        
        if(!currentBusiness){
            return {};
        }

        fields = steps[step];

        for(var i = 0; i < fields.length; i++){
            stepData[fields[i]] = currentBusiness[fields[i]] || null;
        }

        if(step == 1){
        	stepData['firstname'] = userInfo.data.firstname;
        	stepData['lastname'] = userInfo.data.lastname;
        }

        return stepData;
    }

    handleNavClick(type){
        let stepRef = this[this.state.activeStep];
        switch(type){
            case'continue':
                if(stepRef){
                    stepRef.submit();
                }
            break;
            case'back':
                    this.setState({
                        activeStep: (this.state.activeStep - 1) < 1 ? 1 : (this.state.activeStep - 1)
                    }); 
                break;
        }
    }

    handleStepSubmit(step, data){
        let nextStep = typeof step == 'number' ? step + 1 : 1;
        if(nextStep > 3){
            nextStep = 3;
        }
        this.setState({
            onboardingData: Object.assign({}, this.state.onboardingData, data),
            activeStep: nextStep,
        }, () => {
            if(this.state.activeStep == 3 && nextStep == step){
                this.handleSubmit();
            }
        });
    }

    handleOnStepChange(){
        this.checkCurrentStepValidity();
    }

    checkCurrentStepValidity(){
        const {activeStep} = this.state;
        let stepRef = this[activeStep];
        if(stepRef){
            if(stepRef.isValid() != this.state.stepFormIsValid){
                this.setState({
                    stepFormIsValid: stepRef.isValid()
                });
            }
        }
    }
}

const mapStateToProps = ({ onboarding, signup, userInfo }) => {
    return { 
    	onboarding,
    	signup,
    	userInfo,
    	currentBusiness: userInfo && 
    		userInfo.data &&
    		userInfo.data.business &&
    		userInfo.data.business.constructor == Array &&
    		userInfo.data
    			.business
    			.find(item => item.id == userInfo.data.currentbusinessid)
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        doOnboarding: ActionCreators.doOnboarding,
        getUserInfo: ActionCreators.getUserInfo,
        showSnackbar: ActionCreators.showSnackbar
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Onboarding));