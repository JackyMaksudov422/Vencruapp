import React from 'react';
import propTypes from 'prop-types';

export default class Dropdown extends React.Component {

    static propTypes = {
        variant: propTypes.oneOf([
            'default',
            'primary',
            'success',
            'warning',
            'danger',
            'gray',
            'link',
            'link-primary',
            'link-success',
            'link-warning',
            'link-danger',
            'link-gray',
        ]),
        value: propTypes.oneOfType([propTypes.string, propTypes.number]),
        placeholder: propTypes.string,
        size: propTypes.oneOf(['sm', 'md', 'lg']),
        error: propTypes.bool,
        options: propTypes.oneOfType([propTypes.array, propTypes.object]).isRequired,
        onChange: propTypes.func,
        noArrow: propTypes.bool,
        align: propTypes.oneOf(['left', 'right']),
        iconButton: propTypes.bool,
        destructiveOption: propTypes.number
    }

    static defaultProps = {
        variant: 'default',
        size: 'md',
        error: null,
        noArrow: false,
        align: 'left',
        iconButton: false
    }

    state = {
        focused: false,
        showOptions: false,
        value: '',
        dropup: false,
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.mounted){
            if (prevState.showOptions != this.state.showOptions) {
                this.setState({
                    search: ''
                });
            }
        }
    }

    componentDidMount() {
        this.mounted = true;
        if (this.props.value &&
            (typeof this.props.value === 'string' || typeof this.props.value === 'number')
        ) {
            this.setState({
                value: this.props.value
            });
        }
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    render() {
        const { showOptions, dropup } = this.state;
        const { label, noArrow, icon, iconButton } = this.props;
        return (
            <div
                className={`${this.componentClassNames()} ${this.props.className}`}
                title={typeof label === 'string' && label.length > 0 ? label : ''}
                ref={ref => this.container = ref}
                onFocus={() => { 
                    if(this.mounted){
                        this.setState({ focused: true })
                    }
                }}            
                onBlur={(event) => this.handleOnFocusOut(event)}
            >
                {/* <input
                    ref={ref => this.field = ref}
                    onChange={(event) => this.handleChangeWrapper(event)}
                    value={this.getComponentValue()}
                /> */}
                <button
                    type='button'
                    className={`dd-toggle-button ${iconButton && 'dd-icon-button' || ''} ${this.getSectionClass('toggler')}`.trim()}
                    ref={ref => this.button = ref}
                    {...this.passableProps(this.props)}
                    onClick={(event) => this.handleButtonClick(event)}
                >
                    {!iconButton &&
                        <React.Fragment>
                            <span className={`placeholder ${icon && 'icon-label' || ''}`}>{label}</span>
                            {icon}

                            {!noArrow &&
                                <span className='arrow'>
                                    <i className='material-icons'>keyboard_arrow_down</i>
                                </span>
                            }
                        </React.Fragment>
                    }
                    {iconButton &&
                        <span className='icon-button-icon'>
                            {icon}
                        </span>
                    }
                </button>
                {showOptions &&
                    <div
                        ref={ref => this.listContainer = ref}
                        className={`dd-options-container${dropup ? ' dropup' : ''} ${this.getSectionClass('list')}`.trim()}
                    >
                        <ul className='dd-options-list'>
                            {this.getOptionKeys().map((item, index) => this.renderOption(item, index))}
                        </ul>
                    </div>
                }
            </div>
        )
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
                return classes['toggler'] || '';
            case 'list':
                return classes['list'] || '';
            default:
                return '';
        }
    }

    renderOption(item, index) {
        const { options, destructiveOption } = this.props;
        let value = item;
        let label = value;
        let destructiveClass = destructiveOption === index && 'destructive' || '';

        if (options.constructor === Object) {
            label = options[item] || value;
        }

        return (
            <li
                className={`dd-options-item ${destructiveClass}`}
                key={index}
                title={label}
            >
                <button
                    type='button'
                    onClick={(event) => this.handleSelect(event, value)}
                >{label}</button>
            </li>
        );
    }

    handleButtonClick(event) {        
        this.toggleOptionsVisibility()
        if (typeof this.props.onClick === 'function') {
            this.props.onClick(event);
        }        
    }

    handleSelect(event, value) {
        this.fireOnChange(value);
    }

    handleOnFocusOut(event) {
        event.persist()
        // console.log(event)
        if (this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        this.blurTimeout = setTimeout(() => this.toggleOptionsVisibility(false), 600);
    }

    toggleOptionsVisibility(show) {
        if(this.mounted){
            this.setState({
                showOptions: typeof show === 'boolean' ? show : !this.state.showOptions
            })
        }
    }

    componentClassNames() {
        const { disabled, size, variant, align } = this.props;
        const { showOptions } = this.state;
        let joinedClasses = ` dd-align-${align} `;

        if (disabled === true) {
            joinedClasses = joinedClasses + 'disabled '
        }

        if (showOptions) {
            joinedClasses = joinedClasses + 'active '
        }

        joinedClasses = `${joinedClasses} ${this.sizeStyle(size)} ${this.getSectionClass('container')}`;

        switch (variant) {
            case 'primary':
            case 'success':
            case 'warning':
            case 'danger':
            case 'gray':
            case 'link':
            case 'link-primary':
            case 'link-success':
            case 'link-warning':
            case 'link-danger':
            case 'link-gray':
                return `vc-dd vc-dd-${variant}${joinedClasses}`;
            default:
                return `vc-dd vc-dd-default${joinedClasses}`;
        }
    }

    sizeStyle(size) {
        switch (size) {
            case 'sm':
                return `small-dd-container`;
            case 'lg':
                return `large-dd-container`;
            default:
                return '';
        }
    }

    fireOnChange(value) {
        // if (this.field) {
        //     let event = new Event('change', { bubbles: true });
        //     this.setNativeValue(this.field, value);
        //     this.field.dispatchEvent(event);
        // }
        if(typeof this.props.onChange === 'function'){
            this.props.onChange({
                target: {
                    value: value
                }
            })
        }

        this.toggleOptionsVisibility()
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
            'onChange',
            'classes',
            'noArrow',
            'label',
            'iconButton',
            'icon',
            'destructiveOption'
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

    setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
    }
}

export class DateFilter extends React.Component {

    constructor(){
        super()

        this.state = { }
    }

    getFilterLabel(){
    	const { filterOption, filterDate } = this.state;    	
    	if(filterOption == 'custom'){
    		let fromTime, toTime;
			if( filterDate.fromMonth &&
				filterDate.fromYear
			){
				fromTime = filterDate.fromMonth + '/' + filterDate.fromYear
			}
			if( filterDate.toMonth &&
				filterDate.toYear
			){
				toTime = filterDate.toMonth + '/' + filterDate.toYear
			}
			return (
    		<span>
            	<i className="icon ion-md-calendar"></i>{` `}
            	<span>{fromTime} - {toTime}</span>
            </span>
    	);
    	}
    	return (
    		<span>
            	<i className="icon ion-md-calendar"></i>{` `}
            	<span>{this.props.selectedOption || this.props.options[0]}</span>
            </span>
    	);
    }

    onChange = (event) => {        
        this.props.onChange(event.target.value)
    }

    render(){
        return (
            <Dropdown
                label={this.getFilterLabel()}
                options={this.props.options}                                    
                variant={this.props.variant}                                                  
                classes={this.props.classes}                
                onChange={this.onChange}
            />
        )
    }
}