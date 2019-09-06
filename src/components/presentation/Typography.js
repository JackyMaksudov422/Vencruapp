import React from 'react';
import propTypes from 'prop-types';

export default class Typography extends React.Component {

    static propTypes = {
        align: propTypes.oneOf([
            'left',
            'center',
            'right',
            'justify',
        ]),
        variant: propTypes.oneOf([
            'default',
            'active',
            'secondary',
            'success',
            'warning',
            'danger',
            'white',
            'black',
        ]),
        size: propTypes.oneOf(['xs', 'sm', 'md', 'lg'])
    }

    static defaultProps = {
        variant: 'default',
        size: 'md',
        align: 'left'
    }

    render() {
        const { variant, className, size, align } = this.props;
        return (
            <p
                ref={ref => this.element = ref}
                className={`${this.variantClassNames(variant)} ${this.sizeClassNames(size)} ${this.alignClassNames(align)} ${className || ''}`.trim()}
                {...this.passableProps(this.props)}
            >
                {this.componentChildren()}
            </p>
        )
    }

    componentChildren() {
        const { children } = this.props;
        return children;
    }

    variantClassNames(variant) {
        switch (variant) {
            case 'active':
            case 'success':
            case 'warning':
            case 'danger':
            case 'white':
            case 'black':
                return `typography typography-${variant}`;
            default:
                return 'typography';
        }
    }

    sizeClassNames(size) {
        switch (size) {
            case 'xs':
                return `typography-xsmall`;
            case 'sm':
                return `typography-small`;
            case 'lg':
                return `typography-large`;
            default:
                return '';
        }
    }

    alignClassNames(align) {
        switch (align) {
            case 'center':
                return `typography-center`;
            case 'right':
                return `typography-right`;
            case 'justify':
                return `typography-justify`;
            default:
                return '';
        }
    }

    passableProps(props) {
        let removable = ['variant', 'className', 'size', 'align'];
        let propsCopy = Object.assign({}, props);
        for (var i = 0; i < removable.length; i++) {
            if (propsCopy.hasOwnProperty(removable[i])) {
                delete propsCopy[removable[i]];
            }
        }
        return propsCopy;
    }
}