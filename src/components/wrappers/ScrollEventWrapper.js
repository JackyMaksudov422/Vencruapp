
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ScrollEventWrapper extends Component {

    static propTypes = {
        onScroll: PropTypes.func.isRequired
    }

    handleScroll(event) {
        // Call the passed-in prop
        if (typeof this.props.onScroll == 'function') {
            this.props.onScroll(event);
        }

    }

    render() {
        return this.props.children || null;
    }

    componentDidMount() {
        if (typeof this.props.onScroll == 'function') {
            this.element().addEventListener("scroll", this.handleScroll.bind(this));
        }
    }

    componentWillUnmount() {
        if (typeof this.props.onScroll == 'function') {
            this.element().removeEventListener("scroll", this.handleScroll.bind(this));
        }
    }

    element() {
        let { element } = this.props;
        let el = window;
        if (element && typeof element == 'string' && element.trim().length > 0) {
            element = element.trim();
            if (element.indexOf('#') == 0) {
                el = document.getElementById(element.substr(1, (element.length - 1)));
            }

            if (element.indexOf('.') == 0) {
                el = document.getElementsByClassName(element.substr(1, (element.length - 1)));
            }

            if (element.indexOf('.') != 0 && element.indexOf('#') != 0) {
                el = document.getElementsByTagName(element)[0];
            }
        }
        return el;
    }
};

export default ScrollEventWrapper;