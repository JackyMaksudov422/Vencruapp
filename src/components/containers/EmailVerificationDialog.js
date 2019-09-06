import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import PageDialog from '../presentation/PageDialogs';
import { RESEND_ACTIVATION_MAIL } from '../../configs/api.config';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import Typography from '../presentation/Typography';
import OverlayProgress from '../presentation/OverlayProgress';
const CancelToken = axios.CancelToken;

/**
 * component template
 */
let Template = ({fn, email, isFetching}) => (
    <PageDialog 
        backdropClose={false}
        contentClassNames='h-full md:h-auto'
        escClose={false} 
        show={true}
        variant='primary'
        afterDismiss={() => fn.resetPageDialog(null)}
    >  
        <div className='email-verification-dialog'>
            <img 
                className='dialog-icon' 
                src={require('../../assets/envelope.png')}
                alt='icon'
            />
            <Typography size='lg' align='center' className='almost-there mb0'>You're almost there!</Typography>
            <Typography size='lg' align='center' className='mb60 mt0'>Verify your email to get started!</Typography>
            <Typography size="md" align='center' className='mb-20 md:mb-16 secure-section'>To keep your information secure, an email has been sent to <b>{email}</b></Typography>
            <Typography align='center' className='resend-section'>
                Didn't get the mail?&nbsp;
                <button 
                    onClick={() => fn.sendVerificationMail()}
                    className='resend-button'
                >
                    Resend Email
                </button>
            </Typography>
        </div>
        {isFetching && <OverlayProgress color='primary' />}
    </PageDialog>
);

class EmailVerificationDialog extends React.Component {
    state = {
        isFetching: false,
    };

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount(){
        this.mounted = false;
        if(this.cancelHttp){
            this.cancelHttp();
        }
    }

    render(){
        if(!this.props.email){
            return null;
        }
        return <Template 
            {...this.prps()} 
            fn={this.fn()} 
        />;
    }

    fn = () => ({
        // bound functions go here
        sendVerificationMail: () => this.sendVerificationMail(),
        resetPageDialog: () => this.props.togglePageDialog(null)
    })

    prps = () => ({
        // template props go here
        isFetching: this.state.isFetching,
        email: this.props.email,
    })

    sendVerificationMail(){
        this.setState({
            isFetching: true
        });
        RESEND_ACTIVATION_MAIL(this.props.email, {
            cancelToken: new CancelToken(c => this.cancelHttp = c)
        })
        .then(response => {
            if(this.mounted){
                this.props.showSnackbar('We\'ve sent a verification email', {variant: 'success'});
                this.setState({
                    isFetching: false
                });
            }
        })
        .catch(error => {
            this.props.showSnackbar(typeof error == 'string' && error || 'Failed to send, please try again.', {
                variant: 'error'
            });
            this.setState({
                isFetching: false
            });
            if(this.mounted){
            }
        })
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showSnackbar: ActionCreators.showSnackbar,
    togglePageDialog: ActionCreators.togglePageDialog
}, dispatch);

export default connect(null, mapDispatchToProps)(withRouter(EmailVerificationDialog));