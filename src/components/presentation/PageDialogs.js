import * as React from 'react';
import propTypes from 'prop-types';


export default class PageDialog extends React.Component {

    static propTypes = {
        variant: propTypes.oneOf([
            'default',
            'primary',
            'success',
            'warning',
            'danger'
        ]),
        backdropClose: propTypes.bool,
        escClose: propTypes.bool,
        show: propTypes.bool,
        afterDismiss: propTypes.func,
        afterShown: propTypes.func,
        onDismiss: propTypes.func,
        size: propTypes.oneOf(['md', 'sm', 'xs', 'lg'])
    };

    static defaultProps = {
        variant: 'default',
        backdropClose: true,
        show: false,
        escClose: true,
        size: 'md'
    }

    state = {
        open: false,
        focused: false
    };

    componentDidMount(){
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        if(this.props.show){
            this.show();
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.handleKeyUp.bind(this));
    }

    componentDidUpdate(prevProps, prevState) {
        // when manually triggered to dismiss
        if(prevProps.show && !this.props.show){
            if(typeof this.props.onDismiss === 'function'){
                this.props.onDismiss('prop');
            }
            this.dismiss();
        }
        // when manually triggered to show
        if(!prevProps.show && this.props.show){
            this.show();
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.controlled && nextProps.show){
            this.show()
        }
    }

    render(){
        const { children, variant, size, className, contentClassNames, } = this.props;
        const { show } = this.state;
        if(!show){
            return null;
        }
        return (
            <div 
                className={
                	'vc-page-dialog ' + (className || '') + (size ? ` vc-page-dialog-${size}` : '')
               	}
                onFocus={() => this.setState({focused: true })}
                onBlur={() => this.setState({focused: false })}
            >
                <div className='vc-page-dialog-inner'>
                    <div 
                        className='vc-page-dialog-backdrop'
                        onClick={() => this.handleBackdropClick()}
                    >&nbsp;</div>
                    <div
                        className={
                            'vc-page-dialog-content ' + (contentClassNames || '')
                            }>
                        <div className={`vc-page-dialog-body ${this.variantClassName(variant)}`}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    variantClassName(variant){
        switch(variant){
            case 'primary':
                return 'vc-page-dialog-primary';
            case 'success':
                return 'vc-page-dialog-success';
            case 'warning':
                return 'vc-page-dialog-warning';
            case 'danger':
                return 'vc-page-dialog-danger';
            default:
                return '';
        }
    }

    handleBackdropClick(){
        if(typeof this.props.onDismiss === 'function'){
            this.props.onDismiss('backdrop');
        }
        if(this.props.backdropClose){
            this.dismiss();
        }
    }

    handleKeyUp(event){
        // detect escape key press
        if(event && event.keyCode === 27){
                // detect if focused
            if(!this.state.focused){
                if(typeof this.props.onDismiss === 'function'){
                    this.props.onDismiss('escape');
                }
                // check if escape close is enabled
                if(this.props.escClose){
                    // dismiss dialog
                    this.dismiss();
                }
            }
        }
    }

    show(){
        this.setState({
            show: true
        }, () => this.handleAfterShow())
    }

    handleAfterShow(){
        if(typeof this.props.afterShown === 'function'){
            this.props.afterShown();
        }
    }

    dismiss(){
        this.setState({
            show: false
        }, () => this.handleAfterDismiss())
    }

    handleAfterDismiss(){
        if(typeof this.props.afterDismiss === 'function'){
            this.props.afterDismiss();
        }
    }
}