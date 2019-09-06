import React from 'react';
import TableRow from './TableRow';

export default class TableHead extends React.PureComponent{
    render(){
        return(
            <thead className={`vc-table-head ${this.props.className}`}>
                { this.children() }
            </thead>
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