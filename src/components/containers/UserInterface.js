import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '../presentation/Button';

/**
 * here we have the styles for the root component
 * @param theme 
 */
const styles = theme => ({
    root: {
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    }
});


/**
 * component template
 */
let Template = ({ fn }) => (
    <div className='spanned' style={{maxHeight: '100%', overflow: 'auto'}}>

        <section className='spanned pv12 ph30'>
            <h1>Buttons</h1>
            <Button className='mb20'>Get Started Now</Button>
            <Button className='ml20 mb20' variant='secondary'>Get Started Now</Button>
            <Button className='ml20 mb20' variant='success'>Get Started Now</Button>
            <Button className='ml20 mb20' variant='warning'>Get Started Now</Button>
            <Button className='ml20 mb20' variant='danger'>Get Started Now</Button>
        </section>

        <section className='spanned pv12 ph30'>
            <h1>Buttons Disabled</h1>
            <Button disabled className='mb20'>Get Started Now</Button>
            <Button disabled className='ml20 mb20' variant='secondary'>Get Started Now</Button>
            <Button disabled className='ml20 mb20' variant='success'>Get Started Now</Button>
            <Button disabled className='ml20 mb20' variant='warning'>Get Started Now</Button>
            <Button disabled className='ml20 mb20' variant='danger'>Get Started Now</Button>
        </section>

        <section className='spanned pv12 ph30'>
            <h1>Buttons Inverse</h1>
            <Button className='mb20' variant='inverse-primary'>Get Started Now</Button>
            <Button className='ml20 mb20' variant='inverse-secondary'>Get Started Now</Button>
            <Button className='ml20 mb20' variant='inverse-success'>Get Started Now</Button>
            <Button className='ml20 mb20' variant='inverse-warning'>Get Started Now</Button>
            <Button className='ml20 mb20' variant='inverse-danger'>Get Started Now</Button>
        </section>

        <section className='spanned pv12 ph30'>
            <h1>Buttons Inverse Disabled</h1>
            <Button disabled className='mb20' variant='inverse-primary'>Get Started Now</Button>
            <Button disabled className='ml20 mb20' variant='inverse-secondary'>Get Started Now</Button>
            <Button disabled className='ml20 mb20' variant='inverse-success'>Get Started Now</Button>
            <Button disabled className='ml20 mb20' variant='inverse-warning'>Get Started Now</Button>
            <Button disabled className='ml20 mb20' variant='inverse-danger'>Get Started Now</Button>
        </section>

        <section className='spanned pv12 ph30'>
            <h1>Buttons Outline</h1>
            <Button className='mb20' variant='outline-primary'>Get Started Now</Button>
            <Button className='ml20 mb20' variant='outline-secondary'>Get Started Now</Button>
            <Button className='ml20 mb20' variant='outline-success'>Get Started Now</Button>
            <Button className='ml20 mb20' variant='outline-warning'>Get Started Now</Button>
            <Button className='ml20 mb20' variant='outline-danger'>Get Started Now</Button>
        </section>

        <section className='spanned pv12 ph30'>
            <h1>Buttons Outline</h1>
            <Button disabled className='mb20' variant='outline-primary'>Get Started Now</Button>
            <Button disabled className='ml20 mb20' variant='outline-secondary'>Get Started Now</Button>
            <Button disabled className='ml20 mb20' variant='outline-success'>Get Started Now</Button>
            <Button disabled className='ml20 mb20' variant='outline-warning'>Get Started Now</Button>
            <Button disabled className='ml20 mb20' variant='outline-danger'>Get Started Now</Button>
        </section>

        <section className='spanned pv12 ph30'>
            <h1>Buttons Sizes</h1>
            <Button className='mb20' size='sm'>Get Started Now</Button><br/>
            <Button className='mb20'>Get Started Now</Button><br/>
            <Button className='mb20' size='lg'>Get Started Now</Button><br/>
        </section>
    </div>
);

/**
 * create styles and bind toapp template
 */
Template = withStyles(styles)(Template);

class BLANK extends React.Component {
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

const mapStateToProps = (state) => ({
    // states go here
});

export default connect(mapStateToProps)(withRouter(BLANK));