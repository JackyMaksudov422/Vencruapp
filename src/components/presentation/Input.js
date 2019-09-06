import React from 'react';
import propTypes from 'prop-types';
import PhoneInput from 'react-phone-number-input';
import Flatpickr from 'react-flatpickr';

export default class Input extends React.Component {

    static propTypes = {
        variant: propTypes.oneOf([
            'default',
            'focused',
            'success',
            'warning',
            'danger',
        ]),        
        label: propTypes.string,
        size: propTypes.oneOf(['sm', 'md', 'lg']),
        passwordToggle: propTypes.bool,
        error: propTypes.oneOf([null, propTypes.string]),
        multiline: propTypes.bool,
        noIcon: propTypes.bool
    }

    static defaultProps = {
        variant: 'default',
        size: 'md',
        passwordToggle: false,
        error: null,
        multiline: false,
        noIcon: false
    }

    state = {
        focused: false
    }

    render() {
        const {
        	type, 
        	variant, 
            label,             
        	multiline, 
        	passwordToggle, 
        	component,
            prepend,
            id,
            placeholder
        } = this.props;

        if(type === 'phone'){
        	return (
        		<div 
	                className={this.containerClassNames(variant)}
	                title={typeof label == 'string' && label.length > 0 ? label : ''}
	            >
	                { typeof label == 'string' && label.length > 0 && this.renderLabel(label) }

	                { prepend && 
	                	<span className='prepended-content'> {prepend} </span>
	                }

                    <PhoneInput 
                        ref = {ref => this.field = ref}
                        type={this.inputType()}
                        {...this.passableProps(this.props)}
                        onFocus={event => this.innerHandleFocus(event)}
                        onBlur={event => this.innerHandleBlur(event)}
                    />

	                { this.renderStatusIcon() }
	            </div>
        	);
        }

        if(type === 'date'){
        	return (
        		<div 
	                className={this.containerClassNames(variant)}
	                title={typeof label == 'string' && label.length > 0 ? label : ''}
	            >
	                { typeof label == 'string' && label.length > 0 && this.renderLabel(label) }

	                { prepend && 
	                	<span className='prepended-content'> {prepend} </span>
	                }

                    <Flatpickr 
                        ref = {ref => this.field = ref}
                        {...this.passableProps(this.props)}
                        onFocus={event => this.innerHandleFocus(event)}
                        onBlur={event => this.innerHandleBlur(event)}
                    />

	                { this.renderStatusIcon() }
	            </div>
        	);
        }

        return (
            <div 
                className={this.containerClassNames(variant)}
                title={typeof label == 'string' && label.length > 0 ? label : ''}
            >
                { typeof label == 'string' && label.length > 0 && this.renderLabel(label) }

                { prepend && 
                	<span className='prepended-content'> {prepend} </span>
                }

                { !multiline && !component && 
                    <input 
                        ref = {ref => this.field = ref}
                        type={this.inputType()}
                        {...this.passableProps(this.props)}
                        onFocus={event => this.innerHandleFocus(event)}
                        onBlur={event => this.innerHandleBlur(event)}
                    />
                }

                { !multiline && component && component({
                		inputRef: ref => this.field = ref,
                        type: this.inputType(),
                        ...this.passableProps(this.props),
                        onFocus: event => this.innerHandleFocus(event),
                        onBlur: event => this.innerHandleBlur(event),
                        value: this.props.value
                	})
                }

                { multiline &&
                    <textarea
                        ref = {ref => this.field = ref}
                        id={id}
                        placeholder={placeholder}
                        type={type || 'text'}
                        {...this.passableProps(this.props)}
                        onFocus={event => this.innerHandleFocus(event)}
                        onBlur={event => this.innerHandleBlur(event)}
                    ></textarea>
                }

                { passwordToggle && !multiline && this.renderPasswordToggle() }
                { this.renderStatusIcon() }
            </div>
        )
    }

    renderLabel(label){
        let extraClasses = ""
        if(this.props.label){
            extraClasses = "d-none d-md-block"
        }
        return (
            <React.Fragment>
                <label className={`label ${extraClasses}`}>
                    <span>{label}</span>
                </label>
                <label className={`label d-md-none`} hidden={this.props.label !== undefined}>
                    <span>{this.props.label}</span>
                </label>
            </React.Fragment>
        );
    }

    renderPasswordToggle(){
        if(this.props.type !== 'password'){
            return;
        }
        return (
            <div className='input-adornment'>
                <button
                    type='button'
                    onClick={() => this.handleTogglePassword()}
                >
                    { this.inputType() !== 'password' && <i className='material-icons'>visibility</i> }
                    { this.inputType() === 'password' && <i className='material-icons'>visibility_off</i> }
                </button>
            </div>
        );
    }

    renderStatusIcon(){
        const { variant, noIcon } = this.props;
        if(noIcon){
            return null;
        }
        let iconNames = {
            'success': 'check_circle',
            'warning': 'error',
            'danger' : 'cancel'
        };

        if(!iconNames.hasOwnProperty(variant)){
            return false;
        }

        return(
            <span className='variant-icon'>
                <i className='material-icons'>{iconNames[variant]}</i>
            </span>
        );
    }

    containerClassNames(variant){
        const {disabled, size, className} = this.props;
        const {focused} = this.state;
        let joinedClasses = ' ';
        
        if(disabled){
            joinedClasses = joinedClasses+'disabled '
        }

        if(focused){
            joinedClasses = joinedClasses+'focus '
        }

        joinedClasses = joinedClasses+' '+this.sizeStyle(size);

        switch (variant) {
            case 'focused':
            case 'success':
            case 'warning':
            case 'danger':
                return `vc-input input-${variant}${joinedClasses} ${className}`;
            default:
                return `vc-input input-default${joinedClasses} ${className}`;
        }
    }

    sizeStyle(size) {
        switch (size) {
            case 'sm':
                return `input-small`;
            case 'lg':
                return `input-large`;
            default:
                return '';
        }
    }

    innerHandleBlur(event){
        this.setState({
            focused: false
        })
        if(typeof this.props.onBlur == 'function'){
            this.props.onBlur(event);
        }
    }

    innerHandleFocus(event){
        this.setState({
            focused: true
        })
        if(typeof this.props.onFocus == 'function'){
            this.props.onFocus(event);
        }
    }

    handleTogglePassword(event){
        if(event && typeof event.preventDefault == 'function'){
            event.preventdefault();
        }
        this.setState({
            type: this.inputType() == 'password' ? 'text' : 'password'
        });
    }

    passableProps(props) {
        let removable = [
            'label', 
            'className', 
            'size', 
            'variant', 
            'type', 
            'passwordToggle', 
            'onFocus', 
            'onBlur',
            'multiline',
            'noIcon',
            'component',
            'prepend',
        ];
        let propsCopy = Object.assign({}, props);
        for (var i = 0; i < removable.length; i++) {
            if (propsCopy.hasOwnProperty(removable[i])) {
                delete propsCopy[removable[i]];
            }
        }
        return propsCopy;
    }

    inputType(){
        const stateType = this.state.type;
        const { type } = this.props;

        if(typeof stateType == 'string'){
            return stateType;
        }

        if(typeof type == 'string'){
            return type;
        }

        return 'text';
    }
}