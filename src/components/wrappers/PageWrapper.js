import React from 'react';
import propTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from "../../data/actionCreators";
import { withRouter } from 'react-router-dom';
import { PAGE_DIALOG } from '../../configs/data.config';
import isEqual from 'lodash/isEqual';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import AppLaunchFailed from '../errors/AppLaunchFailed';

class PageWrapper extends React.Component {
    static propTypes = {
        menu: propTypes.string,
        submenu: propTypes.string,
        noAppbar: propTypes.bool,
        noMenubar: propTypes.bool,
        fullPage: propTypes.bool,
        requiresEmailConfirmed: propTypes.bool,
    }

    static defaultProps = {
        noAppbar: false,
        noMenubar: false,
        fullPage: false,
        requiresEmailConfirmed: false,
    }

    componentDidMount() {

        // wait and fetch user info
        setTimeout(() => {
            if( this.props.auth.isAuthenticated &&
                !this.props.userInfo.data &&
                !this.props.userInfo.isFetching
            ){
                this.props.getUserInfo();
            }
        }, 2000);

        this.toggleAppbar();
        this.toggleMenubar();
        this.toggleFullPage();
        this.setMenus();
        this.handleEmailConfirmed();
        this.handleSetupSuccess();
    }

    componentDidUpdate(prevProps, prevState){
        if(!isEqual(prevProps.userInfo.data, this.props.userInfo.data)){
            this.handleEmailConfirmed();
        }
    }

    componentWillUnmount() {
        this.unsetMenus();
        this.props.togglePageDialog(null);
    }

    render() {

        // launch in progress
        if( this.props.userInfo.isFetching && !
            this.props.userInfo.data){
            return (
                <div className='vc-page-loader'>
                    <CircularProgress color='primary' size={50}/>
                </div>
            )
        }

        // app failed to launch
        if( this.props.auth.isAuthenticated &&
            !this.props.userInfo.isFetching && 
            !this.props.userInfo.data && 
            this.props.userInfo.failed
        ){
            return <AppLaunchFailed />
        }

        // load page
        return this.props.children;
    }

    toggleAppbar() {
        const { noAppbar, appbar, hideAppbar, showAppbar } = this.props;
        if (appbar.visible && noAppbar) {
            hideAppbar();
            return;
        }

        if (!appbar.visible && !noAppbar) {
            showAppbar();
            return;
        }
    }

    toggleMenubar() {
        const { noMenubar, menubar, showMenubar, hideMenubar } = this.props;
        if (noMenubar && menubar.visible) {
            hideMenubar();
            return;
        }

        if (!noMenubar && !menubar.visible) {
            showMenubar();
            return;
        }
    }

    toggleFullPage() {
        const { fullPage, page, toggleFullPage } = this.props;
        if (!fullPage && page.fullPage) {
            toggleFullPage(false);
            return;
        }

        if (fullPage && !page.fullPage) {
            toggleFullPage(true);
            return;
        }
    }

    handleEmailConfirmed() {
        const { 
            page, 
            userInfo, 
            requiresEmailConfirmed, 
            history, 
            togglePageDialog, 
            auth 
        } = this.props;
        if(userInfo.isFetching || !auth.isAuthenticated){
            return;
        }
        // check if email confirm is enabled
        if (requiresEmailConfirmed) {
            // check if user data is available
            if(userInfo.data){
                // check if not at dashboard page
                if(
                    userInfo.data.emailconfirmed === 'False' || 
                    !userInfo.data.emailconfirmed
                ){
                    if(page.dialogName !== PAGE_DIALOG.EMAIL_VERIFICATION){
                        togglePageDialog(PAGE_DIALOG.EMAIL_VERIFICATION);
                    }
                    // go to home page
                    history.push('/');
                    return;
                }
            }
        }
    }

    handleSetupSuccess(){
        const {location, togglePageDialog, match, auth} = this.props;
        if( location && 
            location.state &&
            location.state.onboardingComplete &&
            match &&
            match.path === '/' &&
            auth.isAuthenticated
        ){
            togglePageDialog(PAGE_DIALOG.BUSINESS_SETUP_SUCCESS);
        }
    }

    setMenus() {
        if (this.props.menu) {
            this.props.setMenu(this.props.menu);
        }
        if (this.props.submenu) {
            this.props.setSubmenu(this.props.submenu);
        }
    }

    unsetMenus() {
        if (this.props.menu) {
            this.props.setMenu(null);
        }
        if (this.props.submenu) {
            this.props.setSubmenu(null);
        }
    }
}

const mapStateToProps = ({
    appbar,
    menubar,
    page,
    userInfo,
    auth
}) => ({
    appbar,
    menubar,
    page,
    userInfo,
    auth
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setMenu: ActionCreators.setMenu,
        setSubmenu: ActionCreators.setSubmenu,
        hideMenubar: ActionCreators.hideMenubar,
        showMenubar: ActionCreators.showMenubar,
        showAppbar: ActionCreators.showAppbar,
        hideAppbar: ActionCreators.hideAppbar,
        toggleFullPage: ActionCreators.toggleFullPage,
        togglePageDialog: ActionCreators.togglePageDialog,
        getUserInfo: ActionCreators.getUserInfo
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PageWrapper));