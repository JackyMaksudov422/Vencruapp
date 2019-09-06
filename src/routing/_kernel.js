import * as React from 'react';
import PageWrapper from '../components/wrappers/PageWrapper';
import GuestWrapper from '../components/wrappers/GuestWrapper';
import OnboardedWrapper from '../components/wrappers/OnboardedWrapper';
import AuthWrapper from '../components/wrappers/AuthWrapper';
import SignUp from '../components/containers/SignUp';
import Login from '../components/containers/Login';
import NotFound from '../components/containers/NotFound';
import Onboarding from '../components/containers/Onboarding';
import Dashboard from '../components/containers/Dashboard';
import AccountVerifictaion from '../components/containers/AccountVerifictaion';
import Logout from '../components/containers/Logout';
import ForgotPassword from '../components/containers/ForgotPassword';
import ResetPassword from '../components/containers/ResetPassword';
import Clients from '../components/containers/Clients';
import ClientsDeleted from '../components/containers/ClientsDeleted';
import ClientDetailedInfo from '../components/containers/ClientDetailedInfo';
import Items from '../components/containers/Items';
import ItemsDeleted from '../components/containers/ItemsDeleted';
import Expenses from '../components/containers/Expenses';
import ProfileSettings from '../components/containers/ProfileSettings';
import ProfileSettings2 from '../components/containers/ProfileSettings2';

import BusinessSettings from '../components/containers/BusinessSettings';
import PaymentSettings from '../components/containers/PaymentSettings';
import TeamMembers from '../components/containers/TeamMembers';
import Sales from '../components/containers/Sales';
import Feedback from '../components/containers/Feedback';
import InvoiceDisplay from '../components/containers/InvoiceDisplay';
import AdminDisplay from '../components/containers/AdminDisplay';

export const SignUpPage = (props) => (
  <GuestWrapper
    noRedirect
  >
    <PageWrapper
      noAppbar
      noMenubar
      fullPage
    >
      <SignUp />
    </PageWrapper>
  </GuestWrapper>
);

export const LoginPage = (props) => (
  <GuestWrapper>
    <PageWrapper
      noAppbar
      noMenubar
      fullPage
    >
      <Login />
    </PageWrapper>
  </GuestWrapper>
);

export const ForgotPasswordPage = (props) => (
  <GuestWrapper>
    <PageWrapper
      noAppbar
      noMenubar
      fullPage
    >
      <ForgotPassword />
    </PageWrapper>
  </GuestWrapper>
);

export const ResetPasswordPage = (props) => (
  <GuestWrapper>
    <PageWrapper
      noAppbar
      noMenubar
      fullPage
    >
      <ResetPassword />
    </PageWrapper>
  </GuestWrapper>
);

export const LogoutPage = (props) => (
  <AuthWrapper>
      <PageWrapper
        noMenubar
        noAppbar
      >
        <Logout toggleSnackbar={(message,variant) => 5} />
      </PageWrapper>
  </AuthWrapper>
);

export const DashboardPage = (props) => (
  <AuthWrapper
    returnable
  >
    <OnboardedWrapper>
      <PageWrapper
        fullPage
        menu='Dashboard'
        requiresEmailConfirmed
      >
        <Dashboard />
      </PageWrapper>
    </OnboardedWrapper>
  </AuthWrapper>
);

export const DeletedClientsPage = (props) => (
  <AuthWrapper
    returnable
  >
    <OnboardedWrapper>
      <PageWrapper
        fullPage
        menu='Clients'
        requiresEmailConfirmed
      >
        <ClientsDeleted />
      </PageWrapper>
    </OnboardedWrapper>
  </AuthWrapper>
);

export const ClientDetailsPage = (props) => (
  <AuthWrapper
    returnable
  >
    <OnboardedWrapper>
      <PageWrapper
        fullPage
        menu='Clients'
        requiresEmailConfirmed
      >
        <ClientDetailedInfo />
      </PageWrapper>
    </OnboardedWrapper>
  </AuthWrapper>
);

export const ClientsPage = (props) => (
  <AuthWrapper
    returnable
  >
    <OnboardedWrapper>
      <PageWrapper
        fullPage
        menu='Clients'
        requiresEmailConfirmed
      >
        <Clients />
      </PageWrapper>
    </OnboardedWrapper>
  </AuthWrapper>
);

export const ItemsPage = (props) => (
  <AuthWrapper
    returnable
  >
    <OnboardedWrapper>
      <PageWrapper
        fullPage
        menu='Items'
        requiresEmailConfirmed
      >
        <Items />
      </PageWrapper>
    </OnboardedWrapper>
  </AuthWrapper>
);

export const DeletedItemsPage = (props) => (
  <AuthWrapper
    returnable
  >
    <OnboardedWrapper>
      <PageWrapper
        fullPage
        menu='Items'
        requiresEmailConfirmed
      >
        <ItemsDeleted />
      </PageWrapper>
    </OnboardedWrapper>
  </AuthWrapper>
);

export const SalesPage = (props) => (
  <AuthWrapper
    returnable
  >
    <OnboardedWrapper>
      <PageWrapper
        fullPage
        menu='Sales'
        requiresEmailConfirmed
      >
        <Sales />
      </PageWrapper>
    </OnboardedWrapper>
  </AuthWrapper>
);

export const ExpensesPage = (props) => (
  <AuthWrapper
    returnable
  >
    <OnboardedWrapper>
      <PageWrapper
        fullPage
        menu='Expenses'
        requiresEmailConfirmed
      >
        <Expenses />
      </PageWrapper>
    </OnboardedWrapper>
  </AuthWrapper>
);
export const FeedbackPage = (props) => (
  <AuthWrapper
    returnable
  >
    <OnboardedWrapper>
      <PageWrapper
        fullPage
        menu='Feedback'
        requiresEmailConfirmed
      >
        <Feedback />
      </PageWrapper>
    </OnboardedWrapper>
  </AuthWrapper>
);
export const ProfileSettingsPage = (props) => (
  <AuthWrapper
    returnable
  >
    <OnboardedWrapper>
      <PageWrapper
        fullPage
        menu='Settings'
        requiresEmailConfirmed
      >
        <ProfileSettings />
      </PageWrapper>
    </OnboardedWrapper>
  </AuthWrapper>
);
export const ProfileSettingsPage2 = (props) => (
  <AuthWrapper
    returnable
  >
    <OnboardedWrapper>
      <PageWrapper
        fullPage
        menu='Settings'
        requiresEmailConfirmed
      >
        <ProfileSettings2 />
      </PageWrapper>
    </OnboardedWrapper>
  </AuthWrapper>
);
export const BusinessSettingsPage = (props) => (
  <AuthWrapper
    returnable
  >
    <OnboardedWrapper>
      <PageWrapper
        fullPage
        menu='Settings'
        requiresEmailConfirmed
      >
        <BusinessSettings />
      </PageWrapper>
    </OnboardedWrapper>
  </AuthWrapper>
);

export const PaymentSettingsPage = (props) => (
  <AuthWrapper
    returnable
  >
    <OnboardedWrapper>
      <PageWrapper
        fullPage
        menu='Settings'
        requiresEmailConfirmed
      >
        <PaymentSettings />
      </PageWrapper>
    </OnboardedWrapper>
  </AuthWrapper>
);

export const TeamMembersPage = (props) => (
  <AuthWrapper
    returnable
  >
    <OnboardedWrapper>
      <PageWrapper
        fullPage
        menu='Settings'
        requiresEmailConfirmed
      >
        <TeamMembers />
      </PageWrapper>
    </OnboardedWrapper>
  </AuthWrapper>
);

export const AccountVerificationPage = (props) => (
  <AuthWrapper
    returnable
  >
    <OnboardedWrapper>
      <PageWrapper
        noAppbar
        noMenubar
      >
        <AccountVerifictaion />
      </PageWrapper>
    </OnboardedWrapper>
  </AuthWrapper>
);

export const OnboardingPage = (props) => (
    <AuthWrapper
      returnable
    >
    <PageWrapper
      noAppbar
      noMenubar
      fullPage
    >
      <Onboarding />
    </PageWrapper>
    </AuthWrapper>
);

export const InvoiceDisplayPage = (props) => (
    <PageWrapper
      noAppbar
      noMenubar
    >
      <InvoiceDisplay />
    </PageWrapper>
);

export const AdminDashboard = (props) => (
  <AuthWrapper
    returnable
  >
    <PageWrapper
      noAppbar
      noMenubar
    >
      <AdminDisplay />
    </PageWrapper>
  </AuthWrapper>
);

export const NotFoundPage = (props) => (
  <PageWrapper
    noAppbar
    noMenubar
  >
    <NotFound />
  </PageWrapper>
);