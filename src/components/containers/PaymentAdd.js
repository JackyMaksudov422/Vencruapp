import React from 'react'
import PageDialog from '../presentation/PageDialogs'

import PaymentForm from './PaymentForm'

export default class PaymentAdd extends React.Component {
    constructor(){
        super()

    }


    render(){
        return (
        <PageDialog
            backdropClose={true}
            escClose={true}
            show={this.props.show}
            onDismiss={this.props.onDismiss}
            controlled={true}
            className="payment-form-modal"
            >

            <PaymentForm 
                title="Payment Made"
                submitLabel="Save"
                disabled={{totalamount: true}}
                data={
                    {
                        totalamount: this.props.subtotal || '',
                        depositpaid: this.props.deposit || ''
                    }
                }
                onCancel={this.props.onCancel || null}
                onSubmit={this.props.onSubmit}
            />
        
        </PageDialog>
        ) 
    }


}