import * as React from 'react';
import Chip from '../../presentation/Chip';
import Checkbox from '../../presentation/Checkbox';
import Select from '../../presentation/Select';
import Dropdown from '../../presentation/Dropdown';

/**
 * component template
 */
let Other = ({ fn }) => (
    <div className='spanned' style={{ maxHeight: '100%', overflow: 'auto' }}>

        <section className='spanned pv12 ph30'>
            <h1>Dropdowm</h1>
            <Dropdown options={['Option 1', 'Option 2', 'Option 3']} label='Hello World' variant='primary' />
        </section>

        <section className='spanned pv12 ph30'>
            <h1>Chips</h1>
            <Chip label='Just Me' className='mr20 mb15' value={0} />
            <Chip label='0 - 5' className='mr20 mb15' value={1} />
            <Chip label='6 - 20' className='mr20 mb15' value={2} />
            <Chip label='21 - 50' className='mr20 mb15' value={3} />
            <Chip label='51+' className='mr20 mb15' value={4} />
        </section>

        <section className='spanned pv12 ph30'>
            <h1>Checkboxes</h1>
            <Checkbox label='Just Me' className='mr20 mb15' value={0} />
            <Checkbox label='0 - 5' className='mr20 mb15' value={0} />
            <Checkbox label='6 - 20' className='mr20 mb15' value={0} />
            <Checkbox label='21 - 20' className='mr20 mb15' value={0} />
            <Checkbox label='21 - 50' className='mr20 mb15' value={0} />
            <Checkbox label='51+' className='mr20 mb15' value={0} />
        </section>

        <section className='spanned pv12 ph30'>
            <h1>Select</h1>
            <Select options={['Select gender', 'Male', 'Female']} classes={{ container: 'mr20 mb15' }} />
            <Select options={['Select gender', 'Male', 'Female']} variant='focused' classes={{ container: 'mr20 mb15' }} />
            <Select options={['Select gender', 'Male', 'Female']} variant='success' classes={{ container: 'mr20 mb15' }} />
            <Select options={['Select gender', 'Male', 'Female']} variant='warning' classes={{ container: 'mr20 mb15' }} />
            <Select options={['Select gender', 'Male', 'Female']} variant='danger' classes={{ container: 'mr20 mb15' }} />
        </section>

        <section className='spanned pv12 ph30'>
            <h1>Select</h1>
            <Select options={['Select gender', 'Male', 'Female']} classes={{ container: 'mr20 mb15' }} />
            <Select options={['Select gender', 'Male', 'Female']} variant='focused' classes={{ container: 'mr20 mb15' }} />
            <Select options={['Select gender', 'Male', 'Female']} variant='success' classes={{ container: 'mr20 mb15' }} />
            <Select options={['Select gender', 'Male', 'Female']} variant='warning' classes={{ container: 'mr20 mb15' }} />
            <Select options={['Select gender', 'Male', 'Female']} variant='danger' classes={{ container: 'mr20 mb15' }} />
        </section>

        <section className='spanned pv12 ph30'>
            <h1>Select Disabled</h1>
            <Select disabled options={['Select gender', 'Male', 'Female']} classes={{ container: 'mr20 mb15' }} />
            <Select disabled options={['Select gender', 'Male', 'Female']} variant='focused' classes={{ container: 'mr20 mb15' }} />
            <Select disabled options={['Select gender', 'Male', 'Female']} variant='success' classes={{ container: 'mr20 mb15' }} />
            <Select disabled options={['Select gender', 'Male', 'Female']} variant='warning' classes={{ container: 'mr20 mb15' }} />
            <Select disabled options={['Select gender', 'Male', 'Female']} variant='danger' classes={{ container: 'mr20 mb15' }} />
        </section>

        <section className='spanned pv12 ph30'>
            <h1>Select Link</h1>
            <Select options={['Select gender', 'Male', 'Female']} variant='link' classes={{ container: 'mr20 mb15' }} />
            <Select options={['Select gender', 'Male', 'Female']} variant='link-focused' classes={{ container: 'mr20 mb15' }} />
            <Select options={['Select gender', 'Male', 'Female']} variant='link-success' classes={{ container: 'mr20 mb15' }} />
            <Select options={['Select gender', 'Male', 'Female']} variant='link-warning' classes={{ container: 'mr20 mb15' }} />
            <Select options={['Select gender', 'Male', 'Female']} variant='link-danger' classes={{ container: 'mr20 mb15' }} />
        </section>

        <section className='spanned pv12 ph30'>
            <h1>Select Sizes</h1>
            <Select options={['Select gender', 'Male', 'Female']} size='sm' classes={{ container: 'mr20 mb15' }} />
            <Select options={['Select gender', 'Male', 'Female']} classes={{ container: 'mr20 mb15' }} />
            <Select options={['Select gender', 'Male', 'Female']} size='lg' classes={{ container: 'mr20 mb15' }} />
        </section>
    </div>
);

export default Other;