import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import propTypes from 'prop-types';

export default class ContentCircularLoader extends React.Component{
    static propTypes = {
        variant: propTypes.oneOf(['veil', 'transparent', 'solid']),
        color: propTypes.oneOf(['primary', 'secondary']),
    }

    static defaultProps = {
        variant: 'solid',
        color: 'primary',
    }

    render(){
        return (
            <div className={`vc-content-circular-loader ${this.props.variant}`}>
                <CircularProgress
                    color={this.props.color}
                    size={this.props.size || undefined}
                />
            </div>
        );
    }
}