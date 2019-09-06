import React from 'react';
import propTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Request from '../../helpers/Request';

class GuestWrapper extends React.Component {

    static propTypes = {
        redirectTo: propTypes.string,
        noRedirect: propTypes.bool
    };

    static defaultProps = {
        noRedirect: false,
        redirectTo: '/'
    };

    componentDidMount() {
        this.leave(true);
    }
    
    componentDidUpdate(prevProps) {
        this.leave();
    }

    render() {
        return this.props.children || null;
    }

    leave(force) {
        const { auth, history, redirectTo, noRedirect } = this.props;
        force = force ? true : false;

        // stop if no redirect is enabled
        if(noRedirect && !force){
            return;
        }

        var request = new Request();
        var next = request.get('next', null) || redirectTo;
        next = decodeURIComponent(next);

        if (auth.isAuthenticated) {
            history.replace(next);
        }
    }
}

const mapStateToProps = ({ auth }) => {
    return { auth }
}

export default connect(mapStateToProps)(withRouter(GuestWrapper));