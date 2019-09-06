import React from 'react';
import QuickStatisticsCard from './QuickStatisticsCard';
import QuickStatisticsCardMobile from './QuickStatisticsCardMobile';
import { http, endpoints } from '../../configs/http.config';
import { CLIENTS_QUICK_STATISICS } from '../../configs/api.config';
import propTypes from 'prop-types';
import DashboardSection from './DashboardSection';
import Typography from './Typography';
import Button from './Button';
import ContentCircularLoader from './ContentCircularLoader';
import {connect} from 'react-redux';

class ClientsQuickStatistics extends React.Component {

    static propTypes = {
        businessId: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
        setRef: propTypes.func
    }

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
        if( prevProps.clientCreate.isFetching && 
            !this.props.clientCreate.isFetching &&
            !this.props.clientCreate.errorMessage
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

        return (
            <DashboardSection
                title='Summary'
                rightContent={null}
            >
                { !errorMessage && data &&
                    <div className='row desktop-items'>
                        <div className='col-md-4'>
                            <QuickStatisticsCard
                                placeholder={isFetching && !data}
                                title='Total customers'
                                icon={<img src={require('../../assets/total_customers.png')}/>}
                                value={`${data && data.totalclient || 0}`}
                            />
                        </div>
                        <div className='col-md-4'>
                            <QuickStatisticsCard
                                placeholder={isFetching && !data}
                                title='New customers (this month)'
                                icon={<img src={require('../../assets/revenue.png')}/>}
                                value={`${data && data.thismonthclients || 0}`}
                            />
                        </div>
                        <div className='col-md-4'>
                            <QuickStatisticsCard
                                placeholder={isFetching && !data}
                                title='No of repeat customers'
                                icon={<img src={require('../../assets/repeat_customers.png')}/>}
                                value={`${data && data.repeatclients || 0}`}
                            />
                        </div>
                    </div>
                }

                {!errorMessage && data &&
                    <div className='row mobile-items'>
                        <div className='col-md-4'>
                            <QuickStatisticsCardMobile
                                placeholder={isFetching && !data}
                                title='Total customers'
                                icon={<img src={require('../../assets/itemp1.png')} />}
                                value={`${data && data.totalclient || 0}`}
                                mobilelayout={this.props.cls}
                            />
                        </div>
                        <div className='col-md-4'>
                            <QuickStatisticsCardMobile
                                placeholder={isFetching && !data}
                                title='New customers (this month)'
                                icon={<img src={require('../../assets/itemp2.png')} />}
                                value={`${data && data.thismonthclients || 0}`}
                            />
                        </div>
                        <div className='col-md-4'>
                            <QuickStatisticsCardMobile
                                placeholder={!data || !data.repeatclients}
                                title='No of repeat customers'
                                icon={<img src={require('../../assets/itemp3.png')} />}
                                value={`${data && data.repeatclients || 0}`}
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
            CLIENTS_QUICK_STATISICS(this.props.businessId)
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

const mapStateToProps = ({clientCreate}) => ({
    clientCreate
});

export default connect(mapStateToProps, null)(ClientsQuickStatistics);