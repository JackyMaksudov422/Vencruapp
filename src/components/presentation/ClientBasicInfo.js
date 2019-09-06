import React from 'react';
import propTypes from 'prop-types';

export default class ClientBasicInfo extends React.Component {
    static propTypes = {
        name: propTypes.string.isRequired,
        email: propTypes.string.isRequired
    }

    render() {
        return (
            <div className='vc-client-basic-info'>
                <span className='client-first-letters d-none d-md-flex'>
                    {this.getFirstLetters(this.props.name)}
                </span>
                <div className='client-info'>
                    <h4 className='client-name'>{this.props.name}</h4>
                    <h6 className='client-email'>{this.props.email}</h6>
                </div>
            </div>
        );
    }

    getFirstLetters(name) {
        let names = name.split(' ');
        if (names.length < 2) {
            return names[0].substr(0, 2);
        }
        return `${names[0].substr(0, 1)}${names[(names.length - 1)].substr(0, 1)}`;
    }
}