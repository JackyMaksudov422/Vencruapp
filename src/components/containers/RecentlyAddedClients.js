import * as React from 'react';
import withRouter from 'react-router-dom/withRouter';
import Link from 'react-router-dom/Link';
import { connect } from 'react-redux';
import DashboardSection from '../presentation/DashboardSection';
import PlainCard from '../presentation/PlainCard';
import { GET_CLIENTS } from '../../configs/api.config';
import MessageParser from '../../helpers/MessageParser';
import Typography from '../presentation/Typography';
import Button from '../presentation/Button';
import BusinessCard from '../presentation/BusinessCard';
import findIndex from 'lodash/findIndex';
import propTypes from 'prop-types';

class RecentlyAddedClients extends React.Component {

    static propTypes = {
        businessId: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
        setRef: propTypes.func
    }

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
        if (prevProps.clientCreate.isFetching &&
            !this.props.clientCreate.isFetching &&
            !this.props.clientCreate.errorMessage
        ) {
            if (this.state.data.length > 0) {
                this.addClient(this.props.clientCreate.data);
            }
            else {
                this.fetch();
            }
        }
        if (prevProps.clientUpdate.isFetching &&
            !this.props.clientUpdate.isFetching &&
            !this.props.clientUpdate.errorMessage
        ) {
            if (this.state.data.length > 0) {
                this.updateClient(this.props.clientUpdate.data);
            }
            else {
                this.fetch();
            }
        }
    }

    render() {
        const { data, errorMessage, isFetching } = this.state;
        console.log(data);
        return (
            <DashboardSection
                title='Recently Added'
            >
                <div className='row'>
                    <div className='col-md-4 add-client-column'>
                        <Link to='clients/create'>
                            <PlainCard
                                transparent
                                vAlign='center'
                                hAlign='center'
                                className='new-client-card'
                            >
                                <i className='material-icons add-icon'>add_circle_outline</i>
                                <span className='add-label'>New Client</span>

                            </PlainCard>
                        </Link>
                    </div>
                    {!errorMessage &&
                        <React.Fragment>
                            <div className='col-md-4'>
                                <BusinessCard
                                    placeholder={(!data || data.length < 1) && true || false}
                                    personName={`${data && data[0] && data && data[0]['firstname'] || ' '} ${data && data[0] && data && data[0]['lastname'] || ' '}`}
                                    businessName={`${data && data[0] && data && data[0]['companyname'] || ' '}`}
                                    businessStreetAddress={`${data && data[0] && data && data[0]['street'] || ' '}`}
                                    businessCityName={`${data && data[0] && data && data[0]['city'] || ' '}`}
                                    businessCountryName={`${data && data[0] && data && data[0]['country'] || ' '}`}
                                    businessPhoneNumber={`${data && data[0] && data && data[0]['phonenumber'] || ' '}`}
                                />
                            </div>
                            <div className='col-md-4'>
                                <BusinessCard
                                    placeholder={(!data || data.length < 2) && true || false}
                                    personName={`${data && data[1] && data && data[1]['firstname'] || ' '} ${data && data[1] && data && data[1]['lastname'] || ' '}`}
                                    businessName={`${data && data[1] && data && data[1]['companyname'] || ' '}`}
                                    businessStreetAddress={`${data && data[1] && data && data[1]['street'] || ' '}`}
                                    businessCityName={`${data && data[1] && data && data[1]['city'] || ' '}`}
                                    businessCountryName={`${data && data[1] && data && data[1]['country'] || ' '}`}
                                    businessPhoneNumber={`${data && data[1] && data && data[1]['phonenumber'] || ' '}`}
                                />
                            </div>
                        </React.Fragment>
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

    fetch() {
        GET_CLIENTS({
            businessId: this.props.businessId,
            page: 1,
            fromDate: '',
            toDate:  '',
            sortBy:  'date_created',
            sortOrder:  'desc' || undefined,
            limit: 2
        }).then(response => {
            this.setState({
                isFetching: false,
                errorMessage: null,
                data: response.clients
            });
        }).catch(error => {
            this.setState({
                isFetching: false,
                errorMessage: MessageParser(error, 'An error occured while fetching recently added clients.')
            });
        });
    }

    addClient(newClient) {
        if (newClient &&
            newClient.constructor == Object &&
            typeof newClient.firstname == 'string'
        ) {
            let list = [...this.state.data];
            list.unshift(newClient);
            this.setState({
                data: list.slice(0, 2)
            })
        }
    }

    updateClient(clientInfo) {
        if (clientInfo &&
            clientInfo.constructor == Object &&
            typeof clientInfo.firstname == 'string'
        ) {
            let list = [...this.state.data];
            let clientIndex = findIndex(list, item => item.id == clientInfo.id)
            if (clientIndex !== -1) {
                list.splice(clientIndex, 1, Object.assign({}, list[clientIndex], clientInfo));
                this.setState({
                    data: list
                });
            }
        }
    }
}

const mapStateToProps = ({
    userInfo,
    clientCreate,
    clientUpdate
}) => ({
    userInfo,
    clientCreate,
    clientUpdate
});

export default connect(mapStateToProps)(withRouter(RecentlyAddedClients));