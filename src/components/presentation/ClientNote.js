import React from 'react'

export default class ClientNote extends React.Component {

    onChange = (e) => {
        this.props.onChange(e.target.value)
    }
    
    render(){

        return (
        <div className={`client-note-container ${this.props.className || " "}`}>
            <span className="header text-left"> Notes on Client</span>
            <textarea value={this.props.text} onBlur={() => {console.log("SAVE HERE")}} onChange={this.onChange} className="note-content">                
            </textarea>
        </div>
        )
    }
}