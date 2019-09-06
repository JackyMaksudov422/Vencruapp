import * as React from 'react';
import { Route } from 'react-router-dom';
import SalesHome from './SalesHome';
import InvoiceCreate from './InvoiceCreate';
import InvoiceShow from './InvoiceShow';
import InvoiceEdit from './InvoiceEdit';
import InvoiceDraft from './InvoiceDraft';
import InvoicesCancelled from './InvoicesCancelled';
import PageWrapper from '../wrappers/PageWrapper';
import SalesReceiptCreate from './SalesReceiptCreate';
import ItemsCreate from './ItemsCreate';

const InvoiceCreatePage = () => (
	<PageWrapper noMenubar fullPage>
		<InvoiceCreate />
	</PageWrapper>
);

const InvoiceShowPage = () => (
	<PageWrapper noMenubar fullPage>
		<InvoiceShow />
	</PageWrapper>
);

const InvoiceEditPage = () => (
	<PageWrapper noMenubar fullPage>
		<InvoiceEdit />
	</PageWrapper>
);

const DraftInvoices = () => (
	<PageWrapper fullPage>
		<InvoiceDraft />
	</PageWrapper>
);

const CancelledInvoicesPage = () => (
	<PageWrapper fullPage>
		<InvoicesCancelled />
	</PageWrapper>
);

const SalesHomePage = () => (
	<PageWrapper>
		<SalesHome />
	</PageWrapper>
);

const ItemsCreatePage = () => (
	<PageWrapper>
		<ItemsCreate />
	</PageWrapper>
);

const SalesReceiptCreatePage = () => (
	<PageWrapper noMenubar fullPage>
		<SalesReceiptCreate />
	</PageWrapper>
);

const Sales = () => {
	return (
		<div className="app-authenticated-body ph0 pv0">
			<Route exact path="/sales" component={SalesHomePage} />
			<Route exact path="/sales/create-invoice" component={InvoiceCreatePage} />
			<Route exact path="/sales/create-receipt" component={SalesReceiptCreatePage} />
			<Route exact path="/sales/create-item" component={ItemsCreatePage} />
			<Route exact path="/sales/i/" component={InvoiceShowPage} />
			<Route exact path="/sales/drafts/" component={DraftInvoices} />
			<Route exact path="/sales/cancelled/" component={CancelledInvoicesPage} />
			<Route exact path="/sales/:invoiceId/edit" component={InvoiceEditPage} />
		</div>
	);
};

export default Sales;
