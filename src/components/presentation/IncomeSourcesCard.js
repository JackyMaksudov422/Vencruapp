import React from 'react';
import PlainCard from './PlainCard';
import { SourcesCard } from './DashboardCards'
const placeholderImage = require('../../assets/doughnut-chart-placeholder.png');

export default class IncomeSourcesCard extends React.Component{

    renderPlaceholder = () => {
        return (
            <PlainCard>
                <div className='placeholder-heading'>
                    <span className='placeholder-title'>See where your money's coming from</span>
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
        )
    }

    render(){
        const { placeholder } = this.props;
        return (
            // <div 
            //     className={`vc-income-sources-card ${this.props.className || ''}`}
            // >
            //     <h2 className='title'>Income Sources</h2>
                
            // </div>
            <SourcesCard 
                // placeholder
                className={`vc-income-sources-card ${this.props.className || ''}`}
                renderPlaceholder={this.renderPlaceholder} 
                cardTitle="Income Sources" 
                cardData={{ amount : 10000, subText : "Shows where your money is coming from" }} 
                sources = {[{title : "Test", percentage : "60", color : "red"}, {title : "Test", percentage : "60", color : "red"}, {title : "Test", percentage : "60", color : "red"}, {title : "Test", percentage : "60", color : "red"},
                            {title : "Test", percentage : "60", color : "red"}, {title : "Test", percentage : "60", color : "red"}]}
                />
        )
    }

}