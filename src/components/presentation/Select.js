import React from 'react';
import propTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

export default class Select extends React.Component {

    static propTypes = {
        variant: propTypes.oneOf([
            'default',
            'focused',
            'success',
            'warning',
            'danger',
            'link',
            'link-focused',
            'link-success',
            'link-warning',
            'link-danger',
        ]),
        value: propTypes.oneOfType([propTypes.string, propTypes.number]),
        placeholder: propTypes.string,
        size: propTypes.oneOf(['sm', 'md', 'lg']),
        error: propTypes.bool,
        options: propTypes.oneOfType([propTypes.array, propTypes.object]).isRequired,
        onChange: propTypes.func,
    }

    static defaultProps = {
        variant: 'default',
        size: 'md',
        error: null
    }

    state = {
        focused: false,
        showOptions: false,
        value: '',
        listenerSet: false,
        dropup: false,
    }

    componentDidMount() {
        this.mounted = true;
        if (this.props.value &&
            (typeof this.props.value === 'string' || typeof this.props.value === 'number')
        ) {
            if (this.mounted) {
                this.setState({
                    value: this.props.value
                });
            }
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }    

    render() {
        const { showOptions } = this.state;
        const { onChange, setRef, disabled, label } = this.props;
        return (
            <div
                className={this.componentClassNames()}
                title={typeof label === 'string' && label.length > 0 ? label : ''}
                ref={ref => this.container = ref}
            >
            	{ typeof label === 'string' && label.length > 0 && this.renderLabel(label) }

                <select
                    ref={setRef}
                    value={this.getComponentValue()}
                    onChange={onChange ? onChange : (e) => this.handleSelect(e)}
                    disabled={disabled}
                >
                    {this.getOptionKeys().map((item, index) => this.renderOption(item, index))}
                </select>
                <button
                    type='button'
                    className={`select-toggle-button ${this.getSectionClass('toggler')}`.trim()}
                    ref={ref => this.button = ref}
                    {...this.passableProps(this.props)}
                >
                    <span className='placeholder'>{this.getPlaceholder()}</span>
                    <span className='arrow'>
                        {showOptions && <i className='material-icons'>arrow_drop_up</i>}
                        {!showOptions && <i className='material-icons'>arrow_drop_down</i>}
                    </span>
                </button>
            </div>
        )
    }

    renderLabel(label){
        return (
            <label className='label'>
                <span>{label}</span>
            </label>
        );
    }

    getSectionClass(section) {
        const { classes } = this.props;

        if (!classes || classes.constructor !== Object) {
            return '';
        }

        switch (section) {
            case 'container':
                return classes['container'] || '';
            case 'toggler':
                return classes['toggler'] | '';
            case 'list':
                return classes['list'] || '';
            default:
                return '';
        }
    }

    renderOption(item, index) {
        const { options } = this.props;
        let value = item;
        let label = value;

        if (options.constructor === Object) {
            label = options[item] || value;
        }

        if (item.constructor === Object) {
            value = Object.keys(item)[0];
            label = Object.values(item)[0];
        }

        return (
            <option
                className={`select-options-item${this.getFieldValue() === value ? ' selected' : ''}`}
                key={index}
                value={value}
            >{ `${label}` }</option>
        );
    }

    handleButtonClick(event) {
        this.toggleOptionsVisibility();
        if (typeof this.props.onClick === 'function') {
            this.props.onClick(event);
        }
    }

    handleSelect(event) {
    	let ev = cloneDeep(event);
        if (this.mounted) {
            this.setState({
                value: event.target.value
            }, () => {
                this.fireOnChange(ev);
            });
        }
    }

    fireOnChange(event) {
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(event);
        }
    }

    getPlaceholder() {
        const { placeholder } = this.props;
        let placeholdit = 'Select from option...';
        let firstValue = this.getFirstValue();

        if (firstValue) {
        	if(typeof firstValue === 'string' || firstValue === 'number'){
            	placeholdit = this.findPlaceholderBySelection(firstValue);
        	}
        	if(firstValue.constructor === Object){
        		placeholdit = Object.values(firstValue)[0];
        	}
        }

        if (typeof placeholder === 'string' &&
            placeholder.length > 0
        ) {
            placeholdit = placeholder;
        }

        if (this.findPlaceholderBySelection(this.getFieldValue())) {
            placeholdit = this.findPlaceholderBySelection(this.getFieldValue());
        }

        return  placeholdit || this.findPlaceholderBySelection(this.state.value);
    }

    findPlaceholderBySelection(selection) {
        const { options } = this.props;
        if (!options) {
            return null;
        }

        if (options.constructor === Array) {

            let index = options.findIndex(item => {
            	if(item.constructor === Object){
            		return Object.keys(item)[0] === selection;
            	}
            	return item === selection;
            });
            if(index >= 0){
            	if(options[index].constructor === Object){
            		return Object.values(options[index])[0];
            	}
            	return options[index];
            }
            return null;
        }

        if (options.constructor === Object) {
            return options.hasOwnProperty(selection) ? options[selection] : null;
        }

        return null;
    }

    toggleOptionsVisibility(show) {
        if (this.mounted) {
            this.setState({
                showOptions: typeof show === 'boolean' ? show : !this.state.showOptions
            })
        }
    }

    getComponentValue() {
        if (this.props.value !== null &&
            this.props.value !== undefined
        ) {
            return this.props.value;
        }

        return this.state.value;
    }

    getFieldValue() {
        if (this.props.value !== null &&
            this.props.value !== undefined
        ) {
            return this.props.value;
        }
        if (this.field &&
            typeof this.field.value === 'string' &&
            this.field.value.length > 0
        ) {
            return this.field.value;
        }

        return undefined;
    }

    componentClassNames() {
        const { disabled, size, variant } = this.props;
        const { showOptions } = this.state;
        let joinedClasses = ' ';

        if (disabled === true) {
            joinedClasses = joinedClasses + 'disabled '
        }

        if (showOptions) {
            joinedClasses = joinedClasses + 'active '
        }

        joinedClasses = `${joinedClasses} ${this.sizeStyle(size)} ${this.getSectionClass('container')}`;

        switch (variant) {
            case 'focused':
            case 'success':
            case 'warning':
            case 'danger':
            case 'link':
            case 'link-focused':
            case 'link-success':
            case 'link-warning':
            case 'link-danger':
                return `vc-select vc-select-${variant}${joinedClasses}`;
            default:
                return `vc-select vc-select-default${joinedClasses}`;
        }
    }

    sizeStyle(size) {
        switch (size) {
            case 'sm':
                return `small-select-container`;
            case 'lg':
                return `large-select-container`;
            default:
                return '';
        }
    }

    getFirstValue() {
        const { options } = this.props;

        if (!options) {
            return null;
        }

        if (options.constructor === Array) {
            return options[0] || null
        }

        if (options.constructor === Object) {
            let optionKeys = this.getOptionKeys();
            return optionKeys && optionKeys.constructor === Array && optionKeys.length > 0
                ? options[optionKeys] : null;
        }

        return null;
    }

    passableProps(props) {
        let removable = [
            'options',
            'placeholder',
            'className',
            'classess',
            'size',
            'variant',
            'value',
            'error',
            'classes',
            'onChange',
            'setRef',
        ];
        let propsCopy = Object.assign({}, props);
        for (var i = 0; i < removable.length; i++) {
            if (propsCopy.hasOwnProperty(removable[i])) {
                delete propsCopy[removable[i]];
            }
        }
        return propsCopy;
    }
    
    getOptionKeys() {
        if (!this.props.options) {
            return [];
        }
        if (this.props.options.constructor === Array) {
            return this.props.options;
        }
        if (this.props.options.constructor === Object) {
            return Object.keys(this.props.options);
        }
        return [];
    }
}