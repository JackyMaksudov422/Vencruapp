import React from 'react';

export default class AppbarSearch extends React.Component {
    state = {
        value: '',
        focused: false
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.value !== this.state.value){
            if(typeof this.props.onChange == 'function'){
                this.props.onChange(this.state.value);
            }
        }
    }

    render() {
        const { value, focused } = this.state;
        return (
            <div className={`vc-appbar-search${focused ? ' focused' : ''}`}>
                <div className='field-container'>
                    <input
                        ref={ref => this.feild = ref}
                        type='text'
                        className='field'
                        onChange={(event) => this.setState({ value: event.target.value })}
                        value={value}
                        onFocus={() => this.setState({focused: true})}
                        onBlur={() => this.setState({focused: false})}
                    />
                    <span
                        onClick={() => this.focusOnSearch()}
                        className='field-adornment'
                    >
                        <i className='material-icons'>search</i>
                    </span>
                </div>
            </div>
        )
    }

    focusOnSearch(){
        if(this.feild){
            this.feild.focus();
        }
    }

    clear(){
        this.setState({
            value: ''
        })
    }
}