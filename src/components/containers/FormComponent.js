import * as React from 'react';
import Validator from '../../modules/Validator';

export default class FormComponent extends React.Component {

    state = {
        formValidation: {
            fields: null,
            valid: false
        },
        touched: [],
        focused: [],
        form: {},
        initialForm: {}
    };

    constructor(props, state){
        super();
        if(state){
            this.state = Object.assign({}, this.state, state || {}, {
                initialForm: state && state.form ? Object.assign({}, state.form) : {}
            });
        }
    }

    render(){
        return (
            <React.Fragment>
                <Validator
                    setRef={ref => this.validator = ref}
                    form={this.validationData()}
                    rules={this.validationRules()}
                    messages={this.validationMessages()}
                    onChange={(formValidation) => this.setState({
                        formValidation: formValidation
                    })}
                />
                { this.renderMethod() }
            </React.Fragment>
        );
    }

    validationData(){
        return {
        };
    }

    validationRules(){
        return {
        };
    }

    validationMessages(){
        return {
        };
    }

    handleFieldValueChange(field, value){
        let touched = this.state.touched && [...this.state.touched] || [];
        let form = this.state.form && Object.assign({}, this.state.form);
        
        if(!this.fieldIsTouched(field)){
            touched = touched.concat([field]);
        }

        form[field] = value;
        
        this.setState({
            form: form,
            touched: touched
        });
    }

    fieldHasError(field){
        const { formValidation } = this.state;
        if (this.fieldIsValid(field)) return false;
        return formValidation && formValidation.fields && formValidation.fields[field] && formValidation.fields[field]['error'] || false;
    }

    fieldIsValid = (field) => {
        const { formValidation } = this.state;
        if (!formValidation || !formValidation.fields) return true;
        if (!formValidation.fields[field]) return true;
        return formValidation.fields[field]['valid'] ? true : false;
    }

    fieldIsTouched(field){
        return this.state.touched && this.state.touched.indexOf(field) != -1 || false
    }

    fieldIsFocused(field){
        return this.state.touched && this.state.focused.indexOf(field) != -1 || false
    }

    handleFieldFocus(field){
        let focused = this.state.focused && [...this.state.focused] || false;
        if(!this.fieldIsFocused(field)){
            this.setState({
                focused: focused.concat([field])
            });
        }
    }

    handleFieldBlur(field){
        let focused = [...this.state.focused];
        if(this.fieldIsFocused(field)){
            focused.splice(focused.indexOf(field), 1);
            this.setState({
                focused: focused
            });
        }
    }

    formIsValid(){
        const {valid} = this.state.formValidation;
        return valid;
    }
}