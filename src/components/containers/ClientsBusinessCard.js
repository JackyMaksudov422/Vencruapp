import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PageDialog from '../presentation/PageDialogs';
import OverlayProgress from '../presentation/OverlayProgress';
import { FIND_CLIENT } from '../../configs/api.config';
import find from 'lodash/find';
import MessageParser from '../../helpers/MessageParser';
import Button from '../presentation/Button';
import BusinessCard from '../presentation/BusinessCard';

/**
 * component template
 */
let Template = ({fn, isFetching, data, errorMessage}) => (
    <PageDialog
        backdropClose={false}
        escClose={false} 
        show={true}
        className='client-business-card-page-dialog'
        onDismiss={method => fn.handlePageDialogDismiss(method)}
    >
        {!errorMessage &&
            <div className='business-card-container'>
                <BusinessCard
                    className='business-card-card'
                    placeholder={isFetching}
                    personName={`${data ? data['firstname'] : ' '} ${data ? data['lastname'] : ' '}`}
                    businessName={`${data ? data['companyname'] : ' '}`}
                    businessStreetAddress={`${data ? data['street'] : ' '}`}
                    businessCityName={`${data ? data['city'] : ' '}`}
                    businessCountryName={`${data ? data['country'] : ' '}`}
                    businessPhoneNumber={`${data ? data['phonenumber'] : ' '}`}
                />
            </div>
        }

        {!errorMessage &&
            <div className='spanned text-center pt20'>
                <Button
                    variant='link-primary'
                    onClick={() => fn.dismiss()}
                >Close</Button>
            </div>
        }

        { errorMessage &&
            <div className='client-fetch-error'>
                <h1 className='error-title'>Failed to load client business card</h1>
                <p className='error-description'>{ errorMessage }</p>
                <div className='actions-container'>
                    <Button
                        variant='link-primary'
                        size='sm'
                        onClick={() => fn.dismiss()}
                    >Close</Button>
                    <Button
                        size='sm'
                        onClick={() => fn.fetch()}
                    >Try Again</Button>
                </div>
            </div>
        }

        { isFetching && <OverlayProgress/> }
    </PageDialog>
);

class ClientsBusinessCard extends React.Component {
    state = {
        data: null,
        isFetching: false,
        errorMessage: null
    };

    componentDidMount(){
        this.fetch();
    }

    render(){
        return <Template 
            {...this.prps()} 
            fn={this.fn()} 
        />;
    }

    fn = () => ({
        handlePageDialogDismiss: (method) => this.handlePageDialogDismiss(method),
        fetch: () => this.fetch(),
        dismiss: () => this.dismiss(),
    })

    prps = () => ({
        isFetching: this.state.isFetching,
        data: this.state.data,
        errorMessage: this.state.errorMessage
    })

    clientId(){
        const { match } = this.props;
        return match && match.params && parseInt(match.params.clientId);
    }

    fetch(){
        let business = this.props.currentBusiness;
        let clientId = this.clientId();
        this.setState({
            isFetching: true,
            errorMessage: null
        });
        FIND_CLIENT(business.id, clientId).then(response => {
            this.setState({
                isFetching: false,
                errorMessage: null,
                data: response
            });
        }).catch(errorMessage => {
            this.setState({
                isFetching: true,
                errorMessage: MessageParser(errorMessage, 'An error occured while fetching the clients info, please try again shortly.')
            });
        });
    }

    dismiss(){
        this.props.history.goBack();
    }

    handlePageDialogDismiss(method){
        switch(method){
            case 'backdrop':
            case 'escape':
                this.dismiss();
            break;
            default:
                // do nothing
            break;
        }
    }
}

const mapStateToProps = ({userInfo, currentBusiness}) => ({
    userInfo,
    currentBusiness: currentBusiness.data
})

export default connect(mapStateToProps)(withRouter(ClientsBusinessCard));