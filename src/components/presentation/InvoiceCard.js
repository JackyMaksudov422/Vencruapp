import React from 'react';
import PlainCard  from './PlainCard';
import propTypes from 'prop-types';
import { thousand } from '../../helpers/Misc';
import { 
	CURRENCIES_SIGNS
} from '../../configs/data.config';
import moment from 'moment';

export default class InvoiceCard extends React.PureComponent{

    static propTypes = {
        id: propTypes.string.isRequired,
        number: propTypes.string.isRequired,
        clientName: propTypes.string.isRequired,
        date: propTypes.string.isRequired,
        amount: propTypes.string.isRequired,
        currency: propTypes.string,
        status: propTypes.oneOf([
        	'not-paid',
        	'overdue',
        	'paid',
        	'canceled',
        ])
    }

    static defaultProps = {
      currency: 'usd',
      status: 'not-paid'
    }

    render(){

        const { 
        	id,
			number,
			clientName,
			date,
            status,
            style,
        } = this.props;

        return(
            <PlainCard
            	className={`vc-invoice-card`}
            	style={style}
            >
            	{/* { status !== 'paid' &&
	            	<div className='spanned text-right'>
	            		<button type='button' className='mark-as-paid-button'>
	            			Marks as Paid
	            		</button>
	            	</div>
            	} */}


                <div className='vc-invoice-card-inner mt-2'>
                	<p className='mb-1'>{ number }</p>
                	<p className='mb-1 text-black'>{ clientName }</p>
                	<p className='mb-2'>{moment(date).format('DD/MM/YY')}</p>
                	<h4 className='invoice-amount'>{this.transformAmount()}</h4>
                </div>
                {/* <div className='vc-invoice-card-inner'>
                	<h4 className='invoice-number'>{ number }</h4>
                	<h4 className='client-name'>{ clientName }</h4>
                	<h4 className='issue-date'>{this.convertInvoiceDate()}</h4>
                	<h4 className='invoice-amount'>{ this.transformAmount() }</h4>
                </div> */}
                <div className={`invoice-status invoice-status-${status}`}>
                	{ status == 'not-paid' && <span>Not Paid</span> }
                	{ status == 'overdue' && <span>Overdue</span> }
                	{ status == 'paid' && <span>Paid</span> }
                	{ status == 'canceled' && <span>Canceled</span> }
                </div>
            </PlainCard>
        )
    }

   	transformAmount(){
   		const { 
   			amount, 
   			currency
   		} = this.props;
   		return `${CURRENCIES_SIGNS[currency] || '$'}${thousand(amount)}`
   	}

    convertInvoiceDate(){
    	const { 
   			date
   		} = this.props;
    	let issueDate = new Date(date);
    	if(issueDate.getTime() == 'Invalid Date'){
    		return '';
    	}
    	return `${issueDate.getMonth() + 1}/${issueDate.getDate()}/${issueDate.getFullYear()}`;
    }
}