import * as React from 'react';
import withRouter from 'react-router-dom/withRouter';
import Link from 'react-router-dom/Link';
import { connect } from 'react-redux';
import DashboardSection from '../presentation/DashboardSection';
import PlainCard from '../presentation/PlainCard';
import { GET_EXPENSES } from '../../configs/api.config';
import MessageParser from '../../helpers/MessageParser';
import Typography from '../presentation/Typography';
import Button from '../presentation/Button';
import ExpenseCard from '../presentation/ExpenseCard';
import findIndex from 'lodash/findIndex';
import propTypes from 'prop-types';
import find from 'lodash/find';

class RecentlyAddedExpenses extends React.Component {

    static propTypes = {
        businessId: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
        setRef: propTypes.func
    };

    state = {
        isFetching: false,
        data: [],
        errorMessage: false
    };

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

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.expenseCreate.isFetching &&
            !this.props.expenseCreate.isFetching &&
            !this.props.expenseCreate.errorMessage
        ) {
            if (this.state.data.length > 0) {
                this.addExpense(this.props.expenseCreate.data);
            }
            else {
                this.fetch();
            }
        }
        if (prevProps.expenseUpdate.isFetching &&
            !this.props.expenseUpdate.isFetching &&
            !this.props.expenseUpdate.errorMessage
        ) {
            if (this.state.data.length > 0) {
                this.updateExpense(this.props.expenseUpdate.data);
            }
            else {
                this.fetch();
            }
        }
    }

    render() {
        const { data, errorMessage, isFetching } = this.state;
        const { businessId } = this.props;
        const userInfo = this.props.userInfo.data;
        const currentBusiness = userInfo && this.currentBusiness(businessId, userInfo.business);
        return (
            <DashboardSection cls='expense-title'
                title='Most Recent'
            >
                <div className='row'>
                    <div
                    	className='col-md-2 add-expense-column' 
                    	style={{minHeight: '100%'}}
                    >
                        <Link to='expenses/create'>
                            <PlainCard
                                transparent
                                vAlign='center'
                                hAlign='center'
                                className='new-expense-card'
                                style={{minHeight: '100%'}}
                            >
                                <i className='material-icons add-icon'>add_circle_outline</i>
                                <span className='add-label'>New Expense</span>

                            </PlainCard>
                        </Link>
                    </div>

                	{ !errorMessage && data && data.map(({
                			description,
                			totalamount,
                			expensedate,
                			category,
                		}, index) => (
	                        <div 
	                        	className='col-md-2'
	                        	key={index}
	                        	style={{minHeight: '100%'}}
	                        >
	                            <ExpenseCard
	                            	name={description}
                                    amount={totalamount}
                                    currencyType={currentBusiness.currency}
	                            	date={expensedate}
	                            	category={category}
	                        		style={{minHeight: '100%'}}
	                            />
	                        </div>
	                	))

                    }
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

    currentBusiness(businessId, list){
    	return find(list, item => item.id == businessId);
    }

    fetch() {
        GET_EXPENSES({
            businessId: this.props.businessId,
            page: 1,
            fromDate: '',
            toDate:  '',
            sortBy:  'date_created',
            sortOrder:  'desc',
            limit: 4
        }).then(response => {
            this.setState({
                isFetching: false,
                errorMessage: null,
                data: response.expenses
            });
        }).catch(error => {
            this.setState({
                isFetching: false,
                errorMessage: MessageParser(error, 'An error occured while fetching recently added expenses.')
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

    updateExpense(expenseInfo) {
        if (expenseInfo &&
            expenseInfo.constructor == Object &&
            typeof expenseInfo.firstname == 'string'
        ) {
            let list = [...this.state.data];
            let expenseIndex = findIndex(list, item => item.id == expenseInfo.id)
            if (expenseIndex !== -1) {
                list.splice(expenseIndex, 1, Object.assign({}, list[expenseIndex], expenseInfo));
                this.setState({
                    data: list
                });
            }
        }
    }
}

const mapStateToProps = ({
    userInfo,
    expenseCreate,
    expenseUpdate
}) => ({
    userInfo,
    expenseCreate,
    expenseUpdate
});

export default connect(mapStateToProps)(withRouter(RecentlyAddedExpenses));