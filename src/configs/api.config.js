import Querystring from 'querystring';
/*
 * **********************************************
 * This file contains the configuration for all
 * the url settings for the REST API endpoints
 *
 * E.g. { url: PATH, method:POST/PUT/DELETE/GET }
 * **********************************************
 */

import { HTTP } from './http.config';
import { URL } from './app.config';

/**
 * Used for signing users up on the system.
 * @param object data
 * @return Promise
 */
export const SIGN_UP = data =>
	HTTP.post('/api/Account/Register', data, {
		headers: { emailurl: `${URL}/verify-account` },
	});

/**
 * Used for saving users onboarding information.
 * @param object data
 * @return Promise
 */
export const SAVE_ONBOARDING_INFO = data => HTTP.post('/api/Onboarding/Addonboarding', data);

/**
 * Used for logging users into the app.
 * @param object data
 * @return Promise
 */
export const LOGIN = data => HTTP.post('/api/Account/Login', data);

export const LOGOUT = data => HTTP.post('/api/Account/Logout', data);
/**
 * Used for logging users into the app.
 * @param object data
 * @return Promise
 */
export const GOOGLE_LOGIN = data =>
	HTTP.post('api/Account/External', data, {
		headers: { emailurl: `${URL}` },
	});

/**
 * Used for requesting a password reset token.
 * @param object data
 * @return Promise
 */
export const SEND_RESET_TOKEN = data =>
	HTTP.post('/api/Account/InitiatePasswordChange', data, {
		headers: {
			emailurl: `${URL}/reset-password`,
		},
	});

/**
 * Used for reseting a users password using a reset token.
 * @param object data
 * @return Promise
 */
export const RESET_PASSWORD = data =>
	HTTP.post('/api/Account/ResetPassword', data, {
		headers: {
			emailurl: `${URL}/login`,
		},
	});

/**
 * Used for validating a reset token.
 * @param object data
 * @return Promise
 */
export const VERIFY_RESET_TOKEN = data =>
	HTTP.post('/api/Account/ValidatePasswordResetToken', Querystring.stringify(data), {
		headers: {
			emailurl: `${URL}/login`,
		},
	});

/**
 * Used for confirming user accounts after sign up.
 * @param string code
 * @return Promise
 */
export const CONFIRM_EMAIL = code => HTTP.post('/api/Account/ConfirmEmail', { code });

/**
 * Used for fetching the logged in users information
 * @return Promise
 */
export const GET_USER_INFO = () => HTTP.get('/api/Account/UserInfo');

/**
 * Returns a list of clients
 * @param object { businessId, ... }
 * @return Promise
 */
export const GET_CLIENTS = ({ businessId, sortBy, sortOrder, searchQuery, limit, page, fromDate, toDate, filter }) =>
	HTTP.get('/api/Client/GetAllClients', {
		params: {
			businessid: businessId || '',
			sortby: sortBy || 'date_created',
			sortorder: sortOrder || 'desc',
			searchquery: searchQuery || '',
			limit: limit || 10,
			page: page || 1,
			fromdate: fromDate || '',
			todate: toDate || '',
			filter: filter || '',
		},
	});

/**
 * Returns information for a client.
 * @param integer clientId
 * @param string businessId
 * @return Promise
 */
export const FIND_CLIENT = (businessId, clientId) =>
	HTTP.get('/api/Client/GetClient', {
		params: {
			businessId: businessId || undefined,
			clientId: clientId || undefined,
		},
	});

/**
 * Used for creating new clients
 * @param object data
 * @return Promise
 */
export const CREATE_CLIENT = data => HTTP.post('/api/Client/AddClient', data);

/**
 * Used for updating client note
 * @param object data
 */
export const ADD_CLIENT_NOTE = data => HTTP.post('/api/Client/AddClientNote', data);

/**
 * Returns a list of deleted clients
 * @param object data
 * @return Promise
 */
export const GET_DELETED_CLIENTS = ({ BusinessId }) =>
	HTTP.get('/api/Client/GetDeleteList', {
		params: {
			businessid: BusinessId || undefined,
			sortby: 'date_created',
			sortorder: 'desc',
			searchquery: '',
			limit: 100000000,
			page: 1,
			fromdate: '',
			todate: '',
		},
	});

/**
 * Used for updating client information
 * @param object data
 */
export const UPDATE_CLIENT = data => HTTP.post('/api/Client/UpdateClient', data);

/**
 * This is used for deleting the user's clients.
 * @param array_or_object clientid
 * @return Promise
 */
export const DELETE_CLIENT = clientId => {
	let endpoint = `
        ${clientId && clientId.items ? '/api/Client/DeleteMultipleClient' : ''}
        ${clientId && !clientId.items ? '/api/Client/DeleteClient' : ''}
    `.replace(/\s+/g, '');
	return HTTP.post(endpoint, clientId);
};

export const RESTORE_MULTIPLE_CLIENTS = clientData => {
	let endpoint = `${clientData && clientData.items ? '/api/Client/RestoreMultipleClients' : ''}`.replace(/\s+/g, '');

	return HTTP.post(endpoint, clientData, {
		headers: {},
	});
};

/**
 * This is used for restoring clients.
 * @param string clientid
 * @return Promise
 */
export const RESTORE_CLIENT = clientId => {
	console.log('Got this');
	console.log(clientId);
	let endpoint = `
        ${clientId && !clientId.items ? '/api/Client/RestoreClient' : ''}
        ${clientId && clientId.items ? '/api/Client/RestoreMultipleClients' : ''}
    `.replace(/\s+/g, '');
	console.log(endpoint);
	return HTTP.post(endpoint, clientId, {
		headers: {
			// noUserId: true
		},
	});
};

/**
 * This endpoint is user to fetch quick statistics clients.
 * @param string businessId
 * @return Promise
 */
export const CLIENTS_QUICK_STATISICS = businessId =>
	HTTP.get('/api/Client/GetClientSummaryData', {
		params: { businessId: businessId },
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});

/**
 * Returns a list of products
 * @param object { businessId, ... }
 * @return Promise
 */
export const GET_ITEMS = ({ businessId, sortBy, sortOrder, searchQuery, limit, page, fromDate, toDate }) =>
	HTTP.get('/api/ProductList/GetAllProducts', {
		params: {
			businessid: businessId || '',
			sortby: sortBy || 'date_created',
			sortorder: sortOrder || 'desc',
			searchquery: searchQuery || '',
			limit: limit || 10,
			page: page || 1,
			fromdate: fromDate || '',
			todate: toDate || '',
		},
	});

/**
 * Returns information for a item.
 * @param integer itemId
 * @param string businessId
 * @return Promise
 */
export const FIND_ITEM = (businessId, itemId) =>
	HTTP.get('/api/ProductList/GetProduct', {
		params: {
			BusinessId: businessId || undefined,
			ProductId: itemId || undefined,
		},
	});

/**
 * Used for creating new product
 * @param object data
 * @return Promise
 */
export const CREATE_ITEM = data => HTTP.post('/api/ProductList/AddProduct', data);

/**
 * Used for updating item information
 * @param object data
 */
export const UPDATE_ITEM = data => {
	return HTTP.post('/api/ProductList/UpdateProduct', data);
};

/**
 * Returns a list of deleted items
 * @param object data
 * @return Promise
 */
export const GET_DELETED_ITEMS = ({ BusinessId }) =>
	HTTP.get('/api/ProductList/GetDeleteList', {
		params: {
			businessid: BusinessId || undefined,
			sortby: 'date_created',
			sortorder: 'desc',
			searchquery: '',
			limit: 100000000,
			page: 1,
			fromdate: '',
			todate: '',
		},
	});

/**
 * This is used for deleting the user's products.
 * @param array_or_object clientid
 * @return Promise
 */
export const DELETE_ITEM = clientId => {
	let endpoint = `
        ${clientId && clientId.items ? '/api/ProductList/DeleteMultipleProducts' : ''}
        ${clientId && !clientId.items ? '/api/ProductList/DeleteProduct' : ''}
    `.replace(/\s+/g, '');
	return HTTP.post(endpoint, clientId);
};

/**
 * This is used for restoring items.
 * @param string itemid
 * @return Promise
 */
export const RESTORE_ITEM = itemId => {
	let endpoint = `
        ${itemId && !itemId.items ? '/api/ProductList/Restoreproduct' : ''}
        ${itemId && itemId.items ? '/api/ProductList/RestoreMultipleproduct' : ''}
    `.replace(/\s+/g, '');
	return HTTP.post(endpoint, itemId, {
		headers: {
			// noUserId: true
		},
	});
};

/**
 * Returns a list of expenses
 * @param object { businessId, ... }
 * @return Promise
 */
export const GET_EXPENSES = ({ businessId, sortBy, sortOrder, searchQuery, limit, page, fromDate, toDate }) =>
	HTTP.get('/api/Expense/GetAllExpenses', {
		params: {
			businessid: businessId || '',
			sortby: sortBy || 'date_created',
			sortorder: sortOrder || 'desc',
			searchquery: searchQuery || '',
			limit: limit || 10,
			page: page || 1,
			fromdate: fromDate || '',
			todate: toDate || '',
		},
	});

export const GET_OVERDUE_INVOICES = ({ businessId, sortBy, sortOrder, searchQuery, limit, page, fromDate, toDate }) =>
	HTTP.get('api/invoice/GetAllInvoices', {
		params: {
			businessid: businessId || '',
			sortby: sortBy || 'date_created',
			sortorder: sortOrder || 'desc',
			searchquery: searchQuery || '',
			limit: limit || 3,
			page: page || 1,
			fromdate: fromDate || '',
			todate: toDate || '',
			status: 'overdue',
		},
	});

export const GET_UNPAID_INVOICES = ({ businessId, sortBy, sortOrder, searchQuery, limit, page, fromDate, toDate }) =>
	HTTP.get('api/invoice/GetAllInvoices', {
		params: {
			businessid: businessId || '',
			sortby: sortBy || 'date_created',
			sortorder: sortOrder || 'desc',
			searchquery: searchQuery || '',
			limit: limit || 3,
			page: page || 1,
			fromdate: fromDate || '',
			todate: toDate || '',
			status: 'not-paid',
		},
	});
/**
 * Returns information for a expense.
 * @param integer expenseId
 * @param string businessId
 * @return Promise
 */
export const FIND_EXPENSE = (businessId, expenseId) =>
	HTTP.get('/api/Expense/GetExpense', {
		params: {
			businessId: businessId || undefined,
			expenseId: expenseId || undefined,
		},
	});

/**
 * Used for creating new expenses
 * @param object data
 * @return Promise
 */
export const CREATE_EXPENSE = (data, config) =>
	HTTP.post('/api/Expense/AddExpense', data, {
		onUploadProgress: config && config.onUploadProgress,
	});

/**
 * Gets the expense number for a new expense.
 * @param string businessId
 * @return Promise
 */
export const GET_NEW_EXPENSE_NUMBER = businesId =>
	HTTP.get('/api/Expense/GetExpenseNumber', {
		params: {
			businessid: businesId,
		},
	});

/**
 * Used for updating expense information
 * @param object data
 */
export const UPDATE_EXPENSE = (data, config) =>
	HTTP.post('/api/Expense/UpdateExpense', data, {
		onUploadProgress: config && config.onUploadProgress,
	});

/**
 * This is used for deleting the user's expenses.
 * @param array_or_object expenseid
 * @return Promise
 */
export const DELETE_EXPENSE = expenseId => {
	let endpoint = `
        ${expenseId && expenseId.items ? '/api/Expense/DeleteMultipleExpense' : ''}
        ${expenseId && !expenseId.items ? '/api/Expense/DeleteExpense' : ''}
    `.replace(/\s+/g, '');
	return HTTP.post(endpoint, expenseId);
};

/**
 * This endpoint is user to fetch quick statistics expenses.
 * @param string businessId
 * @return Promise
 */
export const EXPENSES_QUICK_STATISICS = businessId =>
	HTTP.get('/api/Expense/GetExpenseSummaryData', {
		params: { businessId: businessId },
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});

/**
 * This endpoint is user to fetch quick statistics for products.
 * @param string businessId
 * @return Promise
 */
export const PRODUCTS_SUMMARY = businessId =>
	HTTP.get('/api/ProductList/GetProductSummaryData', {
		params: { businessId: businessId },
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});

/**
 * This is used for resending the account verification mail.
 * @param string email
 * @return Promise
 */
export const RESEND_ACTIVATION_MAIL = (email, configs) =>
	HTTP.post(
		'/api/Account/ResendActivationEmail',
		{ email },
		{
			...configs,
			headers: { emailurl: `${URL}/verify-account` },
		}
	);

/**
 * This api call is used for verifying a registered user's email address.
 * @param string userId
 * @param string code
 * @return Promise
 */
export const VERIFY_MAIL = ({ userId, code }, configs) =>
	HTTP.post(
		'/api/Account/ConfirmEmail',
		{ userId, code },
		{
			...configs,
		}
	);

/**
 * Used for updating the currently logged in user's profile.
 * @param object data
 */
export const UPDATE_PROFILE = data => HTTP.post('/api/AccountSettings/Updateprofile', data);

/**
 * Used for updating business info.
 * @param object data
 */
export const UPDATE_BUSINESS_INFO = data => HTTP.post('/api/onboarding/UpdateBusiness', data);

/**
 * Get list of businesses banks.
 * @param object data
 */
export const GET_BANKS = businessid =>
	HTTP.get('/api/AccountSettings/GetallBanks', {
		params: {
			businessid: businessid,
		},
	});

/**
 * Used for add bank information.
 * @param object data
 */
export const ADD_BANK = data => HTTP.post('/api/AccountSettings/AddBank', data);

/**
 * Used for editting bank information.
 * @param object data
 */
export const UPDATE_BANK = data => HTTP.post('/api/AccountSettings/Updatebank', data);

/**
 * Used for deleting bank information from storage.
 * @param object data
 */
export const DELETE_BANK = data => HTTP.post('/api/AccountSettings/DeleteBank', data);

/**
 * Get team members.
 * @param object data
 */
export const GET_TEAM_MEMBERS = businessid =>
	HTTP.get('/api/onboarding/GetAllTeamMemberInvite', {
		params: { businessid },
	});

/**
 * Used for add team member.
 * @param object data
 */
export const INVITE_TEAM_MEMBER = data =>
	HTTP.post('/api/onboarding/InviteTeamMember', data, {
		headers: { emailurl: `${URL}/accept-invite` },
	});

/**
 * Used for add team member.
 * @param object data
 */
export const RESEND_TEAM_MEMBER_INVITE = data =>
	HTTP.post('/api/onboarding/ResendTeamMemberInvite', data, {
		headers: { emailurl: `${URL}/accept-invite` },
	});

/**
 * Find team member.
 * @param object data
 */
export const FIND_TEAM_MEMBER_INVITE = (businessid, inviteid) =>
	HTTP.get('/api/onboarding/GetTeamMemberInvite', {
		params: {
			businessid,
			inviteid,
		},
	});

/**
 * Used for editting team member.
 * @param object data
 */
export const UPDATE_TEAM_MEMBER = data => HTTP.post('/api/onboarding/UpdateTeamMemberInvite', data);

/**
 * Used for removing team members from a business.
 * @param object data
 */
export const REMOVE_TEAM_MEMBER = data => HTTP.post('/api/onboarding/DeleteTeamMemberInvite', data);

/**
 * Returns a list of invoices
 * @param object { businessId, ... }
 * @return Promise
 */

/**
 * api/invoice/GetAllInvoices?businessid={businessid}&limit={limit}&page={page}&
 * sortby={sortby}&sortorder={sortorder}&searchquery={searchquery}&fromdate={fromdate}
 * &todate={todate}&status={status}
 *
 */
export const GET_INVOICES = ({ businessId, invoiceType, sortBy, sortOrder, searchQuery, limit, page, fromDate, toDate, status }) =>
	HTTP.get(
		// api/invoice/GetAllInvoices
		'/api/invoice/GetAllInvoices',
		{
			params: {
				businessid: businessId || '',
				invoicetype: invoiceType || 'invoice',
				sortby: sortBy || 'name',
				sortorder: sortOrder || 'desc',
				searchquery: searchQuery || '',
				limit: limit || 10,
				page: page || 1,
				fromdate: fromDate || '',
				todate: toDate || '',
				status: status || '',
			},
		}
	);

/**
 * Returns information for a invoice.
 * @param integer invoiceId
 * @param string businessId
 * @return Promise
 */
export const FIND_INVOICE = (businessId, invoiceId) =>
	HTTP.get('/api/Invoice/GetInvoice', {
		params: {
			businessid: businessId || undefined,
			invoiceid: invoiceId || undefined,
		},
	});

export const FIND_INVOICE_ALT = (businessId, invoiceId, token) =>
	HTTP.get('/api/Invoice/GetInvoice', {
		params: {
			businessid: businessId || undefined,
			invoiceid: invoiceId || undefined,
			userid: token || undefined
		},
	});

/**
 * Used for creating new invoices
 * @param object data
 * @return Promise
 */
export const CREATE_INVOICE = data => 
	HTTP.post('/api/Invoice/CreateInvoice', data, {
		headers: {emailurl: `${URL}/inv/` }
	});

/**
 * Returns a list of deleted invoices
 * @param object data
 * @return Promise
 */
export const GET_CANCELLED_INVOICES = ({ BusinessId }) =>
	HTTP.get('/api/Invoice/GetCancelledInvoice', {
		params: {
			businessid: BusinessId || undefined,
			sortby: 'date_created',
			sortorder: 'desc',
			searchquery: '',
			limit: 100000000,
			page: 1,
			fromdate: '',
			todate: '',
		},
	});

/**
 * Returns a list of draft invoices
 * @param object data
 * @return Promise
 */
export const GET_DRAFT_INVOICES = ({ BusinessId }) =>
	HTTP.get('/api/Invoice/GetAllInvoices', {
		params: {
			businessid: BusinessId || undefined,
			sortby: 'date_created',
			sortorder: 'desc',
			searchquery: '',
			limit: 100000000,
			page: 1,
			fromdate: '',
			todate: '',
		},
	});

/**
 * Used for updating invoice information
 * @param object data
 */
export const UPDATE_INVOICE = data => HTTP.post('/api/Invoice/UpdateInvoice', data);

/**
 * This is used for canceling the user's invoices.
 * @param array_or_object invoiceid
 * @return Promise
 */
export const CANCEL_INVOICE = invoiceId => {
	let endpoint = `
        ${(invoiceId && invoiceId.items && '/api/Invoice/CancelMultipleInvoice') || ''}
        ${(invoiceId && !invoiceId.items && '/api/Invoice/CancelInvoice') || ''}
    `.replace(/\s+/g, '');
	return HTTP.post(endpoint, invoiceId);
};

/**
 * This is used for deleting the user's invoices.
 * @param array_or_object invoiceid
 * @return Promise
 */
export const DELETE_INVOICE = invoiceId => {
	let endpoint = `
        ${(invoiceId && invoiceId.items && '/api/Invoice/DeleteMultipleInvoice') || ''}
        ${(invoiceId && !invoiceId.items && '/api/Invoice/DeleteInvoice') || ''}
    `.replace(/\s+/g, '');
	return HTTP.post(endpoint, invoiceId);
};

/**
 * This is used for restoring invoices.
 * @param string invoiceid
 * @return Promise
 */
export const RESTORE_INVOICE = invoiceId => {
	let endpoint = `
        ${(invoiceId && !invoiceId.items && '/api/Invoice/RestoreInvoice') || ''}
        ${(invoiceId && invoiceId.items && '/api/Invoice/RestoreMultipleInvoices') || ''}
    `.replace(/\s+/g, '');
	return HTTP.post(endpoint, invoiceId, {
		headers: {
			// noUserId: true
		},
	});
};

/**
 * This endpoint is user to fetch quick statistics invoices.
 * @param string businessId
 * @return Promise
 */
export const INVOICES_QUICK_STATISICS = businessId =>
	HTTP.get('/api/Invoice/GetInvoiceSummaryData', {
		params: { 
			businessId: businessId,
			sortby: 'date_created'
		},
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});

/**
 * Gets the invoice number for a new invoice.
 * @param string businessId
 * @return Promise
 */
export const GET_NEW_INVOICE_NUMBER = businesId =>
	HTTP.get('api/invoice/GetInvoiceNumber', {
		params: {
			businessid: businesId,
		},
	});

export const GET_CLIENT_HISTORY = ({ clientId, businesId, limit, page, userId }) =>
	HTTP.get('api/Client/GetClientHistory', {
		params: {
			clientid: clientId,
			businessid: businesId,
			limit: limit || 10,
			page: page || 1,
			userid: userId,
		},
	});

// DepositPaid: "1"
// PaidWith: "Cash"
// PaymentDate: [Fri Nov 30 2018 00:00:00 GMT+0100 (West Africa Standard Time)]
// TotalAmount: "10"

export const ADD_PAYMENT = ({ DepositPaid, PaidWith, PaymentDate, TotalAmount, InvoiceId }) =>
	HTTP.post('api/invoice/AddPayment', {
		amount: DepositPaid,
		paidwith: PaidWith,
		date_paid: PaymentDate,
		invoiceid: InvoiceId
	});

export const GET_PAYMENTS = ({ businessId, invoiceId, sortBy, sortOrder, searchQuery, limit, page, fromDate, toDate, filter }) =>
	HTTP.get('/api/invoice/GetAllPayment', {
		params: {
			businessid: businessId || '',
			invoiceid: invoiceId || '',
			sortby: sortBy || 'date_created',
			sortorder: sortOrder || 'desc',
			searchquery: searchQuery || '',
			limit: limit || 1000000,
			page: page || 1,
			fromdate: fromDate || '',
			todate: toDate || '',
			filter: filter || '',
		},
	});

// DASHBOARD ENDPOINTS

/**
 * Returns expense summary for dashboard
 */

export const GET_BUSINESS_SUMMARY = (userId, businessId, sortBy, fromDate, toDate) => {
	// TODO : Check userId and businessId before making request
	return HTTP.get('api/Dashboard/GetBusinessSummary', {
		params: {
			userid: userId,
			businessid: businessId,
			sortby: sortBy || 'date_created',
			fromdate: fromDate || '',
			todate: toDate || ''
		},
	});
};

export const GET_EXPENSES_SUMMARY = (userId, businessId, sortBy) => {
	// TODO : Check userId and businessId before making request
	return HTTP.get('api/Dashboard/GetExpenseBreakDown', {
		params: {
			userid: userId,
			businessid: businessId,
			sortby: sortBy || 'date_created',
		},
	});
};

export const GET_INCOME_SOURCES = (userId, businessId, sortBy) => {
	// TODO : Check userId and businessId before making request
	return HTTP.get('api/Dashboard/GetIncomeSources', {
		params: {
			userid: userId,
			businessid: businessId,
			sortby: sortBy || 'date_created',
		},
	});
};

export const GET_PROFIT = (userId, businessId, sortBy) => {
	// TODO : Check userId and businessId before making request
	return HTTP.get('api/Dashboard/GetProfit', {
		params: {
			userid: userId,
			businessid: businessId,
			sortby: sortBy || 'date_created',
		},
	});
};

export const GET_GOAL = (userId, businessId) => {
	return HTTP.get('api/Dashboard/GetGoal', {
		params: {
			userid: userId,
			businessid: businessId,
		}
	});
};

export const ADD_GOAL = ({ businessId, targetRevenue, currentRevenue}) =>
	HTTP.post('api/Dashboard/AddGoal', {
		businessid: businessId,
		monthlytarget: targetRevenue,
		estimatedmonthlyrevenue: currentRevenue
	});

export const UPDATE_GOAL = ({ businessId, targetRevenue}) =>
	HTTP.post('api/Dashboard/UpdateGoal', {
		businessid: businessId,
		monthlytarget: targetRevenue
	});

export const GET_OTHER_INDUSTRIES = () => {
	return HTTP.get('api/onboarding/GetOtherIndustry');
};

export const GET_CURRENCIES = () => {
	return HTTP.get('api/onboarding/GetCurrency');
};

/**
 * Returns a list of all users
 * @param string code
 * @return Promise
 */
export const GET_ALL_USERS = () => 
	HTTP.get('/api/Admin/GetAllUsers', { 
		params: {
			code: 'ebukam' 
		},
	});

/**
 * Used for getting all subscription plans
 * @return Promise
 */
export const GET_PLANS = () => HTTP.get('/api/Admin/GetAllPlan');

/**
 * Used for adding a subscription plan to a user's account
 */
export const ADD_SUBSCRIPTION = data => HTTP.post('/api/Account/AddSubscriptionBeforePaystack', data);