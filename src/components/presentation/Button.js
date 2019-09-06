import React from 'react';
import propTypes from 'prop-types';
const googleBrans = require('../../assets/btn_google_light-01.png');

export default class Button extends React.Component {

    static propTypes = {
        variant: propTypes.oneOf([
            'primary',
            'secondary',
            'success',
            'warning',
            'danger',
            'gray',
            'inverse-primary',
            'inverse-secondary',
            'inverse-success',
            'inverse-warning',
            'inverse-danger',
            'inverse-gray',
            'outline-primary',
            'outline-secondary',
            'outline-success',
            'outline-warning',
            'outline-danger',
            'outline-gray',
            'link-primary',
            'link-secondary',
            'link-success',
            'link-warning',
            'link-danger',
            'link-gray',
            'google-signin'
        ]),
        size: propTypes.oneOf(['sm', 'md', 'lg']),
        icon: propTypes.element
    }

    static defaultProps = {
        variant: 'primary',
        size: 'md'
    }

    render() {
        const { variant, className, size } = this.props;
        return (
            <button
                ref={ref => this.field = ref}
                className={`${this.variantClassNames(variant)} ${this.sizeClassNames(size)} ${this.otherClassNames()} ${className || ''}`}
                {...this.passableProps(this.props)}
            >
                {this.componentChildren()}
            </button>
        )
    }

    componentChildren() {
        const { children, variant, label, icon } = this.props;
        if (variant == 'google-signin') {
            return (
                <span>
                    <img
                        src={googleBrans}
                        className='vc-button-brand'
                    />
                    <span className='vc-button-label'>{label || 'Sign in with Google'}</span>
                </span>
            )
        }
        if(icon){
            return (
                <span className='icon-button'>
                    <span>{children}</span>&nbsp;{icon}
                </span>
            )
        }
        return children;
    }

    variantClassNames(variant) {
        switch (variant) {
            case 'secondary':
            case 'success':
            case 'warning':
            case 'danger':
            case 'gray':
            case 'inverse-primary':
            case 'inverse-secondary':
            case 'inverse-success':
            case 'inverse-warning':
            case 'inverse-danger':
            case 'inverse-gray':
            case 'outline-primary':
            case 'outline-secondary':
            case 'outline-success':
            case 'outline-warning':
            case 'outline-danger':
            case 'outline-gray':
            case 'link-primary':
            case 'link-secondary':
            case 'link-success':
            case 'link-warning':
            case 'link-danger':
            case 'link-gray':
                return `vc-button vc-button-${variant}`;
            case 'google-signin':
                return `vc-button vc-button-google-signin`;
            default:
                return 'vc-button vc-button-primary';
        }
    }

    sizeClassNames(size) {
        switch (size) {
            case 'sm':
                return `vc-button-small`;
            case 'lg':
                return `vc-button-large`;
            default:
                return '';
        }
    }

    otherClassNames() {
        let classNames = '';
        if (this.props.block) {
            classNames += 'vc-button-block ';
        }
        if (this.props.full) {
            classNames += 'vc-button-full ';
        }
        return classNames;
    }

    passableProps(props) {
        let removable = ['variant', 'className', 'size', 'block', 'full'];
        let propsCopy = Object.assign({}, props);
        for (var i = 0; i < removable.length; i++) {
            if (propsCopy.hasOwnProperty(removable[i])) {
                delete propsCopy[removable[i]];
            }
        }
        return propsCopy;
    }
}