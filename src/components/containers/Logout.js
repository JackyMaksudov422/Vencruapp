import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Progress from '../presentation/Progress';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';

/**
 * component template
 */
let Template = ({fn}) => (
    <div className='spanned pv100'>
        <Progress color='primary'/>
    </div>
);

class Logout extends React.Component {
    state = {

    };

    componentDidMount(){
        setTimeout(() => this.props.logout(), 500);
    }

    componentDidUpdate(prevProps){
        if( prevProps.loggingOut.isFetching &&
            !this.props.loggingOut.isFetching &&
            this.props.loggingOut.failed){
                this.props.toggleSnackbar('Failed to log out.', {variant: 'error'});
                this.props.history.replace('/');
        }
    }

    render(){
        return <Template 
            {...this.prps()} 
            fn={this.fn()} 
        />;
    }

    fn = () => ({
        // bound functions go here
    })

    prps = () => ({
        
    })
}

const mapStateToProps = ({loggingOut}) => ({ 
    loggingOut
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    logout: ActionCreators.logout,
    toggleSnackbar: ActionCreators.toggleSnackbar
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Logout));