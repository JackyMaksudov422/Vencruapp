import { ActionTypes } from '../actionTypes';

/**
 * sets the menu for the
 * currently viewed page
 */
export const setMenu = menu => ({
	type: ActionTypes.SET_MENU,
	menu: menu,
});

/**
 * makes the app bar visible
 */
export const showAppbar = () => ({
	type: ActionTypes.TOGGLE_APPBAR,
	visible: true,
});

/**
 * hides the app bar
 */
export const hideAppbar = () => ({
	type: ActionTypes.TOGGLE_APPBAR,
	visible: false,
});

/**
 * makes the menubar visible
 */
export const showMenubar = () => ({
	type: ActionTypes.TOGGLE_MENUBAR,
	visible: true,
});

/**
 * hides the menubar
 */
export const hideMenubar = () => ({
	type: ActionTypes.TOGGLE_MENUBAR,
	visible: false,
});

// hides the snackbar
export const hideSnackbar = () => ({
	type: ActionTypes.HIDE_SNACKBAR,
	open: false,
});

// resets the snackbar
export const resetSnackbar = () => ({
	type: ActionTypes.RESET_SNACKBAR,
});

// makes the snackbar visible
export const showSnackbar = (message, options = null) => dispatch => {
	dispatch(hideSnackbar());
	setTimeout(() => {
		dispatch(
			Object.assign(
				{
					variant: 'info',
				},
				options,
				{
					type: ActionTypes.SHOW_SNACKBAR,
					open: true,
					message: message,
				}
			)
		);
	}, 300);
};

// hides the alert dialog
export const hideAlertDialog = () => ({
	type: ActionTypes.HIDE_DIALOG,
	open: false,
});

// resets the alert dialog
export const resetAlertDialog = () => ({
	type: ActionTypes.RESET_DIALOG,
});

// makes the alert dialog visible
export const showAlertDialog = (
	heading,
	message,
	actions = null,
	options = {
		disableEsc: false,
		disableBackdropClick: false,
	}
) => dispatch => {
	dispatch(hideAlertDialog());
	setTimeout(() => {
		dispatch(
			Object.assign({}, options, {
				type: ActionTypes.SHOW_DIALOG,
				open: true,
				heading: heading,
				message: message,
				actions: actions,
			})
		);
	}, 400);
};

// update page info
export const toggleFullPage = (makeFullPage = false) => ({
	type: ActionTypes.UPDATE_PAGE_INFO,
	fullPage: typeof makeFullPage == 'boolean' ? makeFullPage : false,
});

// update page info
export const togglePageDialog = dialogName => ({
	type: ActionTypes.UPDATE_PAGE_INFO,
	dialogName: dialogName,
});

// select all items --> nabvbar for the multiple pages select all option
// will modify the state checked or not for the pages clients, invoices, expenses and items

export const selectAllItems = () => ({
	type: ActionTypes.SELECT_ALL_ITEMS,
});

export const selectAllInvoices = () => ({
	type: ActionTypes.SELECT_ALL_INVOICES,
});

export const selectAllExpenses = () => ({
	type: ActionTypes.SELECT_ALL_EXPENSES,
});

export const selectAllClients = () => ({
	type: ActionTypes.SELECT_ALL_CLIENTS,
});
