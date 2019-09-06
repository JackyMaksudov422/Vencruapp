import React from 'react'
import PageDialog from '../presentation/PageDialogs'

import WhatsAppForm from './WhatsAppForm'

export default class WhatsAppMsg extends React.Component {
    constructor(){
        super()
    }


    render(){
        return (
            <PageDialog
                backdropClose={true}
                escClose={true}
                show={true}
                onDismiss={this.props.onDismiss}
                controlled={true}
                className=""
                >

                <WhatsAppForm 
                    submitLabel="Send Invoice"
                    data={{
                        phonenumber: this.props.phonenumber || '',
                    }}
                    onCancel={this.props.onCancel || null}
                    onSubmit={(data) => this.linkToWhatsApp(data.PhoneNumber, this.props.message)}
                />
            
            </PageDialog>
        ) 
    }

    linkToWhatsApp(phoneNumber, message){

        let url = `https://wa.me/${encodeURI(phoneNumber)}?text=${encodeURIComponent(message)}`
        var win = window.open(url, '_blank');
        win.focus();
    }

}