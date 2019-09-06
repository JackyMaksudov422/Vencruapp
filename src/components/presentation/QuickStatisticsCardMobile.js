import React from 'react';
import PlainCard from './PlainCard';
import propTypes from 'prop-types';

export default class QuickStatisticsCard extends React.Component{
    static propTypes = {
        icon: propTypes.element,
        title: propTypes.string.isRequired,
        value: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
        placeholder: propTypes.bool,
        mobilelayout:propTypes.string,
    }

    static defaultProps = {
        placeholder: false
    }

    render(){
        return (
            <PlainCard className={'quick-stats-card ' + this.props.mobilelayout}>
                <div className='quick-stats-card-inner'>
                    <div className='quick-stats-card-content'>
                        <h6 className='quick-stats-card-header'>
                          
                            { this.props.icon }
                        </h6>
                        <span className='quick-stats-card-value'>
                        {this.props.title}                         
                        </span>
                    </div>
                    { this.props.icon &&
                        <div className='quick-stats-card-icon-container'>
                            
                             { this.props.value } 
                        </div>
                    }
                </div>
            </PlainCard>
        )
    }
}