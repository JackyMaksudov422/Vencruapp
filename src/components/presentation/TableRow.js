import React from 'react';
import TableCell from './TableCell';

export default class TableRow extends React.PureComponent{

    render(){
        return(
            <React.Fragment>
                <tr className={`vc-table-row ${this.props.className}`} onClick={this.props.onClick}>
                    { this.children() }
                </tr>
                { this.props.withSeparator && <tr className='vc-table-row-space d-none d-md-table-row'></tr> }
            </React.Fragment>
        )
    }

    children(){
        let props = {...this.props};
        let children = React.Children.map(this.props.children, (child) => {
            if(child && child.type === TableCell){
                return React.cloneElement(child, {
                    type: props.type || 'td'
                });
            }
        });

        return children;
    }
}