import * as React from 'react';
import propTypes from 'prop-types';
import Progress from '@material-ui/core/LinearProgress/LinearProgress';
import OverlayProgress from './OverlayProgress';
const PROGRESS_VARIANTS = ['primary', 'secondary']

/**
 * component template
 */
let Template = ({ fn, children, pageTitle, progress }) => (
    <div className='auth-page'>
        <div className='auth-page-content'>
            <div className='auth-page-content-main'>
                <div className='auth-page-heading'>
                    <div className='auth-page-logo-container'>
                        <img src={require('../../assets/logo.png')} className='logo' />
                    </div>
                    {typeof pageTitle == 'string' && pageTitle.length > 0 &&
                        <h1 className='auth-page-title'>{pageTitle}</h1>
                    }
                </div>
                <div className='auth-page-body'>
                    {children}
                </div>
                {typeof progress == 'string' && PROGRESS_VARIANTS.indexOf(progress) != -1 &&
                    <OverlayProgress color={progress || 'primary'} />
                }
            </div>
        </div>
    </div>
);

class AuthPages extends React.Component {
    static propTypes = {
        pageTitle: propTypes.string
    }

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
        children: this.props.children,
        pageTitle: this.props.pageTitle || undefined,
        progress: this.props.progress,
    })
}


export default AuthPages;