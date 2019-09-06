import React from 'react';
import { connect } from 'react-redux';
import find from 'lodash/find';
const avatar = require('../../assets/avatar.jpg');

class AppbarUser extends React.Component {

    render() {
        const { userInfo } = this.props;
        return (
            <span 
                className='vc-appbar-user'
            >
                { userInfo && 
                    <div className='user-content'>
                        <div className='identity'>
                            <span>{`${userInfo.firstname || ''} ${userInfo.lastname || ''}`.trim()}</span>
                            <span>{`${userInfo.email || ''}`}</span>
                        </div>
                        <img className='avatar' src={userInfo.profileimageurl || avatar} />
                    </div>
                }

                { !userInfo && 
                    <span>Hi, there</span>
                }
            </span>
        )
    }
}

const mapStateToProps = ({userInfo}) => ({
    userInfo: userInfo.data
});


export default connect(mapStateToProps)(AppbarUser);