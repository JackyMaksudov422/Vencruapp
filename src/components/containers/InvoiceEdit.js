import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import { FIND_INVOICE, UPDATE_INVOICE } from '../../configs/api.config';
import InvoicePaper from './InvoicePaper';

class InvoiceEdit extends React.Component {
    state = {
        invoiceId: '',
        invoiceData: null
    };

    render(){
        const { invoiceData } = this.state
        const { currentBusiness, history, userInfo } = this.props

        return (
            <div>
                {invoiceData &&
                    <InvoicePaper
                        image={currentBusiness && currentBusiness.logourl}
                        mode="write"
                        invoiceNumber={invoiceData.invoicenumber}
                        itemsList={invoiceData.items}
                        selectedItems={invoiceData.items.map(x => x.productid)}
                        themeColor={invoiceData.themeColor}
                        fontStyle={invoiceData.fontStyle}
                        template={invoiceData.template}
                        currency={currentBusiness ? currentBusiness.currency : ''}
                        onCancel={() => history.push('/sales')}
                        onPaymentChange={data => this.handlePaymentChange(data)}
                        onSave={this.onSave}
                        // bankAccount={invoiceData.bankAccount}
                        sender={{
                            name: currentBusiness ? currentBusiness.companyname : '',
                            address: this.getBusinessFullAddress(),
                            email: userInfo ? userInfo.email : '',
                            phoneNumber: currentBusiness ? currentBusiness.phonenumber : undefined,
                        }}
                        client={invoiceData.client.id || 0}
                        notes={invoiceData.notes}
                    />
                }
            </div>
        );
    }

    componentDidMount() {
		const invoiceId = this.props.match.params.invoiceId;
		if (invoiceId) {
			this.setState({
				invoiceId: JSON.parse(invoiceId),
			}, () => {
                this.fetch()
            });
        }
    }
    
    onSave = (data) => {
		UPDATE_INVOICE(data)
			.then(res => {
				this.props.showSnackbar('Invoice has been updated!',{
					variant: 'success'
				});
				return this.props.history.replace('/sales');
			})
			.catch(err => {
				this.props.showSnackbar('There was an error in processing your request. Please try again.',{
					variant: 'error'
				});
			});
    };
    
    fetch(){
		const { currentbusinessid } = this.props.userInfo
		const invoiceId = this.state.invoiceId;
		
		FIND_INVOICE(currentbusinessid, invoiceId).then((res) => {
            this.setState({
                invoiceData: res
            })
		})
    }
    
    getBusinessFullAddress() {
		const { currentBusiness } = this.props;
		if (!currentBusiness) {
			return '';
		}
		return (
			<span>
				{currentBusiness.address}
				{`, `}
				{currentBusiness.state ? currentBusiness.state + ', ' : ' '}
				{currentBusiness.country}
				{`.`}
			</span>
		);
	}

}

const mapStateToProps = ({ currentBusiness, userInfo }) => ({
	userInfo: userInfo.data,
	currentBusiness: currentBusiness.data
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
	showSnackbar: ActionCreators.showSnackbar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InvoiceEdit));