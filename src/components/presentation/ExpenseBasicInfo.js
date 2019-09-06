import React from 'react';
import propTypes from 'prop-types';
import { EXPENSE_CATEGORIES_ICONS } from '../../configs/data.config.js';

export default class ExpenseBasicInfo extends React.Component {
    static propTypes = {
        vendor: propTypes.string.isRequired,
        category: propTypes.string.isRequired
    }

    render() {
    	const {
    		category,
    		vendor
    	} = this.props;
        const categoryIcon = EXPENSE_CATEGORIES_ICONS[category] || 
        					 EXPENSE_CATEGORIES_ICONS['Other'];
        const color = this.categoryColor(category);
        return (
            <div className='vc-expense-basic-info'>
                <span 
                	className={`expense-line bg-${color} hidden md:block`}
                >&nbsp;</span>
                <div className='expense-info'>
                    <h4 className='expense-vendor'>
                    	{vendor}
                    </h4>
                    <h5 className='expense-category'>
                    	<i 
                    		className={`
                    			icon ion-md-${categoryIcon} text-${color}
                    		`.trim()}
                    	></i>&nbsp;
                    	<span>{category}</span>
                    </h5>
                </div>
            </div>
        );
    }

    categoryColor(category){
    	switch(category){
    		case 'Transportation':
    			return 'green';
    		case 'Advertising':
    			return 'blue';
    		case 'Meals and Entertainment':
    			return 'orange';
    		case 'Rent':
    			return 'purple';
    		default:
    			return 'black';
    	}
    }
}