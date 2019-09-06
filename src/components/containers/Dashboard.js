import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import GetStartedCard from '../presentation/GetStartedCard';
import PageModal from '../presentation/PageModal';
import PlainCard from '../presentation/PlainCard';
import Typography from '../presentation/Typography';
import BusinessSummary from '../presentation/BusinessSummary';
import PendingRevenueCard from '../presentation/PendingRevenueCard';
import TotalProfitCard from '../presentation/TotalProfitCard';
import IncomeSourcesCard from '../presentation/IncomeSourcesCard';
import ExpensesCard from '../presentation/ExpensesCard';
import Button from '../presentation/Button';
import { thousand, percentage } from '../../helpers/Misc';
import find from 'lodash/find';
import { CURRENCIES_SIGNS } from '../../configs/data.config.js';

import { ADD_GOAL, GET_BUSINESS_SUMMARY, GET_EXPENSES_SUMMARY, GET_GOAL, GET_INCOME_SOURCES, GET_PROFIT } from '../../configs/api.config'
import BusinessGoalForm from './BusinessGoalForm';

const goalsIcon = require('../../assets/goals_green.png');
/**
 * component template
 */
let Template = ({
    fn, 
    userInfo,
    currentBusiness, 
    isFetching,
    businessSetupCompleted,
    summaryInfo,
    expenseSourcesData,
    incomeSourcesData,
    profitData,
    goalData,
    showBusinessGoalsForm

}) => (
    <div className='app-authenticated-body'>
        { userInfo &&  <GetStartedCard userInfo={userInfo} step={1}/> }

        {currentBusiness && showBusinessGoalsForm && !isFetching &&
            <PageModal
                backdropClose={false}
                escClose={false} 
                show={true}
                className=''
                onDismiss={method => fn.handlePageDialogDismiss(method)}
            >
                <BusinessGoalForm
                    data={{ targetrevenue: goalData.monthlytarget || 0 }}
                    onSubmit={(data) => fn.handleGoalsSubmit(data)}
                    onCancel={fn.cancelBusinessGoalsForm}
                    currentBusiness={currentBusiness} />
            </PageModal>
        }
        <span>&nbsp;</span>
        {currentBusiness && 
            <div>
                <h2 className="text-black text-lg font-bold mb-3"> </h2>
                <div className='w-full flex bg-white p-2'>
                    <img className="w-16 mr-6" src={goalsIcon} alt=""/>
                    <div className='w-3/4 text-center my-auto'>
                        <div className='text-green text-base font-semibold'>
                            {CURRENCIES_SIGNS[currentBusiness.currency]}{thousand(parseFloat(goalData.TotalIncomeRecived))}
                            <span className='text-xs'> ({percentage(goalData.TotalIncomeRecived, goalData.monthlytarget)}% of GOAL)</span>
                        </div>
                        <div className='w-4/5 bg-green'>
                            _
                        </div>
                    </div>
                    <div className='w-1/5 text-center'>
                        <p className="text-green text-base font-semibold">Monthly Goal</p>
                        <p className='text-black text-3xl'>
                            {CURRENCIES_SIGNS[currentBusiness.currency]}{thousand(parseFloat(goalData.monthlytarget).toFixed(2))}
                        </p>
                        <div className='text-brand-blue text-xs font-semibold cursor-pointer' onClick={fn.showBusinessGoalsForm}>Review Goal</div>
                    </div>
                </div>
            </div>
        }
        {/* <PlainCard className='text-center mt30 mb30'>
            <Typography className='spanned' size='lg' variant='active' align='center'>Just One More Step</Typography>
            <Typography className='spanned' align='center' className='mb30'>
                Create a Flutterwave or Paystack account to be able to receive payments on Vencru<br/>from your clients.
            </Typography>
            <div className='spanned mb30'>
                <Link to='/settings/payment' className='vc-button vc-button-primary'>Set Up</Link>
            </div>
        </PlainCard> */}

        {/* Change prop passing to follow pattern */}
        <BusinessSummary 
            incomeReceived={summaryInfo.incomeReceived}
            outstandingRevenue={summaryInfo.outstandingRevenue}
            totalExpenses={summaryInfo.totalExpenses}
            totalCustomers={summaryInfo.totalCustomers}
            mostSoldItem={summaryInfo.mostSoldItem}
            profit={summaryInfo.incomeReceived - summaryInfo.totalExpenses}
            className='mt-12 mb30'/>

        {/* <PendingRevenueCard 
            placeholder 
            className='mb30'
        />

        <TotalProfitCard
            placeholder
            className='mb30'
            data={profitData}
        />

        <IncomeSourcesCard
            placeholder
            className='mb30'
            data={incomeSourcesData}
        />

        <ExpensesCard
            placeholder
            data={expenseSourcesData}
        /> */}
    </div>
);

class Dashboard extends React.Component {
    constructor(){
        super()
        this.state = {
            isFetching: false,
            summaryInfo : {},
            expenseSourcesData : [],
            incomeSourcesData : [],
            profitData : [],
            goalData: [],
            showBusinessGoalsForm: false
        }
    }

    // componentWillReceiveProps(nextProps){
    //     this.getDashboardData(nextProps)
    // }

    componentDidMount(){
        this.getDashboardData()
    }

    getDashboardData = () => {
        if(this.props.userInfo.data){
            this.getSummaryData()
            this.getExpensesData()
            this.getIncomeSourcesData()
            this.getProfitData()
            this.getGoalData()
        }
    }

    getSummaryData = () => {
        const { userid, currentbusinessid } = this.props.userInfo.data
        GET_BUSINESS_SUMMARY(userid, currentbusinessid).then((res) => {
            
            this.setState({
                summaryInfo : {
                    incomeReceived : res.totalincomereceived,
                    outstandingRevenue : res.totaloutstanding,
                    totalExpenses : res.totalexpenses,
                    totalCustomers: res.totalcustomersold,
                    mostSoldItem: res.mostsolditem
                }
            })

        })
    }

    getExpensesData = () => {
        const { userid, currentbusinessid } = this.props.userInfo.data
        GET_EXPENSES_SUMMARY(userid, currentbusinessid).then((res) => {
            this.setState({
                expenseSourcesData : res
            })
        })        
    }

    getIncomeSourcesData = () => {
        const { userid, currentbusinessid } = this.props.userInfo.data
        GET_INCOME_SOURCES(userid, currentbusinessid).then((res) => {
            this.setState({
                incomeSourcesData : res
            })
        })
    }

    getProfitData = () => {
        const { userid, currentbusinessid } = this.props.userInfo.data
        GET_PROFIT(userid, currentbusinessid).then((res) => {
            this.setState({
                profitData : res
            })
        })
    }
    
    getGoalData = () => {
        this.setState({ isFetching: true })
        const { userid, currentbusinessid } = this.props.userInfo.data
        GET_GOAL(userid, currentbusinessid).then((res) => {
            this.setState({
                goalData : res,
                isFetching: false
            })
        })
    }

    render(){
        return <Template 
            {...this.prps()} 
            fn={this.fn()} 
        />;
    }

    fn = () => ({
        // bound functions go here
        handleGoalsSubmit: (data) => this.handleGoalsSubmit(data),
        cancelBusinessGoalsForm: () => this.cancelBusinessGoalsForm(),
        showBusinessGoalsForm: () => this.showBusinessGoalsForm(),
        handlePageDialogDismiss: (method) => this.handlePageDialogDismiss(method),
    });

    prps = () => ({
        isFetching: this.state.isFetching,
        userInfo: this.props.userInfo.data || null,
        currentBusiness: this.currentBusiness(),
        businessSetupCompleted: this.props.businessSetup.done,     
        summaryInfo : this.state.summaryInfo,   
        expenseSourcesData : this.state.expenseSourcesData,
        incomeSourcesData : this.state.incomeSourcesData,
        profitData : this.state.profitData,
        goalData: this.state.goalData,
        showBusinessGoalsForm:  this.state.showBusinessGoalsForm
    });


    currentBusiness(){
        const { data } = this.props.userInfo;
        if(data && data.business){
            return find(data.business, item => item.id === data.currentbusinessid) || null;
        }
        return null;
    }

    showBusinessGoalsForm = () => {
        this.setState({
            showBusinessGoalsForm: true
        })
    };

    cancelBusinessGoalsForm = () => {
        this.setState({
            showBusinessGoalsForm: false
        })
    };

    handleGoalsSubmit = (data) => {
        ADD_GOAL(data).then((res) => {
            this.props.showSnackbar('Goal Added!', {variant: 'success'});
            this.setState({
                showBusinessGoalsForm: false
            }, this.getDashboardData())
        }).catch((err) => {
            this.props.showSnackbar(err, {variant: 'error'});
        })
    }

    handlePageDialogDismiss(method){
        switch(method){
            case 'backdrop':
            case 'escape':
                this.setState({
                    showBusinessGoalsForm: false
                })
            break;
            default:
                break;
        }
    }
}

const mapStateToProps = ({userInfo, businessSetup}) => ({ 
    userInfo: userInfo,
    businessSetup: businessSetup,    
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
	showSnackbar: ActionCreators.showSnackbar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Dashboard));