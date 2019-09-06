import React from 'react';
import QuickStatisticsCard from './QuickStatisticsCard';
import QuickStatisticsCardMobile from './QuickStatisticsCardMobile';
import { http, endpoints } from '../../configs/http.config';
import { EXPENSES_QUICK_STATISICS } from '../../configs/api.config';
import { CURRENCIES_SIGNS } from '../../configs/data.config';
import propTypes from 'prop-types';
import DashboardSection from './DashboardSection';
import Typography from './Typography';
import Button from './Button';
import ContentCircularLoader from './ContentCircularLoader';
import {connect} from 'react-redux';
import { thousand } from '../../helpers/Misc';

class ExpensesQuickStatistics extends React.Component {

    static propTypes = {
        businessId: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
        setRef: propTypes.func,
        currency: propTypes.string
    };

    static defaultProps = {
        currency: 'usd'
    };

   

    state = {
        isFetching: false,
        data: null,
        errorMessage: null,
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

    componentDidUpdate(prevProps, prevState){
        if( prevProps.expenseCreate.isFetching && 
            !this.props.expenseCreate.isFetching &&
            !this.props.expenseCreate.errorMessage
        ){
            this.fetch();
        }
    }
    render() {
        const {
            errorMessage,
            data,
            isFetching
        } = this.state;

        const {
        	currency
        } = this.props;

        return (
            <DashboardSection
                title='Expenses Summary'
            >
                { !errorMessage && data &&
                    <div className='row desktop-items'>
                        <div className='col-md-4'>
                            <QuickStatisticsCard
                                placeholder={isFetching && !data}
                                title='All time Total'
                                icon={<img src={require('../../assets/item-one.png')}/>}
                                value={`${CURRENCIES_SIGNS[currency]}${data && thousand(data.totalexpenses) || 0}`}
                            />
                        </div>
                        <div className='col-md-4'>
                            <QuickStatisticsCard
                                placeholder={isFetching && !data}
                                title='Expenses this month'
                                icon={<img src={require('../../assets/item-two.png')}/>}
                                value={`${CURRENCIES_SIGNS[currency]}${data && thousand(data.monthlytotal) || 0}`}
                            />
                        </div>
                        <div className='col-md-4'>
                            <QuickStatisticsCard
                                placeholder={isFetching && !data}
                                title='Highest expense'
                                icon={<img src={require('../../assets/item-three.png')}/>}
                                value={data.highestexpense}
                            />
                        </div>
                    </div>
                }
                { !errorMessage && data &&
                    <div className='row mobile-items'>
                        <div className='col-md-4'>
                            <QuickStatisticsCardMobile
                                placeholder={isFetching && !data}
                                title='All time Total'
                                icon={<img src={require('../../assets/itemp1.png')}/>}
                                value={`${CURRENCIES_SIGNS[currency]}${data && thousand(data.totalexpenses) || 0}`}
                                mobilelayout={this.props.cls} 
                            />

                        </div>
                        <div className='col-md-4'>
                            <QuickStatisticsCardMobile
                                placeholder={isFetching && !data}
                                title='Expenses this month'
                                icon={<img src={require('../../assets/itemp2.png')}/>}
                                value={`${CURRENCIES_SIGNS[currency]}${data && thousand(data.monthlytotal) || 0}`}
                            />
                        </div>
                        <div className='col-md-4'>
                            <QuickStatisticsCardMobile
                                placeholder={isFetching && !data}
                                title='Highest expense'
                                icon={<img src={require('../../assets/itemp3.png')}/>}
                                value={data.highestexpense}
                            />
                        </div>
                    </div>
                }
                { errorMessage && !data && 
                    <div className='spanned text-center'>
                        <Typography align='center' className='mb15'>{errorMessage}</Typography>
                        <Button
                            size='sm'
                            onClick={() => this.fetch()}
                        >Try Again</Button>
                    </div>
                }
                { isFetching && !data && <ContentCircularLoader/> }
            </DashboardSection>
        )
    }

    fetch() {
        this.setState({
            isFetching: true,
            errorMessage: null
        });

        setTimeout(() => {
            EXPENSES_QUICK_STATISICS(this.props.businessId)
                .then(response => {
                    this.setState({
                        isFetching: false,
                        data: response
                    })
                }).catch(error => {
                    this.setState({
                        isFetching: false,
                        errorMessage: typeof error == 'string' && error.length > 0 && error || 'Failed to load, please try again.'
                    })
                });
        }, 1000);
    }
}

const mapStateToProps = ({expenseCreate}) => ({
    expenseCreate
});

export default connect(mapStateToProps, null)(ExpensesQuickStatistics);