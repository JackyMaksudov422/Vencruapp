import React from 'react';
import TableRow from './TableRow';

export default class TableBody extends React.PureComponent{
    render(){
        return(
            <tbody className={`vc-table-body ${this.props.className}`}>
                { this.children() }
            </tbody>
        )
    }

    children(){
        let children = React.Children.map(this.props.children, (child) => {
            if(child && child.type === TableRow){
                return React.cloneElement(child)
            }
        });

        return children;
    }
}