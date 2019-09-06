import React from 'react';
import PlainCard from './PlainCard';
const placeholderImage = require('../../assets/doughnut-chart-placeholder.png');

export default class IncomeSourcesCard extends React.Component{

    render(){
        const { placeholder } = this.props;
        return (
            <div 
                className={`vc-expenses-card ${this.props.className || ''}`}
            >
                <h2 className='title'>Expenses</h2>
                { placeholder &&
                    <PlainCard>
                        <div className='placeholder-heading'>
                            <span className='placeholder-title'>See where your money's going</span>
                            <span className='placeholder-filters'>&nbsp;</span>
                        </div>
                        <div className='placeholder-graph'>
                            <div className='row'>
                                <div className='col-md-3'>
                                    <img
                                        alt='graph'
                                        className='graph-image'
                                        src={placeholderImage}
                                    />
                                </div>
                                <div className='col-md-9'>
                                    <ul className='legends-list'>
                                        <li className='legend-item secondary'>
                                            <span className='legend-dash'>&nbsp;</span>
                                            <span className='legend-circle'>&nbsp;</span>
                                            <span className='legend-label'>&nbsp;</span>
                                        </li>
                                        <li className='legend-item green'>
                                            <span className='legend-dash'>&nbsp;</span>
                                            <span className='legend-circle'>&nbsp;</span>
                                            <span className='legend-label long'>&nbsp;</span>
                                        </li>
                                    </ul>
                                    <ul className='legends-list'>
                                        <li className='legend-item blue'>
                                            <span className='legend-dash'>&nbsp;</span>
                                            <span className='legend-circle'>&nbsp;</span>
                                            <span className='legend-label'>&nbsp;</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='placeholder-bottom-line'>&nbsp;</div>
                    </PlainCard>
                }
            </div>
        )
    }

}