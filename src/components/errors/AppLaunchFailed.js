import * as React from 'react';
import { withRouter } from 'react-router-dom';
import Button from '../presentation/Button';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../data/actionCreators';

class AppLaunchFailed extends React.Component {
    render() {
        return (
            <div className='vc-error-page app-launch-failed'>
                <div className='vc-error-page-content'>
                    <h1 className='title'>Whoops!! This ship failed to launch.</h1>
                    <p className='message'>Please click on the button below to try again.</p>
                    <div className='actions-container'>
                        <Button
                            onClick={() => this.props.getUserInfo()}
                            className='action'
                            size='sm'
                        >Try Again</Button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getUserInfo: ActionCreators.getUserInfo
}, dispatch);

export default connect(null, mapDispatchToProps)(withRouter(AppLaunchFailed));