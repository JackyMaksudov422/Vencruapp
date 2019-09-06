import React from 'react';
import PlainCard from './PlainCard';

export default class TotalProfitCard extends React.Component{

    render(){
        const { placeholder } = this.props;
        return (
            <div 
                className={`vc-total-profit-card ${this.props.className || ''}`}
            >
                <h2 className='title'>Total Profit</h2>
                { placeholder &&
                    <PlainCard>
                        <div className='placeholder-heading'>
                            <span className='placeholder-title'>Watch your profit grow</span>
                            <span className='placeholder-filters'>&nbsp;</span>
                        </div>
                        <div className='placeholder-graph'>&nbsp;</div>
                        <div className='placeholder-bottom-line'>&nbsp;</div>
                    </PlainCard>
                }
            </div>
        )
    }

}