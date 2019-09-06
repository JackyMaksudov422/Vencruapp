import * as React from 'react';
import { withRouter } from 'react-router-dom';
import PageDialog from '../presentation/PageDialogs';
import Typography from '../presentation/Typography';
import Button from '../presentation/Button';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import { connect } from 'react-redux';
import logo from '../../assets/v-icon.png';

/**
 * component template
 */
let BusinessSetupSuccessDialog = ({ history, companyName, togglePageDialog }) => {
    if(typeof companyName !== 'string' || companyName.length < 1){
        return null;
    }
    return (
        <PageDialog
            show={true}
            afterDismiss={() => togglePageDialog(null)}
            contentClassNames='h-full md:h-auto'
        >
            <nav className="setup-success-nav navbar bg-white">
                <a className="navbar-brand" href="/">
                    <i className="material-icons">format_align_left</i>
                    <img src={logo} className="d-inline-block align-top" alt=""/>
                
                </a>
            </nav>
            <div className='business-setup-success-dialog my-8 xs:my-0 md:my-0'>
                <Typography
                    size='lg'
                    align='center'
                    variant='active'
                    className='heading mb60'
                >
                    <img 
                        src={require('../../assets/welcome-left.png')} 
                        className='heading-icon'
                        alt='icon'
                    />
                    <span className='heading-title'>
                        Welcome {companyName}
                    </span>
                    <img 
                        src={require('../../assets/welcome-right.png')} 
                        className='heading-icon'
                        alt='icon'
                    />
                </Typography>
    
                <Typography
                    align='center'
                    className='sub-heading mb-4'
                    variant='active'
                >
                    Your account is ready
                </Typography>
    
                <Typography
                    align='center'
                    className='message mb60'
                >
                    Welcome, {companyName}! You're ready to start sending <span>invoices</span>,&nbsp; 
                    logging <span>expenses</span>, managing <span>clients</span> and publishing awesome&nbsp;
                    <span>campaigns</span>. Enjoy!
                </Typography>
    
                <Button
                    variant='success'
                    className='setup-button'
                    onClick={() => { history.replace('/'); togglePageDialog(null); }}
                >
                    Enter Dashboard
                </Button>
            </div>
        </PageDialog>
    );
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    togglePageDialog: ActionCreators.togglePageDialog
}, dispatch);

export default connect(null, mapDispatchToProps)(withRouter(BusinessSetupSuccessDialog));