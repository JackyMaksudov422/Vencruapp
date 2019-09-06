import React from 'react';
import propTypes from 'prop-types';

export default class Chip extends React.Component {

    static propTypes = {
        checked: propTypes.bool,
        label: propTypes.string.isRequired,
        value: propTypes.oneOfType([propTypes.string, propTypes.number])
    }

    render() {
        const {label} = this.props;
        return (
            <span 
                className={this.containerClasses()}
            >
                <input type='checkbox'
                    ref={ref => this.field = ref}
                    {...this.passableProps(this.props)}
                    onChange={(event) => this.innerHandlechange(event)}
                />
                <div className='chip-material'>
                    <span className='chip-label'>{ label }</span>
                </div>
            </span>
        );
    }

    containerClasses(){
        const { className, checked, size } = this.props;
        let classes = `vc-chip ${checked ? ' checked' : ''}`;
        if(typeof className == 'string'){
            classes += ' '+className
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

    innerHandlechange(event){
        if(this.props.onChange){
            this.props.onChange(event);
        }
    }
}