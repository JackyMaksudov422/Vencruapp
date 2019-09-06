import React from 'react';
import propTypes from 'prop-types';

class Validator extends React.Component {

    static propTypes = {
        rules: propTypes.object.isRequired,
        messages: propTypes.object.isRequired,
        form: propTypes.object.isRequired,
        onChange: propTypes.func.isRequired,
        touched: propTypes.arrayOf(propTypes.string)
    }

    state = {
        touched: []
    };

    constructor(props) {
        super();
        // 
        this._onChange = this._onChange.bind(this);
        this._valid = this._valid.bind(this);
        this._updateTouched = this._updateTouched.bind(this);
    }

    componentDidMount() {
        if (this.props.touched) {
            var touched = Object.keys(this.props.form);
            this.setState({ touched: touched });
        }
        this._onChange();
    }

    componentDidUpdate(prevProps, prevState) {
        this._updateTouched(prevProps.form, this.props.form);
    }

    render() {
        return null;
    }

    _onChange() {
        var states = { valid: true, fields: {} };
        var form = this.props.form;
        var rules = this.props.rules;
        var messages = this.props.messages;
        var touched = this.state.touched;
        var fields = Object.keys(form);

        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];

            if (!form.hasOwnProperty(field)) { continue; }

            if (!rules[field] || !messages[field]) { continue; }

            var validation = this._valid(form[field], rules[field], messages[field]);
            states.fields[field] = {
                field: field,
                value: form[field],
                touched: touched.indexOf(field) != -1 ? true : false,
                error: validation.error,
                valid: validation.valid
            };

            if (!validation.valid) {
                states.valid = false;
            }
        }

        // fire on state change listener
        if (this.props.onChange) {
            this.props.onChange(states);
        }
    }

    _valid(value, rules, messages) {
        // 
        var valid = true, error = null, rule;

        if (rules && messages) {
            // 
            for (var i in rules) {
                if (!rules.hasOwnProperty(i)) { continue; }

                rule = rules[i];

                if (typeof rule != 'function') {
                    valid = false;
                    error = `${JSON.stringify(rule)} is not a function.`;
                    break;
                }

                if (!rule(value)) { valid = false; error = messages[i]; break; }
            }
        }

        // 
        return { error: error, valid: valid };
    }

    _updateTouched(prevForm, newform) {
        var touched = [...this.state.touched];
        var wasTouched = false;


        for (var field in prevForm) {
            if (prevForm[field] != newform[field] &&
                (this.props.rules[field] && this.props.messages[field])
            ) {
                touched.push(field);
                wasTouched = true;
            }
        }

        if (wasTouched) {
            this.setState({
                touched: touched
            }, () => this._onChange());
        }
    }
}

export default Validator;