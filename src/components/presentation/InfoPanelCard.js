import React from 'react';
import PlainCard  from './PlainCard';
import propTypes from 'prop-types';

export default class BusinessCard extends React.PureComponent{

    static propTypes = {
        personName: propTypes.string.isRequired,
        businessName: propTypes.string.isRequired,
        businessStreetAddress: propTypes.string.isRequired,
        businessCityName: propTypes.string.isRequired,
        businessCountryName: propTypes.string.isRequired,
        businessPhoneNumber: propTypes.string.isRequired,
        placeholder: propTypes.bool
    }

    render(){
        const { 
            personName, 
            businessName, 
            businessStreetAddress, 
            businessCityName, 
            businessCountryName, 
            businessPhoneNumber,
            placeholder
        } = this.props;
        return(
            <PlainCard className={`vc-business-card ${placeholder && 'placeholder' || ''}`}>
                <div className='vc-business-card-inner'>
                    <div className='info-section'>
                        <h2 className='person-name'>{personName}</h2>
                        <h4 className='business-name'>{businessName}</h4>
                        <p className='business-street-address'>{businessStreetAddress}</p>
                        <p className='business-city-name'>{businessCityName}</p>
                        <h5 className='business-country-name'>{businessCountryName}</h5>
                        <a href={`tel:${businessPhoneNumber}`} className='business-phone-number'>{businessPhoneNumber}</a>
                    </div>
                </div>
            </PlainCard>
        )
    }
}