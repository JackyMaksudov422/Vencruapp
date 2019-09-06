import React from 'react'
import PageDialog from '../presentation/PageDialogs'

import EmailForm from './EmailForm'

export default class EmailMsg extends React.Component {
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

                <EmailForm 
                    submitLabel="Send Invoice"
                    data={{
                        email: this.props.email || '',
                    }}
                    onCancel={this.props.onCancel || null}
                    onSubmit={this.props.onSubmit || null}
                />
            
            </PageDialog>
        ) 
    }

}