import React, { Component } from 'react'

import { SummaryCard } from '../presentation/DashboardCards'
import { thousand } from '../../helpers/Misc';

const revenueIcon = require('../../assets/revenue.png');
const expensesIcon = require('../../assets/expenses.png');
const incomeIcon = require('../../assets/income.png');

export default class BusinessSummary extends Component {
    render(){
        return (
            <div className={`dashboard-card business-summary ${this.props.className || ''}`}>
                <hr className="line-rule"/>
                <h2 className="text-black text-lg font-bold mb-3 ml-3"> Business Summary </h2>
                <div className="vc-plain-card">
                    <div className="row">
                        <SummaryCard title="Total Income Received" amount={this.format(this.props.incomeReceived)} image={incomeIcon}/>
                        <SummaryCard title="Total Outstanding Revenue" amount={this.format(this.props.outstandingRevenue)} image={revenueIcon}/>
                        <SummaryCard title="Total Expenses" amount={this.format(this.props.totalExpenses)} image={expensesIcon}/>
                        <SummaryCard title="Total Profit" amount={this.format(this.props.profit)} image={incomeIcon}/>
                        <SummaryCard title="Total Customers" amount={this.props.totalCustomers} image={incomeIcon}/>
                        <SummaryCard title="Most Sold Item (this month)" amount={this.props.mostSoldItem} image={revenueIcon}/>
                    </div>
                </div>
            </div>
        )
    }

    format(amount){
        if(amount !== undefined){
            return `₦  ${thousand(parseInt(amount))}`
        }else return '0'
    }
}