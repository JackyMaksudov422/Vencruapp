import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import DashboardSection from '../presentation/DashboardSection';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import Request from '../../helpers/Request';
import Typography from '../presentation/Typography';
import PlainCard from '../presentation/PlainCard';
import { storageStore } from '../../helpers/Storage';
import { STORAGE_KEYS } from '../../configs/storage.config';

/**
 * component template
 */
let Template = ({
    fn, 
    currentBusiness
}) => (
    <div className='vc-expenses-home'>
            {currentBusiness &&
                <DashboardSection>
                    {/* <PlainCard
                        collapsable
                        className='text-center'
                    > */}
                    <div className="feedback-box">
                        <Typography
                            align='center'
                            variant='active'
                            className='mb40'
                            size='lg'
                        >
                            Join us in developing Vencru to better serve your growing business
                            </Typography>
                        <img
                            src={require('../../assets/Know_Cus.png')}
                            style={{ maxWidth: 100 }}
                            alt='icon'
                        />
                        <Typography
                            className='spanned mb20 mt20'
                        >
                            Collaborate on the evolution{` `}
                            of Vencru by leaving feedback, suggesting,{` `}
                            voting and <br />commenting on ideas you believe in.
                            </Typography>
                        <div className="feedback-btns">
                            <button
                                className="vc-button vc-button-success vc-button-medium"
                                onClick={fn.addFeedback}
                            >
                                Leave feedback
                                 </button>
                            <button className="vc-button vc-button-primary">Enter ideas portal</button>
                        </div>

                        <div className='spanned mb20'></div>
                </div>
                    {/* </PlainCard> */}
                </DashboardSection>
            }
    </div>
);

class FeedbackHome extends React.Component {
    
    constructor(){
        super();

        this.request = new Request();
        
        this.state = {
            isFetching: false
        };
    }

    componentDidMount(){
        if(this.props.userInfo.data){
            this.fetch();
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(!isEqual(prevProps.userInfo, this.props.userInfo)){
            if(this.props.userInfo && !this.state.ready){
                this.fetch();
            }
        }

        if(!isEqual(prevState.filter, this.state.filter) && !prevState.isFetching){
            this.handleFilterChanged(this.state.filter);
        }

        if( prevProps.expenseCreate.isFetching && 
            !this.props.expenseCreate.isFetching &&
            !this.props.expenseCreate.errorMessage
        ){
            if( this.state.page > 1 || 
                this.state.ToDate || 
                this.state.ToDate
            ){
                this.setState({
                    filter: Object.assign({}, this.state.filter, {
                        page: 1,
                        FromDate: null,
                        ToDate: null
                    })
                });
            }
            else{
                this.fetch();
            }

            if(this.recentlyAdded){
                this.recentlyAdded.fetch();
            }

            if(this.quickStatistics){
                this.quickStatistics.fetch();
            }
        }

        if( prevProps.expenseUpdate.isFetching && 
            !this.props.expenseUpdate.isFetching &&
            !this.props.expenseUpdate.errorMessage
        ){
            this.updateExpensesList(this.props.expenseUpdate.data);

            if(this.recentlyAdded){
                this.recentlyAdded.fetch();
            }

            if(this.quickStatistics){
                this.quickStatistics.fetch();
            }
        }
    }

    render(){
        return <Template 
            {...this.prps()} 
            fn={this.fn()} 
        />;
    }

    fn = () => ({
        handleExpenseSelect: (expenseId) => this.handleExpenseSelect(expenseId),
        handleSelectall: () => this.handleSelectall(),
        handleExpenseAction: (expenseId, action) => this.handleExpenseAction(expenseId, action),
        isDeleting: (expenseId) => this.isDeleting(expenseId),
        handleTableDeleteClick: (selectedExpenses) => this.handleTableDeleteClick(selectedExpenses),
        handleSearchChange: (value) => this.handleSearchChange(value),
        handleSortChange: (value) => this.handleSortChange(value),
        handleFilterChange: (value) => this.handleFilterChange(value),
        handlePaginationNav: (value) => this.handlePaginationNav(value),
        dismissFilterDialog: () => this.dismissFilterDialog(),
        submitDateFilter: () => this.submitDateFilter(),
        handleFilterDialogClose: () => this.handleFilterDialogClose(),
        handleFilterInputChange: (field, event) => this.handleFilterInputChange(field, event),
        setRef: (name, ref) => this.setRef(name, ref),
        addFeedback: () => this.props.history.push('feedback/create'),
        handleWelcomeCardCollapse: () => storageStore(STORAGE_KEYS.EXPENSE_WELCOME_CARD_CLOSED, 1),
        handleActionSelect: (action) => {},
        convertExpenseDate: (date) => this.convertExpenseDate(date)
    })

    prps = () => ({
        userInfo: this.props.userInfo.data,
        currentBusiness: this.currentBusiness(),
        isFetching: this.state.isFetching,
        selected: this.state.selected,
        showWelcomeCard: this.state.showWelcomeCard
    })

    setRef(name, ref){
        if(!this[name]){
            this[name] = ref;
        }
    }

    currentBusiness(){
        const { data } = this.props.userInfo;
        if(data && data.business){
            return find(data.business, item => item.id === data.currentbusinessid) || null;
        }
        return null;
    }

    fetch(){
        this.setState({ 
            isFetching: true 
        });
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

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showSnackbar: ActionCreators.showSnackbar,
    showAlertDialog: ActionCreators.showAlertDialog,
    hideAlertDialog: ActionCreators.hideAlertDialog
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FeedbackHome));
