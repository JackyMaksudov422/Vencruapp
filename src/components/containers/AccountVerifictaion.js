import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import { VERIFY_MAIL } from '../../configs/api.config';
import Request from '../../helpers/Request';
import axios from 'axios';
import Typography from '../presentation/Typography';
import Progress from '../presentation/Progress';
import Button from '../presentation/Button';
const CancelToken = axios.CancelToken;

/**
 * component template
 */
let Template = ({fn, isFetching, shouldReloadUserInfo, shouldRetryVerification}) => (
    <div className='spanned text-center pv100'>
        { isFetching && <Progress color={'primary'} /> }
        
        { !isFetching && shouldReloadUserInfo && 
            <React.Fragment>
                <Typography 
                    size='lg'
                >Failed to load, please try again.</Typography>
                <Button
                    size='sm'
                    variant='primary'
                    type='button'
                    className='mt20'
                    onClick={() => fn.getUserInfo()}
                >Try Again</Button>
            </React.Fragment>
        }
                
        { !isFetching && shouldRetryVerification && 
            <React.Fragment>
                <Typography 
                    size='lg'
                >Failed to verify your account, please try again.</Typography>
                <Button
                    size='sm'
                    variant='primary'
                    type='button'
                    className='mt20'
                    onClick={() => fn.getUserInfo()}
                >Try Again</Button>
            </React.Fragment>
        }

        { isFetching &&
            <Typography 
                size='lg'
            >Please wait a moment.</Typography>
        }
    
    </div>
);


class AccountVerification extends React.Component {
    state = {
        ready: false,
        missingValue: false,
        isFetching: false,
        failed: false
    };

    componentDidMount(){
        this.mounted = true;
        this.doSetup();
    }

    componentWillUnmount() {
        this.mounted = false;
        if(this.cancelHttp){
            this.cancelHttp();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(!prevState.missingValue && this.state.missingValue){
            this.props.showSnackbar('Action not allowed!!', {variant: 'error'});
            this.props.history.replace('/');
        }

        if(!prevProps.userInfo.data && this.props.userInfo.data){
            this.doSetup();
        }
    }

    render(){
        return <Template 
            {...this.prps()} 
            fn={this.fn()} 
        />;
    }

    fn = () => ({
        verifyAccount: () => this.verifyAccount(),
        getUserInfo: () => this.props.getUserInfo()
    });

    prps = () => ({
        isFetching: this.isFetching(),
        shouldReloadUserInfo: !this.props.userInfo.data && !this.props.userInfo.isFetching,
        shouldRetryVerification: this.state.failed && !this.state.isFetching
    });

    isFetching(){
        const { userInfo } = this.props;
        const { isFetching, ready } = this.state;

        if(userInfo.isFetching){
            return true;
        }

        if(isFetching){
            return true;
        }

        if(!ready){
            return true;
        }

        return false;
    }

    verifyAccount(){
        const { userInfo } = this.props;
        if(!userInfo.data && !userInfo.isFetching){
            this.props.getUserInfo();
        }

        if( userInfo && 
            userInfo.data && 
            (userInfo.data.emailconfirmed === 'True' || 
            userInfo.data.emailconfirmed === true)
        ){
            this.props.history.replace('/');
        }

        this.setState({
            isFetching: true,
            failed: false
        });

        VERIFY_MAIL({code: this.code}, {
            cancelToken: new CancelToken(c => this.cancelHttp = c)
        })
        .then(response => {
            console.log(response);
            if(this.mounted){
                this.setState({
                    isFetching: false
                }, () => {
                    this.props.getUserInfo();
                    this.props.history.replace('/');
                });
            }
        }).catch(error => {
            if(this.mounted){
                this.setState({
                    isFetching: false,
                    failed: true
                });
            }
        });
    }

    doSetup(){
        let {data, isFetching} = this.props.userInfo;
        if(!data){
            if(!isFetching){
                this.props.getUserInfo();
            }
            return;
        }
        if( data.emailconfirmed === 'True' || 
            data.emailconfirmed === true
        ){
            this.props.history.replace('/');
        }
        let req = new Request();        
        this.userId = req.get('userid', null);
        this.code = req.get('code', null);
        if(!this.code && !this.userId){
            this.setState({
                ready: true,
                missingValue: true
            });
            return;
        }
        this.setState({
            ready: true,
        }, () => this.verifyAccount());
    }

}

const mapStateToProps = ({userInfo}) => ({ 
    userInfo
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getUserInfo: ActionCreators.getUserInfo,
    showSnackbar: ActionCreators.showSnackbar
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountVerification));