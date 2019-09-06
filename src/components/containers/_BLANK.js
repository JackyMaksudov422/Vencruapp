import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class BLANK extends React.Component {
    state = {

    };

    render(){
        return (
        	<div>
		        <h1>BLANK</h1>
		    </div>
        );
    }
}

const mapStateToProps = (state) => ({ 
    // states go here
});

export default connect(mapStateToProps)(withRouter(BLANK));