import * as React from 'react';
import { withRouter, Route } from 'react-router-dom';
import FeedbackHome from './FeedbackHome';
import FeedbackModal from './FeedbackModal';

/**
 * component template
 */
let Template = ({ fn, onSubmit }) => (
    <div className='app-authenticated-body'>
        <Route path='/feedback' component={FeedbackHome} />
        <Route path='/feedback/create' component={FeedbackModal} />
    </div>
);

class Feedback extends React.Component {
    state = {

    };

    render() {
        return <Template
            {...this.prps()}
            fn={this.fn()}
        />;
    }

    fn = () => ({
        // bound functions go here
    })

    prps = () => ({
        // template props go here
    })
}

export default withRouter(Feedback);