import * as React from 'react';

export default class OnboardingStep extends React.Component {

    state = {
        initialized: false,
        validation: {
            fields: null,
            valid: false
        },
        touched: [],
        focused: [],
    };

    render(){
        return null;
    }

    validationData(){
        return {
        }
    }

    validationRules(){
        return {
        };
    }

    validationMessages(){
        return {
        };
    }

    handleValidatorChange(state, callback){
        this.setState({
            validation: state
        }, () => {
            if(typeof this.props.onValidityChange === 'function'){
                this.props.onValidityChange();
            }

            if(typeof callback === 'function'){
                callback()
            }
        });
    }

    handleFieldChange(field, value){
        let touched = [...this.state.touched];
        if(!this.isTouched(field)){
            touched = touched.concat([field]);
        }
        this.setState({
            [field]: value,
            touched: touched
        });
    }

    hasError(field){
        const {validation} = this.state;

        if(!validation || !validation.fields){
            return false;
        }

        let fieldValidation = validation.fields[field];

        if(!fieldValidation){
            return false;
        }

        return !fieldValidation.valid;
    }

    isTouched(field){
        return this.state.touched.indexOf(field) !== -1
    }

    isFocused(field){
        return this.state.focused.indexOf(field) !== -1
    }

    handleFocus(field){
        let focused = [...this.state.focused];
        if(!this.isFocused(field)){
            this.setState({
                focused: focused.concat([field])
            });
        }
    }

    isValid(){
        const {valid} = this.state.validation;
        return valid;
    }

    handleBlur(field){
        let focused = [...this.state.focused];
        if(this.isFocused(field)){
            focused.splice(focused.indexOf(field), 1);
            this.setState({
                focused: focused
            });
        }
    }

    submit(){

    }


    initialize(initialData){
        this.setState({ initialized: true });
    }
}