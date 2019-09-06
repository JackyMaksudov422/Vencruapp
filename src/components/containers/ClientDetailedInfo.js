import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BusinessCard from '../presentation/BusinessCard';
import ClientNote from '../presentation/ClientNote';

import { FIND_CLIENT, GET_CLIENT_HISTORY, ADD_PAYMENT, ADD_CLIENT_NOTE } from '../../configs/api.config'
import ClientRevenueCard from '../presentation/ClientRevenueCard';

import Table from '../presentation/Table';
import TableHead from '../presentation/TableHead';
import TableBody from '../presentation/TableBody';
import Checkbox from '../presentation/Checkbox';
import TableRow from '../presentation/TableRow';
import TableCell from '../presentation/TableCell';

import backButton from '../../assets/back.png'
import addButton from '../../assets/add-circle-outline.png'

import PaymentAdd from '../containers/PaymentAdd'

import OnboardedWrapper from '../../components/wrappers/OnboardedWrapper';
import AuthWrapper from '../../components/wrappers/AuthWrapper';
import PageWrapper from '../../components/wrappers/PageWrapper';

import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';

import moment from 'moment';
import { thousand } from '../../helpers/Misc';

/**
 * component template
 */
let Template = ({ fn, clientData, clientHistory, showPaymentForm, currentBusiness }) => {
    let list = [];
    if(clientHistory) list = clientHistory.clienthistorydata

    let summaryData = clientHistory.summarydata

    return (
        <div className='app-authenticated-body'>

            <div className="row">
                <div className="col-6">
                    <span className="client-back-button client-page-button" onClick={fn.backClicked}>
                        <img src={backButton} alt="" />
                        Clients
                </span>
                </div>
                <div className='col-md-3 mid-col-btn'></div>

                <div className="col-md-3 col-6 float-right ">
                    <div className='float-right'>
                        {/* <span className="edit-button client-page-button" onClick={fn.editClicked}>Edit</span> */}
                        {/* <span className="add-invoice-button client-page-button" onClick={fn.addNewIncoiceClicked}>Add Invoice</span> */}
                        {/* <span className="save-button client-page-button" onClick={fn.createClientNote}>Save</span> */}
                        <button className="bg-red-light hover:bg-red-dark text-white py-2 px-3 mr-2 rounded" onClick={fn.editClicked}>Edit</button>                        
                        <button className="bg-brand-blue hover:bg-blue-dark text-white py-2 px-3 mr-2 rounded" onClick={fn.addNewIncoiceClicked}>Add Invoice</button>
                        <button className="bg-green-dark hover:bg-green-darker text-white py-2 px-3 rounded" onClick={fn.createClientNote}>Save</button>
                    </div>
                </div>

                <hr />
            </div>

            <div className="row mt-5">
                <div className="col-12 col-sm-5 mb-8 md:mb-0 lg:md-0">

                    <BusinessCard
                        className="client-business-card"
                        placeholder={(!clientData || clientData.length < 1) && true || false}
                        personName={`${clientData.lastname || " "} ${clientData.firstname || " "}`}
                        businessName={clientData.companyname || " "}
                        businessStreetAddress={clientData.street || " "}
                        businessCityName={clientData.city || " "}
                        businessCountryName={clientData.country || " "}
                        businessPhoneNumber={clientData.phonenumber || " "}
                    />
                    <ClientNote className="d-md-block" text={clientData.note} onChange={fn.onNoteChanged} />
                </div>

                <div className="col-12 col-sm-7">
                    {summaryData && currentBusiness &&
                        <ClientRevenueCard outstandingRevenue={summaryData.totaloutstanding} totalIncome={summaryData.totalearning} currency={currentBusiness.currency} />
                    }
                </div>
            </div>

            <div className="table-container">
                <div className="header">
                    <h3 className="payment-header">
                        All Payments from {`${clientData.lastname || " "} ${clientData.firstname || " "}`}
                    </h3>
                    {/* <span className="header-button" onClick={fn.addPaymentClicked}>
                            <img src={addButton} />
                            Add Payment
                        </span> */}
                </div>

                <Table>
                    {/* table head */}
                    <TableHead>
                        <TableRow type='th'>
                            <TableCell showOnMobile>
                                Date
                        </TableCell>
                            <TableCell showOnMobile>
                                Invoice
                        </TableCell>
                            <TableCell>
                                Type
                        </TableCell>
                            <TableCell showOnMobile>
                                Payment Made
                        </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {/* table body */}
                        {list && list.constructor == Array && list.map((item, index) => {
                            return (
                                <TableRow withSeparator key={index}>
                                    <TableCell showOnMobile>
                                        {moment(item.date).format('DD/MM/YYYY')}
                                    </TableCell>
                                    <TableCell showOnMobile>
                                        {item.invoicenumber}
                                    </TableCell>
                                    <TableCell>
                                        {item.paidwith}
                                    </TableCell>
                                    <TableCell showOnMobile>
                                        {currentBusiness.currency}
                                        {thousand(parseInt(item.amount))}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            <PaymentAdd
                show={showPaymentForm}
                onDismiss={fn.onPaymentDismissed}
                onCancel={fn.onPaymentDismissed}
                onSubmit={fn.onSubmit}
            />
        </div>
    )
};

class ClientDetailedInfo extends React.Component {
    state = {
        clientData: {},
        clientHistory: [],
        showPaymentForm: false
    };

    componentDidMount() {
        const { userid, currentbusinessid } = this.props.userInfo.data
        const clientId = this.props.match.params.clientId
        FIND_CLIENT(currentbusinessid, clientId).then((res) => {
            this.setState({
                clientData: res
            })
        })

        GET_CLIENT_HISTORY({ businesId: currentbusinessid, clientId: clientId, userId: userid }).then((res) => {
            this.setState({
                clientHistory: res
            })
        })
    }

    submitForm = (data) => {
        ADD_PAYMENT(data).then((res) => {
            console.log(data);
            console.log("Added")
        }).catch((err) => {
            console.log('ERR');
            console.log(err);
        })

    }

    render() {
        return (
            <AuthWrapper
                returnable
            >
                <OnboardedWrapper>
                    <PageWrapper
                        fullPage
                        menu='Clients'
                        requiresEmailConfirmed
                    >

                        <Template
                            {...this.prps()}
                            fn={this.fn()}
                        />

                    </PageWrapper>
                </OnboardedWrapper>
            </AuthWrapper>
        );
        // return <Template 
        //     {...this.prps()} 
        //     fn={this.fn()} 
        // />;
    }

    backClicked = () => {
        this.props.history.push("/clients")
    }

    editClicked = () => {
        this.props.history.push(`/clients/${this.props.match.params.clientId}/edit`)
    }

    addNewIncoiceClicked = () => {
        this.props.history.push(`/clients/${this.props.match.params.clientId}/create-invoice`)
    }

    addPaymentClicked = () => {
        this.setState({
            showPaymentForm: true
        })
    }

    onPaymentDismissed = () => {
        this.setState({
            showPaymentForm: false
        })
    }

    onNoteChanged = (note) => {
        this.setState({
            clientData: Object.assign({}, this.state.clientData, { note: note })
        })
    }

    createClientNote = (note) => {
        let clientdata = this.state.clientData;
        let data = {};

        data.clientid = clientdata.id;
        data.businessid = clientdata.businessid
        data.userid = clientdata.userid
        data.note = clientdata.note
        if (clientdata.notes != "") {
            ADD_CLIENT_NOTE(data).then((res) => {
                this.props.showSnackbar(
                    'Client info updated successfully!',
                    {
                        variant: 'success'
                    }
                );
            })
            .catch(error => {
                this.props.showSnackbar(
                    'Oops! Could not updated client information.',
                    {
                        variant: 'error'
                    }
                );
            })
        }
    }

    fn = () => ({
        // bound functions go here
        createClientNote: this.createClientNote,
        backClicked: this.backClicked,
        editClicked: this.editClicked,
        addNewIncoiceClicked: this.addNewIncoiceClicked,
        addPaymentClicked: this.addPaymentClicked,
        onPaymentDismissed: this.onPaymentDismissed,
        onNoteChanged: this.onNoteChanged,
        onSubmit: this.submitForm
    })

    prps = () => ({
        // template props go here
        clientData: this.state.clientData,
        clientHistory: this.state.clientHistory,
        showPaymentForm: this.state.showPaymentForm,
        currentBusiness: this.props.currentBusiness
    })
}

const mapStateToProps = ({ userInfo, currentBusiness }) => ({
    userInfo: userInfo,
    currentBusiness: currentBusiness.data || null
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showSnackbar: ActionCreators.showSnackbar
}, dispatch);

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(ClientDetailedInfo));
