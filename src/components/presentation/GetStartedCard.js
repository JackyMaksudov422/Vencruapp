import React from 'react';
import withRouter from 'react-router-dom/withRouter';
import PlainCard from './PlainCard';
import Typography from './Typography';
import Link from 'react-router-dom/Link';
const businessSetupIcon = require('../../assets/company_profile.png');
const brandingSetupIcon = require('../../assets/companylogo_icon.png');
const testInvoiceIcon = require('../../assets/first_invoice.png');

const GetStartedCard = ({userInfo, step}) => {
    userInfo = userInfo || {}
    return(
        <PlainCard className='get-started-card'>
            <Typography align='center' variant='active' className='title' size='lg'>
                Hey {`${userInfo.firstname || 'there'}`}, Welcome to your dashboard
            </Typography>
            {/* <Typography align='center' className='subtitle'>
                Let us help you get started, it'll only take a minute.
            </Typography> */}
            <div className='steps-container'>
                <div className='row'>
                    {/* business setup */}
                    <div className='col-sm-12 col-md-4'>
                        <div className='step-item'>
                            <img src={businessSetupIcon} alt='get-started-icon' className='step-image' />
                            <p className='step-title mb-8'>Setup Company Profile</p>
                            {/* <h6 className='step-description'>Your information is diplayed on invoices you send to clients</h6> */}
                            { step === 1 &&
                                <Link
                                    to='/settings'
                                    className='start-onboarding-btn vc-button vc-button-outline-primary step-link' 
                                    variant='outline-primary' 
                                    size='sm'
                                >
                                    I'm Ready
                                </Link>
                            }
                        </div>
                    </div>

                    {/* branding setup */}
                    <div className='col-sm-12 col-md-4'>
                        <div className='step-item'>
                            <img src={brandingSetupIcon} className='step-image' alt='icon' />
                            <h1 className='step-title mb-8'>Upload company logo</h1>
                            {/* <h6 className='step-description'>Create and send professional invoices. Your clients will be wowed.</h6> */}
                            {/* { step === 2 && */}
                                <Link
                                    to='settings/business'
                                    className='vc-button vc-button-primary step-link' 
                                    variant='outline-primary' 
                                    size='sm'
                                >
                                    Select Logo
                                </Link>
                            {/* } */}
                            <p className='mt-8 text-brand-blue font-bold'>Learn More</p>
                        </div>
                    </div>


                    {/* test invoice */}
                    <div className='col-sm-12 col-md-4'>
                        <div className='step-item'>
                            <img src={testInvoiceIcon} className='step-image' alt='icon' />
                            <p className='step-title mb-8'>Create your first invoice</p>
                            {/* <h6 className='step-description'>Quickly preview what your client sees by sending yourself a sample.</h6> */}
                            {/* { step === 3 && */}
                                <Link
                                    to='/sales/create-invoice'
                                    className='vc-button vc-button-primary step-link' 
                                    variant='outline-primary' 
                                    size='sm'
                                >
                                    Start Now
                                </Link>
                            {/* } */}
                            <p className='mt-8 text-brand-blue font-bold'>Learn More</p>
                        </div>
                    </div>

                </div>
            </div>
        </PlainCard>
    )
};

export default withRouter(GetStartedCard);