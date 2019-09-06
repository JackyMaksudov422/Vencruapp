import React from 'react';
import propTypes from 'prop-types';

export default class Checkbox extends React.Component {

    static propTypes = {
        checked: propTypes.bool,
        label: propTypes.string,
        value: propTypes.oneOfType([propTypes.string, propTypes.number, propTypes.bool]),
        square: propTypes.bool
    }

    static defaultProps = {
        size: 'md',
        square: false
    }

    render() {
        const {label} = this.props;
        return (
            <span 
                className={this.containerClasses()}
            >
                <input 
                    type='checkbox'
                    ref={ref => this.field = ref}
                    {...this.passableProps(this.props)}
                    onChange={event => this.innerHandlechange(event)}
                />
                <div className='checkbox-mark-container'>
                    <span className='checkbox-mark'>
                        <i className={`material-icons`}>check</i>
                    </span>
                </div>
                {label && <span className='checkbox-label'>{label}</span>}
            </span>
        );
    }

    containerClasses(){
        const { className, square } = this.props;
        let classes = `vc-checkbox`;
        if(typeof className == 'string'){
            classes += ' '+className;
        }
        if(square){
            classes += ' square';
        }
        return classes;
    }

    passableProps(props) {
        let removable = ['className', 'size', 'label', 'square'];
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