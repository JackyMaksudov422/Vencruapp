import React from 'react';
import propTypes from 'prop-types';

export default class TableCell extends React.PureComponent{

    static propTypes = {
        type: propTypes.oneOf(['td', 'th'])
    }

    static defaultProps = {
        type: 'td'
    }

    render(){
        let extraClasses = ""        
        if(this.props.showOnMobile){
            extraClasses = ""
            if (this.props.mobileOnly){
                extraClasses = "d-md-none"
            }
        } else {
            extraClasses = "d-none d-md-table-cell"
        }
        if(this.props.type === 'th'){
            return(
                <th onClick={this.props.onClick} className={`vc-table-cell ${this.props.className || ""} ${extraClasses}`}>
                    { this.props.children }
                </th>
            )
        }
        return(
            <td onClick={this.props.onClick} className={`vc-table-cell ${this.props.className || ""} ${extraClasses}`}>
                { this.props.children }
            </td>
        )
    }
}