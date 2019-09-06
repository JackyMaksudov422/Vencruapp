import * as React from 'react';
import withRouter from 'react-router-dom/withRouter';
import Link from 'react-router-dom/Link';
import { connect } from 'react-redux';
import DashboardSection from '../presentation/DashboardSection';
import PlainCard from '../presentation/PlainCard';
import { GET_OVERDUE_INVOICES, GET_UNPAID_INVOICES } from '../../configs/api.config';
import MessageParser from '../../helpers/MessageParser';
import Typography from '../presentation/Typography';
import Button from '../presentation/Button';
import InvoiceCard from '../presentation/InvoiceCard';
import findIndex from 'lodash/findIndex';
import propTypes from 'prop-types';
import find from 'lodash/find';

// const DUMMY_DATA = [
// 	{
// 		id: 'finioi',
// 		invoicenumber: '0034343',
// 		clientname: 'The Motors',
// 		issuedate: '2018-08-24T08:06:00',
// 		amount: '400000'
// 	},
// 	{
// 		id: '3894h3',
// 		invoicenumber: '0055639',
// 		clientname: 'Pills Pills Pills',
// 		issuedate: '2018-03-16T08:06:00',
// 		amount: '30034'
// 	},
// 	{
// 		id: 'uierib',
// 		invoicenumber: '0087482',
// 		clientname: 'Paper Machette',
// 		issuedate: '2018-05-10T16:09:00',
// 		amount: '709090'
// 	},
// ];

class RecentInvoices extends React.Component {

    constructor(){
        super()
        this.state = {
            isFetching: false,
            data: [],
            errorMessage: false
        };
    }

    static propTypes = {
        setRef: propTypes.func,
        status: propTypes.oneOf([
        	'overdue',
        	'not-paid',
        ]),
        title: propTypes.string.isRequired,
    };

    static defaultProps = {
      status: 'not-paid'
    }

    componentDidMount() {
        this.fetch();
        if(this.props.setRef){
            this.props.setRef(this);
        }
    }

    componentWillUnmount(){
        if(this.props.setRef){
            this.props.setRef(undefined);
        }
    }

    render() {
        const { data, errorMessage, isFetching } = this.state;
        const { currentBusiness, title, status } = this.props;
        
        if(!currentBusiness) return null;        
        return (
            <DashboardSection
                title={title}
            >
                <div className='row'>
                	{ !errorMessage && data && data.map(({
                			invoicenumber,
                			client,
                			date_created,
                			amountdue,
                			id
                		}, index) => (
	                        <div 
	                        	className='col-md-4'
	                        	key={index}
	                        	style={{minHeight: '100%'}}
	                        >
	                            <InvoiceCard
	                            	id={id}
	                            	status={status}
	                            	number={invoicenumber}
	                            	clientName={`${client.firstname} ${client.lastname}`}
	                            	date={date_created}
	                            	amount={amountdue}
	                            	currency={currentBusiness.currency}
	                        		style={{minHeight: '100%'}}
	                            />
	                        </div>
	                	))
                    }

                    { data && data.length === 0 && <div className="col-12 null-recent-invoice">
                            <PlainCard>
                                Nothing Here Yet 
                            </PlainCard>
                    </div>}

                    {errorMessage && !isFetching && !data &&
                        <div className='col-md-8'>
                            <PlainCard
                                className='pv40 ph20'
                            >
                                <div className='text-center h142 flex-centered'>
                                    <Typography
                                        align='center'
                                        className='mb15'
                                    >
                                        {errorMessage}
                                    </Typography>
                                    <Button
                                        variant='primary'
                                        size='sm'
                                        onClick={() => this.fetch()}
                                    >Try Again</Button>
                                </div>
                            </PlainCard>
                        </div>
                    }
                </div>
            </DashboardSection>
        );
    }

    fetch() {
        const { currentBusiness, status} = this.props;
        const INVOICE_CALL = this.props.status == "not-paid" ? GET_UNPAID_INVOICES : GET_OVERDUE_INVOICES        
        INVOICE_CALL({
            businessId: currentBusiness && currentBusiness.id,
            page: 1,
            fromDate: '',
            toDate:  '',
            sortBy:  'date_created',
            sortOrder:  'desc',
            status: status,
            limit: 3
        }).then(response => {
            console.log("WITH RESPONSE : ", response)
            this.setState({
                isFetching: false,
                errorMessage: null,
                data: response.invoices
            });
        }).catch(error => {
            this.setState({
                isFetching: false,
                errorMessage: MessageParser(error, 'An error occured while fetching recently added invoices.')
            });
        });
    }

    addExpense(newExpense) {
        if (newExpense &&
            newExpense.constructor == Object &&
            typeof newExpense.firstname == 'string'
        ) {
            let list = [...this.state.data];
            list.unshift(newExpense);
            this.setState({
                data: list.slice(0, 2)
            })
        }
    }

    updateExpense(invoiceInfo) {
        if (invoiceInfo &&
            invoiceInfo.constructor == Object &&
            typeof invoiceInfo.firstname == 'string'
        ) {
            let list = [...this.state.data];
            let invoiceIndex = findIndex(list, item => item.id == invoiceInfo.id)
            if (invoiceIndex !== -1) {
                list.splice(invoiceIndex, 1, Object.assign({}, list[invoiceIndex], invoiceInfo));
                this.setState({
                    data: list
                });
            }
        }
    }
}

const mapStateToProps = ({
    userInfo
}) => ({
    userInfo: userInfo.data,
    currentBusiness: userInfo.data && 
		userInfo.data.business &&
		userInfo.data.business.constructor === Array &&
		userInfo.data.business.find(
			item => item.id == userInfo.data.currentbusinessid
		)
});

export default connect(mapStateToProps)(withRouter(RecentInvoices));