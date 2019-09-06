import React from 'react';
import { DashboardCard } from "../presentation/DashboardCards"

export default class PendingRevenueCard extends React.Component{
    constructor(){
        super()
        this.state = { }
    }

    render(){
        const { placeholder } = this.props;
        return (
            <DashboardCard 
                // placeholder
                className={`vc-pending-revenue-card ${this.props.className || ''}`}                
                cardTitle="Outstanding Revenue" 
                cardData={{ amount : 10000, subText : "Shows where your money is coming from" }}                 
                />
        )
    }

}