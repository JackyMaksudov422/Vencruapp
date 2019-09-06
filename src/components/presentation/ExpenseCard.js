import React from 'react';
import PlainCard  from './PlainCard';
import propTypes from 'prop-types';
import { EXPENSE_CATEGORIES_ICONS, CURRENCIES_SIGNS } from '../../configs/data.config.js';
import { thousand } from '../../helpers/Misc.js';

export default class ExpenseCard extends React.PureComponent{

    static propTypes = {
        category: propTypes.string.isRequired,
        name: propTypes.string.isRequired,
        date: propTypes.string.isRequired,
        amount: propTypes.number.isRequired,
        currencyType: propTypes.string.isRequired,
        isPlaceholder: propTypes.bool
    }

    static defaultProps = {
      category: 'Other',
      isPlaceholder: false,
      currencyType: 'usd'
    }

    render(){
        const { 
            name, 
            category, 
            date, 
            amount,
            isPlaceholder,
            currencyType,
            style
        } = this.props;
        const categoryIcon = EXPENSE_CATEGORIES_ICONS[category] || EXPENSE_CATEGORIES_ICONS['Other'];
        return(
            <PlainCard
            	className={`vc-expense-card ${isPlaceholder && 'placeholder' || ''}`}
            	style={style}
            >
                <div className='vc-expense-card-inner'>
                	<div className={`expense-category-bar bg-${this.categoryColor(category)}`}></div>
                	<h4 className='expense-category'>
                		{/* <i className={`material-icons text-${this.categoryColor(category)}`}>{ categoryIcon }</i> */}
                		<i className={`icon ion-md-${categoryIcon} text-${this.categoryColor(category)}`}></i>
                		<span>{category}</span>
                	</h4>
                	<h4 className='expense-name'>{name}</h4>
                	<h4 className='expense-date'>{this.convertExpenseDate(date)}</h4>
                	<h4 className='expense-amount'>
                		{CURRENCIES_SIGNS[currencyType] || CURRENCIES_SIGNS['usd']}
                		{thousand(parseInt(amount).toFixed(2))}
                	</h4>
                </div>
            </PlainCard>
        )
    }

    convertExpenseDate(expensedate){
    	let date = new Date(expensedate);
    	if(date.getTime() == 'Invalid Date'){
    		return '';
    	}
    	return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
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