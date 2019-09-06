import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FeedbackForm from './FeedbackForm';
import PageDialog from '../presentation/PageDialogs';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import find from 'lodash/find';
import { GET_NEW_EXPENSE_NUMBER } from '../../configs/api.config';
import { DEBUG } from '../../configs/app.config';

/**
 * component template
 */
let Template = ({
  fn,
  isFetching,
  expenseNumber,
  currentBusiness,
  onSubmit
}) => (
    <PageDialog
      backdropClose={false}
      escClose={false}
      show={true}
      className='expense-form-page-dialog'
      onDismiss={method => fn.handlePageDialogDismiss(method)}
    >
      {expenseNumber &&
        <FeedbackForm
          setRef={(ref) => fn.setForm(ref)}
          title='Feedback'
          submitLabel='Submit Expenses'
          onCancel={() => fn.handleCancelPress()}
          disabled={isFetching}
          expenseNumber={expenseNumber}
          currentBusiness={currentBusiness}
          onSubmit={onSubmit}
        />
      }
    </PageDialog>
  );

class FeedbackModal extends React.Component {
  state = {
    isFetching: false,
  };

  componentDidMount() {
    this.generateNewExpenseNumber();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.expenseCreate.isFetching &&
      !this.props.expenseCreate.isFetching
    ) {
      if (this.props.expenseCreate.errorMessage) {
        this.props.showSnackbar(
          this.props.expenseCreate.errorMessage,
          { variant: 'error' }
        );
      }
      else {
        this.props.showSnackbar(
          'New expense created.',
          { variant: 'success' }
        );
        this.props.history.goBack();
      }
    }
  }

  render() {
    return <Template
      {...this.prps()}
      onSubmit={this.props.onSubmit}
      fn={this.fn()}
    />;
  }

  fn = () => ({
    handleSubmit: (data) => this.handleSubmit(data),
    handlePageDialogDismiss: (method) => this.handlePageDialogDismiss(method),
    setForm: (form) => this.setForm(form),
    handleCancelPress: () => this.handleCancelPress(),
    generateNewExpenseNumber: () => this.generateNewExpenseNumber(),
  })

  prps = () => ({
    isFetching: this.props.expenseCreate.isFetching,
    isGeneratingExpenseNumber: this.state.isGeneratingExpenseNumber,
    expenseNumber: this.state.expenseNumber,
    errorMessage: this.state.errorMessage,
    currentBusiness: this.currentBusiness()
  })

  setForm(form) {
    this.form = form;
  }

  currentBusiness() {
    const { data } = this.props.userInfo;
    if (data && data.business) {
      return find(data.business, item => item.id === data.currentbusinessid) || null;
    }
    return null;
  }

  handleCancelPress() {
    if (this.props.expenseCreate.isFetching) {
      return;
    }
    if (!this.form ||
      !this.form.isUpdated()
    ) {
      this.props.history.goBack();
      return;
    }
    this.props.showAlertDialog(
      ` `,
      'Are you sure you want to cancel?',
      [
        { text: 'Yes', onClick: () => this.props.history.goBack() },
        { text: 'No' }
      ]
    )
  }

  handlePageDialogDismiss(method) {
    switch (method) {
      case 'backdrop':
      case 'escape':
        this.handleCancelPress();
        break;
      default:
        // do nothing
        break;
    }
  }

  generateNewExpenseNumber() {
    let currentBusiness = this.currentBusiness();
    this.setState({
      isGeneratingExpenseNumber: true,
      errorMessage: null
    });

    GET_NEW_EXPENSE_NUMBER(currentBusiness.id).then(expensenumber => {
      this.setState({
        isGeneratingExpenseNumber: false,
        expenseNumber: expensenumber
      });
    }).catch(error => {
      let errorMessage = 'An error occured, please try again.';
      if (typeof error === 'string' &&
        error.trim().length > 0
      ) {
        errorMessage = error;
      }

      if (typeof error !== 'string' && DEBUG) {
        console.error(error);
      }

      this.setState({
        isGeneratingExpenseNumber: false,
        errorMessage: errorMessage
      });
    });
  }
}

const mapStateToProps = ({ userInfo, expenseCreate }) => ({
  userInfo,
  expenseCreate
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  showAlertDialog: ActionCreators.showAlertDialog,
  showSnackbar: ActionCreators.showSnackbar,
  doCreateExpense: ActionCreators.doCreateExpense
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FeedbackModal));