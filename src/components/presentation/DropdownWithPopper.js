import React from 'react';
import { findDOMNode } from 'react-dom';
import propTypes from 'prop-types';
import ResizeEventWrapper from '../wrappers/ResizeEventWrapper';
import ScrollEventWrapper from '../wrappers/ScrollEventWrapper';
import { Manager, Reference, Popper } from 'react-popper';

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
        iconButton: propTypes.bool
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
        if (this.mounted) {
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
            (typeof this.props.value == 'string' || typeof this.props.value == 'number')
        ) {
            this.setState({
                value: this.props.value
            });
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        const { showOptions, dropup } = this.state;
        const { label, noArrow, icon, iconButton } = this.props;
        return (
            <div
                className={this.componentClassNames()}
                title={typeof label == 'string' && label.length > 0 && label}
                ref={ref => this.container = ref}
            // onFocus={() => { 
            //     if(this.mounted){
            //         this.setState({ focused: true })
            //     }
            // }}
            // onBlur={(event) => this.handleOnFocusOut(event)}
            >
                <Manager>
                    {/* <input
                        ref={ref => this.field = ref}
                        onChange={(event) => this.handleChangeWrapper(event)}
                        value={this.getComponentValue()}
                    /> */}
                    <Reference>
                        {({ ref }) => (
                            <button
                                ref={ref}
                                type='button'
                                className={`dd-toggle-button ${iconButton && 'dd-icon-button' || ''} ${this.getSectionClass('toggler')}`.trim()}
                            // {...this.passableProps(this.props)}
                            // onClick={(event) => this.handleButtonClick(event)}
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
                        )}
                    </Reference>
                    <Popper
                        placement='bottom-start'
                    >
                        {({ ref, style, placement, arrowProps }) => (
                            <div
                                ref={ref}
                                className={`
                                    dd-options-container${dropup ? ' dropup' : ''}
                                    ${this.getSectionClass('list')}
                                `.trim()}
                                data-placement={placement}
                                style={style}
                            >
                                <div ref={arrowProps.ref} style={arrowProps.style}></div>
                                <ul className='dd-options-list'>
                                    { this.getOptionKeys()
                                        .map((item, index) => this.renderOption(item, index))}
                                </ul>
                            </div>
                        )}
                    </Popper>
                </Manager>
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
        const { options } = this.props;
        let value = item;
        let label = value;

        if (options.constructor == Object) {
            label = options[item] || value;
        }

        return (
            <li
                className={`dd-options-item`}
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
        this.toggleOptionsVisibility();
        if (typeof this.props.onClick == 'function') {
            this.props.onClick(event);
        }
    }

    handleSelect(event, value) {
        this.fireOnChange(value);
    }

    // handleChangeWrapper(event) {
    //     if (typeof this.props.onChange == 'function') {
    //         this.props.onChange(event);
    //     }
    // }

    handleOnFocusOut(event) {
        if (this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        this.blurTimeout = setTimeout(() => this.toggleOptionsVisibility(false), 60);
    }

    toggleOptionsVisibility(show) {
        if (this.mounted) {
            this.setState({
                showOptions: typeof show == 'boolean' ? show : !this.state.showOptions
            })
        }
    }

    // getComponentValue() {
    //     if (this.props.value !== null &&
    //         this.props.value !== undefined
    //     ) {
    //         return this.props.value;
    //     }

    //     return undefined;
    // }

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
        if (typeof this.props.onChange == 'function') {
            this.props.onChange({
                target: {
                    value: value
                }
            })
        }
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
        if (this.props.options.constructor == Array) {
            return this.props.options;
        }
        if (this.props.options.constructor == Object) {
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