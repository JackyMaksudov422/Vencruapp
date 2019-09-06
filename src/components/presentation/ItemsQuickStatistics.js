import React from 'react';
import QuickStatisticsCard from './QuickStatisticsCard';
import QuickStatisticsCardMobile from './QuickStatisticsCardMobile';
import { PRODUCTS_SUMMARY } from '../../configs/api.config';
import propTypes from 'prop-types';
import DashboardSection from './DashboardSection';
import Typography from './Typography';
import Button from './Button';
import ContentCircularLoader from './ContentCircularLoader';
import { connect } from 'react-redux';

class ItemsQuickStatistics extends React.Component {

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
        console.log(this.props.tes);
        this.fetch();
        if (this.props.setRef) {
            this.props.setRef(this);
        }
    }

    componentWillUnmount() {
        if (this.props.setRef) {
            this.props.setRef(undefined);
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
                {!errorMessage && data && 

                    <div className='row desktop-items'>
                        <div className='col-md-4'>
                            <QuickStatisticsCard
                                placeholder={isFetching && !data}
                                title='Total Number Of Products'
                                icon={<img src={require('../../assets/item-one.png')} />}
                                value={`${data && data.totalproducts || 0}`}
                                mobilelayout={this.props.cls} 
                            />
                        </div>
                        <div className='col-md-4'>
                            <QuickStatisticsCard
                                placeholder={isFetching && !data}
                                title='Number of items sold (this month)'
                                icon={<img src={require('../../assets/item-two.png')} />}
                                value={`${data && data.monthlytotal || 0}`}
                            />
                        </div>
                        <div className='col-md-4'>
                            <QuickStatisticsCard
                                placeholder={!data || !data.repeatclients}
                                title='Most sold item (this month)'
                                icon={<img src={require('../../assets/item-three.png')} />}
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
                                title='Total Number Of Products'
                                icon={<img src={require('../../assets/itemp1.png')} />}
                                value={`${data && data.totalproducts || 0}`}
                                mobilelayout={this.props.cls}
                            />
                        </div>
                        <div className='col-md-4'>
                            <QuickStatisticsCardMobile
                                placeholder={isFetching && !data}
                                title='Number of items sold (this month)'
                                icon={<img src={require('../../assets/itemp2.png')} />}
                                value={`${data && data.monthlytotal || 0}`}
                            />
                        </div>
                        <div className='col-md-4'>
                            <QuickStatisticsCardMobile
                                placeholder={!data || !data.repeatclients}
                                title='Most sold item (this month)'
                                icon={<img src={require('../../assets/itemp3.png')} />}
                                value={`${data && data.repeatclients || 0}`}
                            />
                        </div>
                    </div>                 


                }


                {errorMessage && !data &&
                    <div className='spanned text-center'>
                        <Typography align='center' className='mb15'>{errorMessage}</Typography>
                        <Button
                            size='sm'
                            onClick={() => this.fetch()}
                        >Try Again</Button>
                    </div>
                }
                {isFetching && !data && <ContentCircularLoader />}
            </DashboardSection>
        )
    }

    fetch() {
        this.setState({
            isFetching: true,
            errorMessage: null
        });

        setTimeout(() => {
            PRODUCTS_SUMMARY(this.props.businessId)
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

export default connect()(ItemsQuickStatistics);