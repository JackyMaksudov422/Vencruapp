
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ResizeEventWrapper extends Component{

    static propTypes = {
        onResize: PropTypes.func.isRequired
    }

    handleResize(event) {
        // Fire the passed callback prop
        if (this.props.onResize) this.props.onResize(event);
    }

    render () {
        return this.props.children || null;
    }

    componentDidMount() {
        if (this.props.onResize) this.element().addEventListener("resize", this.handleResize.bind(this));
    }

    componentWillUnmount() {
        if (this.props.onResize) this.element().removeEventListener("resize", this.handleResize.bind(this));
    }

    element(){
        let { element } = this.props;
        let  el = window;
        if(element && typeof element == 'string' && element.trim().length > 0){
            element = element.trim();
            if(element.indexOf('#') == 0){
                el = document.getElementById(element.substr(1, (element.length - 1)));
            }

            if(element.indexOf('.') == 0){
                el = document.getElementsByClassName(element.substr(1, (element.length - 1)));
            }

            if(element.indexOf('.') != 0 && element.indexOf('#') != 0){
                el = document.getElementsByTagName(element);
            }
        }
        return el;
    }
};

export default ResizeEventWrapper;