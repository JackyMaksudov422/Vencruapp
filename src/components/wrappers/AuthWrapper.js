import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class AuthWrapper extends React.Component {
    
    static propTypes = {
        returnable: propTypes.bool
    };

    static defaultProps = {
        returnable: false
    };

    componentDidMount() {
        this.leave();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.auth.isAuthenticated && !this.props.auth.isAuthenticated){
            this.leave(true);
        }
    }
    
    render() {
        return this.props.children || null;
    }
    
    leave(loggedOut){
        const {auth, history, returnable} = this.props;
        var next = '/login';
        if(returnable && !loggedOut){
            next += '?next='+encodeURIComponent(window.location.pathname+window.location.search);
        }
        if(!auth.isAuthenticated){
            history.replace(next);
        }
    }
}

const mapStateToProps = ({auth}) => {
    return { auth }
}

export default connect(mapStateToProps)(withRouter(AuthWrapper));