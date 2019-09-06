/**
 * here we load all our required libraries
 * for our app compoenent
 */
import './styles/style.scss';
import React from 'react';
import { connect } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './configs/mui-theme.config';
import Routes from './routing/routes';
import Main from './components/presentation/Main';
import { bindActionCreators } from 'redux';
import { ActionCreators } from './data/actionCreators';
import CustomSnackbar from './components/presentation/CustomSnackbar';
import AlertDialog from './components/presentation/AlertDialog';
import EmailVerificationDialog from './components/containers/EmailVerificationDialog';
import { PAGE_DIALOG } from './configs/data.config';
import BusinessSetupDialog from './components/containers/BusinessSetupDialog';
import BusinessSetupSuccessDialog from './components/containers/BusinessSetupSuccessDialog';
import Menubar from './components/presentation/Menubar';
import Appbar from './components/presentation/Appbar';
import find from 'lodash/find';

/**
 * here we have our application component's ui,
 * no side effect should occur here
 * this is used only for displaying UI
 */
let Template= ({fn, ready, email, dialogName, companyName}) => (
<React.Fragment>
    { ready && <Appbar blur={dialogName !== null && dialogName !== undefined}/> }
    { ready && <Menubar blur={dialogName !== null && dialogName !== undefined}/> }
    { ready && 
        <Main blur={dialogName !== null && dialogName !== undefined}>
            <Routes />
        </Main>
    }
    {/* account verification */}
    { dialogName == PAGE_DIALOG.EMAIL_VERIFICATION && 
        <EmailVerificationDialog email={email} />
    }
    {/* account verification */}
    { dialogName == PAGE_DIALOG.BUSINESS_SETUP_REQUEST && 
        <BusinessSetupDialog
            togglePageDialog={fn.togglePageDialog}
        />
    }
    {/* account verification */}
    { dialogName == PAGE_DIALOG.BUSINESS_SETUP_SUCCESS && 
        <BusinessSetupSuccessDialog  
            togglePageDialog={fn.togglePageDialog} 
            companyName={companyName}
        />
    }

    <CustomSnackbar />
    <AlertDialog />
</React.Fragment>
);

/**
 * Here we define our app component seperate from our template
 * this will allow us to easily sepearate the view from the logic
 */
class App extends React.Component {
    state = {
        ready: false
    };

    componentDidMount(){
        this.props.checkAuth();
        this.toggleAppFullHeight();
    }

    componentDidUpdate(prevProps){
        // check for when the chaeck auth is complete
        if( prevProps.checkingAuth.isFetching && 
            !this.props.checkingAuth.isFetching
        ){
            this.handleAfterCheckAuth();
        }

        // when the user logs in
        if( !prevProps.auth.isAuthenticated &&
            this.props.auth.isAuthenticated
        ){
            this.handleAfterAuthentication();
        }

        // when page full height is toggled on page
        if(prevProps.page.fullPage !== this.props.page.fullPage){
            this.toggleAppFullHeight();
        }
    }

    render(){
        return (<MuiThemeProvider theme={theme}>
            <Template 
                { ...this.prps() } 
                fn={this.fn()}
            />
        </MuiThemeProvider>);
    };

    fn = () => ({
        togglePageDialog: (dialogName) => this.props.togglePageDialog(dialogName)
    })

    prps = () => ({
        ready: this.state.ready,
        fullPage: this.props.page.fullPage,
        email: this.props.userInfo.data && this.props.userInfo.data.email,
        companyName: this.getCompanyName(),
        dialogName: this.getDialogName()
    })

    getDialogName() {
        const { userInfo } = this.props;
        switch (this.props.page.dialogName) {
            case PAGE_DIALOG.EMAIL_VERIFICATION:
                return userInfo &&
                    userInfo.data &&
                    userInfo.data.email &&
                    PAGE_DIALOG.EMAIL_VERIFICATION;
            case PAGE_DIALOG.BUSINESS_SETUP_REQUEST:
                return this.getCompanyName() &&
                    PAGE_DIALOG.BUSINESS_SETUP_REQUEST;
            case PAGE_DIALOG.BUSINESS_SETUP_SUCCESS:
                return PAGE_DIALOG.BUSINESS_SETUP_SUCCESS;
            default:
                return null;
        }
    }

    getCompanyName(){
        let { data } = this.props.userInfo;
        
        const business = data !== null && data.business ? data.business.find(item => item.id == data.currentbusinessid) : {}
                
        return business && business.companyname || `   `
    }

    handleAfterCheckAuth = () => {
        this.setState({
            ready: true
        }, 
        () => {
            if(this.props.auth.isAuthenticated){
                this.props.getUserInfo();
            }
        });
    }

    handleAfterAuthentication(){
        if(!this.props.userInfo.isFetching){
            this.props.getUserInfo();
        }
    }

    toggleAppFullHeight(){
        // select app container element
        let AppEl = document.getElementById('app');

        // stop if the element was not selected
        if(!AppEl || !AppEl.classList){
            return;
        }
        
        /**
         * If app is not set to full page and the full 
         * page class is found in the app element's
         * class list remove it
         */
        if(!this.props.page.fullPage){
            if(AppEl.classList.contains('full-page')){
                AppEl.classList.remove('full-page');
            }
        }

        /**
         * If app is set to full page and the full 
         * page class is not found in the app element's
         * class list add it
         */
        if(this.props.page.fullPage){
            if(!AppEl.classList.contains('full-page')){
                AppEl.classList.add('full-page');
            }
        }
    }
}

const mapStateToProps = ({
    checkingAuth,
    auth,
    userInfo,
    page
}) => ({
    checkingAuth,
    auth,
    userInfo,
    page
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    checkAuth: ActionCreators.checkAuth,
    getUserInfo: ActionCreators.getUserInfo,
    showSnackbar: ActionCreators.showSnackbar,
    showAlertDialog: ActionCreators.showAlertDialog,
    togglePageDialog: ActionCreators.togglePageDialog
}, dispatch);

/**
 * exporting the app as the defult component for this file.
 */
export default connect(mapStateToProps, mapDispatchToProps)(App);