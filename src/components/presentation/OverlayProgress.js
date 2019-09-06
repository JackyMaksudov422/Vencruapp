import React from 'react';
import propTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';

export default class OverlayProgress extends React.Component {

    static propTypes = {
        color: propTypes.oneOf(['primary', 'secondary']),
        centered: propTypes.bool
    }

    static defaultTypes = {
        color: 'primary',
        centered: false
    }

    render() {
        const { color, centered } = this.props;
        return (
            <div className={`vc-overlay-loader ${centered ? 'centered' : ''}`}>
                <LinearProgress color={color || 'primary'} />
            </div>
        );
    }

    containerClasses() {
        const { className, checked } = this.props;
        let classes = `vc-chip ${checked ? ' checked' : ''}`;
        if (typeof className == 'string') {
            classes += ' ' + className
        }
        return classes;
    }

    passableProps(props) {
        let removable = ['className', 'size', 'label'];
        let propsCopy = Object.assign({}, props);
        for (var i = 0; i < removable.length; i++) {
            if (propsCopy.hasOwnProperty(removable[i])) {
                delete propsCopy[removable[i]];
            }
        }
        return propsCopy;
    }

    innerHandlechange(event) {
        if (this.props.onChange) {
            this.props.onChange(event);
        }
    }
}