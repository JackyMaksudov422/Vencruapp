import * as React from 'react';
import {
    Route, 
    Switch,
    Router
} from 'react-router-dom';
import {
    SignUpPage, 
    NotFoundPage, 
    OnboardingPage, 
    DashboardPage,
    LoginPage,
    AccountVerificationPage,
    LogoutPage,
    ForgotPasswordPage,
    ResetPasswordPage,
    ClientsPage,
    ClientDetailsPage,
    DeletedClientsPage,
    ItemsPage,
    DeletedItemsPage,
    ExpensesPage,
    ProfileSettingsPage,
    ProfileSettingsPage2,
    BusinessSettingsPage,
    PaymentSettingsPage,
    TeamMembersPage,
    SalesPage,
    FeedbackPage,
    InvoiceDisplayPage,
    AdminDashboard
} from './_kernel';
import Buttons from '../components/containers/UI/Buttons';
import Inputs from '../components/containers/UI/Inputs';
import Other from '../components/containers/UI/Other';
import withRouter from 'react-router-dom/withRouter';

const App = ({history}) => {
    return(
    	<Router history={history}>
	        <Switch>
	            <Route exact path="/"  component={DashboardPage} />
	            <Route exact path="/clients/deleted-list"  component={DeletedClientsPage} />                
	            <Route path="/clients"  component={ClientsPage} />                
	            <Route exact path="/items/deleted-list"  component={DeletedItemsPage} />
	            <Route path="/items"  component={ItemsPage} />
	            <Route path="/expenses"  component={ExpensesPage} />
	            <Route path="/sales"  component={SalesPage} />
	            <Route exact path="/settings"  component={ProfileSettingsPage} />
                <Route exact path="/settings/profile"  component={ProfileSettingsPage2} />
	            <Route exact path="/settings/business"  component={BusinessSettingsPage} />
	            <Route exact path="/settings/payment"  component={PaymentSettingsPage} />
	            <Route exact path="/settings/team-members"  component={TeamMembersPage} />
	            <Route exact path="/login"  component={LoginPage} />
	            <Route exact path="/logout"  component={LogoutPage} />
	            <Route exact path="/sign-up"  component={SignUpPage} />
	            <Route exact path="/forgot-password"  component={ForgotPasswordPage} />
	            <Route exact path="/reset-password"  component={ResetPasswordPage} />
	            <Route exact path="/verify-account"  component={AccountVerificationPage} />
	            <Route exact path="/onboarding"  component={OnboardingPage} />
	            <Route exact path="/ui/buttons"  component={Buttons} />
	            <Route exact path="/ui/inputs"  component={Inputs} />
	            <Route exact path="/ui/other"  component={Other} />
                <Route path="/feedback" component={FeedbackPage} />
                <Route path="/inv" component={InvoiceDisplayPage} />
                <Route path="/xbg92b/chika.ofili" component={AdminDashboard} />
	            <Route component={NotFoundPage} />
	        </Switch>
        </Router>
    );
};

export default withRouter(App);