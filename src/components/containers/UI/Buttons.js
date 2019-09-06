import * as React from 'react';
import Button from '../../presentation/Button';

/**
 * component template
 */
let Buttons = ({ fn }) => (
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

export default Buttons;