import React from 'react';
import TableControls from './TableControls';
import TableBody from './TableBody';
import TableHead from './TableHead';

export default class Table extends React.PureComponent{
    render(){
        return(
            <div className='vc-table-component mb-16'>
                <TableControls 
                    sortOptions={this.props.sortOptions || undefined}
                    filterOptions={this.props.filterOptions || undefined}
                    actions={this.props.controlActions || undefined}
                    onDeletePress={this.props.controlDeletePress || undefined}
                    disableDelete={this.props.disableControlDelete || undefined}
                    disableActions={this.props.disableControlActions || undefined}
                    onSearchChange={this.props.handleControlSearchOnChange || undefined}
                    pagination={this.props.pagination || undefined}
                    onActionChange={this.props.onControlActionChange || undefined}
                    onSortChange={this.props.onControlSortChange || undefined}
                    onFilterChange={this.props.onControlFilterChange || undefined}
                    defaultSearchValue={this.props.defaultSearch || undefined}
                    onPaginationNav={this.props.onPaginationNav || undefined}
                    leftActions={this.props.controlLeftActions || undefined}
                    onSelectActionsTop={this.props.selectActionsOnMobileTop || undefined}
                    onSelectActionsBottom={this.props.selectActionsOnMobileBottom || undefined}
                    selectedItems={this.props.selectedItems || undefined} // array of items selected on the table
                />
                <table cellSpacing="0" className={`vc-table ${this.props.className || ''}`}>
                    { this.children() }
                </table>
            </div>
        )
    }

    children(){
        let children = React.Children.map(this.props.children, (child) => {
            if(child){
                if( child.type !== TableControls &&
                    child.type !== TableHead  &&
                    child.type !== TableBody
                ){
                    throw Error(`Table children must be one or more of type TableBody, TableHead or TableControl. Child with type of ${child.type} passed.`);
                }
                return React.cloneElement(child, {});
            }
        });

        return children;
    }
}