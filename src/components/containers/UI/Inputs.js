import * as React from 'react';
import Input from '../../presentation/Input';

/**
 * component template
 */
let Inputs = ({ fn }) => (
    <div className='spanned' style={{ maxHeight: '100%', overflow: 'auto' }}>

        <section className='spanned pv12 ph30'>
            <h1>Inputs</h1>
            <div className='mb15 spanned'><Input type='text' placeholder='First Name' /></div>
            <div className='mb15 spanned'><Input type='text' placeholder='First Name' variant='focused' /></div>
            <div className='mb15 spanned'><Input type='text' placeholder='First Name' variant='success' /></div>
            <div className='mb15 spanned'><Input type='text' placeholder='First Name' variant='warning' /></div>
            <div className='mb15 spanned'><Input type='text' placeholder='First Name' variant='danger' /></div>
        </section>

        <section className='spanned pv12 ph30'>
            <h1>Inputs Disabled</h1>
            <div className='mb15 spanned'><Input disabled type='text' placeholder='First Name' /></div>
            <div className='mb15 spanned'><Input disabled type='text' placeholder='First Name' variant='focused' /></div>
            <div className='mb15 spanned'><Input disabled type='text' placeholder='First Name' variant='success' /></div>
            <div className='mb15 spanned'><Input disabled type='text' placeholder='First Name' variant='warning' /></div>
            <div className='mb15 spanned'><Input disabled type='text' placeholder='First Name' variant='danger' /></div>
        </section>

        <section className='spanned pv12 ph30'>
            <h1>Inputs Labeled</h1>
            <div className='mb15 spanned'><Input label='First Name' type='text' /></div>
            <div className='mb15 spanned'><Input label='First Name' type='text' variant='focused' /></div>
            <div className='mb15 spanned'><Input label='First Name' type='text' variant='success' /></div>
            <div className='mb15 spanned'><Input label='First Name' type='text' variant='warning' /></div>
            <div className='mb15 spanned'><Input label='First Name' type='text' variant='danger' /></div>
        </section>

        <section className='spanned pv12 ph30'>
            <h1>Input Sizes</h1>
            <div className='mb15 spanned'>
                <Input size='sm' type='text' placeholder='First Name' />
            </div>
            <div className='mb15 spanned'>
                <Input size='md' type='text' placeholder='First Name' />
            </div>
            <div className='mb15 spanned'>
                <Input size='lg' type='text' placeholder='First Name' />
            </div>
        </section>

        <section className='spanned pv12 ph30'>
            <h1>Input Variant Sizes</h1>
            <div className='mb15 spanned'>
                <Input size='sm' type='text' variant='success' placeholder='First Name' />
            </div>
            <div className='mb15 spanned'>
                <Input size='md' type='text' variant='success' placeholder='First Name' />
            </div>
            <div className='mb15 spanned'>
                <Input size='lg' type='text' variant='success' placeholder='First Name' />
            </div>
        </section>

        <section className='spanned pv12 ph30'>
            <h1>Inputs Multilined</h1>
            <div className='mb15 spanned'>
                <Input multiline rows='4' type='text' placeholder='First Name' />
            </div>
            <div className='mb15 spanned'>
                <Input multiline rows='4' type='text' placeholder='First Name' variant='focused' />
            </div>
            <div className='mb15 spanned'>
                <Input multiline rows='4' type='text' placeholder='First Name' variant='success' />
            </div>
            <div className='mb15 spanned'>
                <Input multiline rows='4' type='text' placeholder='First Name' variant='warning' />
            </div>
            <div className='mb15 spanned'>
                <Input multiline rows='4' type='text' placeholder='First Name' variant='danger' />
            </div>
        </section>

    </div>
);

export default Inputs;