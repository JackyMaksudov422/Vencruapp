import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import toastr from 'toastr';
import FormComponent from './FormComponent';
import Input from '../presentation/Input';
import Button from '../presentation/Button';
import propTypes from 'prop-types';
import OverlayProgress from '../presentation/OverlayProgress';
import isEqual from 'lodash/isEqual';
import { ActionCreators } from '../../data/actionCreators';
import { bindActionCreators } from 'redux';
const logo = require('../../assets/logo.png');

/**
 * component template
 */
let Template = ({
    fn,
    form,
    title,
    disabled,
    isLoading,
}) => (
        <form className='vc-expense-form'>
            <div className='vc-expense-form-header modal-form-head'>
                <span className='title modal-head'>
                    {title}
                </span>
            </div>
            <div className='vc-expense-form-body expense-body-form'>
                {isLoading && <OverlayProgress />}
                <div className='form-fields'>
                    <div className='form-fields-inner'>
                        <div className='row'>
                            <div className='row fields-row text-area'>
                                <div className='col-md-12 text-body'>
                                    <Input
                                        id="modalContent"
                                        placeholder="Please share your comments or suggestions"
                                        multiline={true}
                                        noIcon
                                        disabled={disabled}
                                        // value={form.Description}
                                        onFocus={() => fn.handleFieldFocus('Description')}
                                        onBlur={() => fn.handleFieldBlur('Description')}
                                        variant={fn.fieldIsTouched('Description') && fn.fieldHasError('Description') && !fn.fieldIsFocused('Description') ? 'danger' : 'default'}
                                        onChange={(event) => fn.handleFieldValueChange('Description', event.target.value)}
                                    />
                                </div>
                                <div className='col-sm-6 text-right but-right'>
                                    <div className="feedback-buttons">
                                        <Button
                                            variant='link-gray'
                                            type='button'
                                            className='cancel-button feedback-cancel-button'
                                            onClick={() => fn.handleCancelPress()}
                                        >
                                            <span id="feedback-cancel-but">Cancel</span>
                                    </Button>
                                        <button
                                            onClick={(ev) => fn.handlSubmit(ev)}
                                            id="saveButton"
                                        >
                                            Save
                                    </button>
                                    </div>
                                </div>
                                <div className='vc-expense-form-footer footer-form'>
                                    <span className='powered-by power-by'>Powered by</span>
                                    <img
                                        src={logo}
                                        className='brand img-logo'
                                        alt='logo'
                                    />
                                </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        
        </form >
    );

class ExpenseForm extends FormComponent {

    static propTypes = {
        setRef: propTypes.func
    }

    constructor() {
        super(null, {
            isLoading: false
        });
    }

    componentDidMount() {
        if (typeof this.props.setRef == 'function') {
            this.props.setRef(this);
        }
        if (this.props.data) {
            this.setState({
                form: {
                    Description: this.props.data.description || '',
                    Category: this.props.data.category || '',
                    Date: this.props.data.expensedate || '',
                    Vendor: this.props.data.vendor || '',
                    PaidWith: this.props.data.paidwith || '',
                    TotalAmount: this.props.data.totalamount || '',
                },
                currentReceipt: this.props.data.receiptimageurl || null,
            })
        }
    }

    componentWillUnmount() {
        if (typeof this.props.setRef == 'function') {
            this.props.setRef(undefined);
        }
    }

    renderMethod() {
        return <Template
            {...this.prps()}
            fn={this.fn()}
        />;
    }

    fn = () => ({
        // bound functions go here
        fieldHasError: (field) => this.fieldHasError(field),
        fieldIsTouched: (field) => this.fieldIsTouched(field),
        fieldIsFocused: (field) => this.fieldIsFocused(field),
        handleFieldBlur: (field) => this.handleFieldBlur(field),
        handleFieldFocus: (field) => this.handleFieldFocus(field),
        handleFieldValueChange: (field, value) => this.handleFieldValueChange(field, value),
        handlSubmit: (ev) => this.handlSubmit(ev),
        handleCancelPress: this.props.onCancel ? () => this.props.onCancel() : null,
        setImageSelector: (ref) => this.setImageSelector(ref),
        handleFileSelected: (event) => this.handleFileSelected(event),
        clearSelectedImage: () => this.clearSelectedImage(),
        onClick: () => this.onSubmit(),
        convertExpenseDate: (date) => this.convertExpenseDate(date),
    })

    prps = () => ({
        title: this.props.title,
        currentBusiness: this.props.currentBusiness,
        isLoading: this.state.isLoading
    })

    handlSubmit(ev) {
        ev.preventDefault();

        const feedback = document.getElementById("modalContent").value;
        const sanitizedFeedback = feedback.trim();
        const headers = new Headers({
            "content-type": "application/json"
        });

        const feedbackData = {
            emailaddress: `${this.props.userInfo.email}`,
            details: sanitizedFeedback,
        };

        if (sanitizedFeedback !== '') {
            this.setState({ isLoading: true });
            fetch("https://api.vencru.com/api/admin/addfeedback", {
                method: "POST",
                body: JSON.stringify(feedbackData),
                headers
            })
                .then(res => res.json())
                .then(data => {
                    this.setState({ isLoading: false });
                    toastr.success("Thank you for the feedback!");
                    document.getElementById("modalContent").value = '';
                    this.props.history.goBack();
                })
                .catch(error => {
                    this.setState({ isLoading: false });
                    toastr.error("Feedback not sent!");
                    this.setState({ submitted: false });
                });
        } else {
            toastr.error('Please write a feedback');
        }
    }

    isUpdated() {
        const { data } = this.props;
        const { form, initialForm } = this.state;

        if (data) {
            let dataForm = {
                Description: data.description || '',
                Category: data.category || '',
                Date: data.expensedate || '',
                Vendor: data.vendor || '',
                PaidWith: data.paidwith || '',
                TotalAmount: data.totalamount || '',
                Receipt: data.receipt || null,
            };
            return !isEqual(dataForm, form);
        }

        return !isEqual(initialForm, form);
    }
}

const mapStateToProps = ({ userInfo }) => ({
    userInfo: userInfo.data
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showSnackbar: ActionCreators.showSnackbar,
    showAlertDialog: ActionCreators.showAlertDialog
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ExpenseForm));