import React from 'react'
import { thousand } from '../../helpers/Misc';
import { CURRENCIES_SIGNS } from '../../configs/data.config';
import Button from '../presentation/Button';
import moment from 'moment';

const paidIcon = require('../../assets/invoice-paid.png');
const depositPaidIcon = require('../../assets/invoice-deposit-paid.png');
const overdueIcon = require('../../assets/invoice-overdue.png');
const logo = require('../../assets/logo.png');

export default class InvoiceLayout extends React.Component {
    constructor(){
        super()
    }

    render(){
        const { currentBusiness, general, client, items, color, formatDates} = this.props
        
        // Process tax and discount amounts
        let taxamount = 0
        let discountamount = 0

        if(general.discount){
            discountamount = general.discount
        }

        if(general.tax){
            let taxableAmount = parseFloat(general.subtotal) - parseFloat(discountamount)
            taxamount = (taxableAmount / 100) * general.tax
        }

        return (
            <div className={`text-${color}`}>
                <div className='px-2 mb-12 bg-white'>
                    <div className={`flex flex-row mb-2 py-3 border-b border-${color} md:hidden`}>
                        <div className='flex flex-col w-1/3'>
                            <span className='mb-6'>
                                <img src={general.image} className='w-16 ml-6' alt=""/>
                            </span>
                            <div className="font-semibold mb-3">
                                Billed To
                            </div>

                            {client &&
                            <div className='leading-normal'>
                                
                                <div className='text-black text-base'>{`${client.firstname || " "} ${client.lastname || " "}`}</div>
                                <div className={`text-${color}`}>{client.companyemail}</div>
                                <p className='text-grey'>{client.phonenumber}</p>
                            </div>
                            }
                        </div>
                        <div className='flex flex-col w-1/3 m-auto'>
                            <div className='text-center'> 
                                {general.invoicestatus &&
                                    <img src={this.returnIcon(general.invoicestatus)} className='w-48' />
                                }  
                            </div>
                        </div>
                        <div className='w-1/3 text-right'>
                            <div className='mb-8'>
                                <p className='font-semibold mb-1'>Invoice number</p>
                                <span className='text-black'>
                                    { general.invoicenumber }
                                </span>
                            </div>
                            <div className='mb-8'>
                                <p className='font-semibold mb-1'>Date of Issue</p>
                                <span className='text-black'>
                                {(formatDates) ? moment(general.issue_date).format('DD/MM/YYYY') : general.issue_date}
                                </span>
                            </div>
                            {general && general.due_date &&
                                <div>
                                    <p className='font-semibold mb-1'>Due Date</p>
                                    <span className='text-black'>
                                        {(formatDates) ? moment(general.due_date).format('DD/MM/YYYY') : general.due_date}
                                    </span>
                                </div>
                            }
                        </div>
                    </div>
                
                    <div className='flex flex-col'>
                        <div className='w-full mb-4'>
                            <span className='font-semibold'>Description</span>
                            <span className='float-right font-semibold'>Total Amount</span>
                        </div>
                        {items && items.constructor == Array && items.map((item, index) => {
                            let amount = item.quantity * item.price
                            return (
                                <div className='flex flex-row w-full mb-4 text-black' key={index}>
                                    <div className='flex flex-col w-2/3 leading-normal'>
                                        <p className='text-base'>{item.description}</p>
                                        <p className='text-grey'>{item.quantity}(Qty) at {`${CURRENCIES_SIGNS[currentBusiness.currency] || '$'}${item.price}`} a unit</p>
                                    </div>
                                    <div className='w-1/3 text-base text-right'>
                                        {CURRENCIES_SIGNS[currentBusiness.currency] || '$'}
                                        {thousand(parseInt(item.amount || amount).toFixed(2))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className='flex flex-row mb-2'>
                        <div className='w-1/4'>
                        </div>
                        <div className='w-3/4 text-black text-base text-right'>
                            <div className='flex flex-row mb-3'>
                                <div className='w-2/5'>Subtotal</div>
                                <div className='w-3/5'>
                                    {CURRENCIES_SIGNS[currentBusiness.currency] || '$'}
                                    {thousand(parseInt(general.subtotal).toFixed(2))}
                                </div>
                            </div>
                            {(general.discount > 0) &&
                                <div className='flex flex-row mb-3'>
                                    <div className='w-2/5'>Discount</div>
                                    <div className='w-3/5'>
                                        -{CURRENCIES_SIGNS[currentBusiness.currency] || '$'}
                                        {thousand(parseFloat(discountamount).toFixed(2))}
                                    </div>
                                </div>
                            }
                            {(general.tax > 0) &&
                                <div className='flex flex-row mb-3'>
                                    <div className='w-2/5'>{general.tax}% Tax</div>
                                    <div className='w-3/5'>
                                        {CURRENCIES_SIGNS[currentBusiness.currency] || '$'}
                                        {thousand(parseFloat(taxamount).toFixed(2))}
                                    </div>
                                </div>
                            }
                            <div className={`flex flex-row mb-2 py-3 border-t-2 border-${color}`}>
                                <span className={`w-1/2 font-semibold text-${color}`}>Amount Due ({CURRENCIES_SIGNS[currentBusiness.currency] || '$'})</span>
                                <span className='w-1/2'>
                                    {CURRENCIES_SIGNS[currentBusiness.currency] || '$'}
                                    
                                    {thousand(parseInt(general.amountdue).toFixed(2))}
                                </span>
                            </div>
                            <div className={`flex flex-row mb-3`}>
                                <span className={`w-1/2 font-semibold text-green`}>Amount Paid ({CURRENCIES_SIGNS[currentBusiness.currency] || '$'})</span>
                                <span className='w-1/2'>
                                    {CURRENCIES_SIGNS[currentBusiness.currency] || '$'}
                                    
                                    {thousand(parseInt(general.amountpaid || 0).toFixed(2))}
                                </span>
                            </div>
                        </div>
                    </div>

                    {general.accountname &&
                        <div className='mb-8'>
                            <p className='font-semibold text-base mb-3'>Payment Instructions</p>
                            <p className='text-black mb-3'>Business Bank Account Details</p>
                            <div className='leading-normal'>
                                <p>Bank Name: {general.bankname}</p>
                                <p>Account Number: {general.accountnumber}</p>
                                <p>Account Name: {general.accountname}</p>
                            </div>
                        </div>
                    }

                    {general.notes &&
                        <div className=''>
                            <p className='font-semibold text-base mb-3'>Notes and Terms</p>
                            <span className='text-black text-base'>
                                {general.notes}
                            </span>
                        </div>
                    }
                    <span>&nbsp;</span>
                    <div className='border-t-2 border-brand-blue text-center text-black py-2'>
                        <div className="flex justify-center items-center">
                            <span>Powered by </span>
                            <img src={logo} className='w-12' />
                        </div>
				    </div>
                </div>
            </div>
        ) 
    }

    returnIcon(status){
        switch(status){
            case 'fully paid':
                return paidIcon
            case 'not paid':
                break;
            case 'deposit paid':
                return depositPaidIcon
            case 'overdue': 
                return overdueIcon
            default:
                break;
        }
    }

}