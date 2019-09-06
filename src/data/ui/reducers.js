import CreateReducer from '../../helpers/CreateReducer';
import { ActionTypes } from '../actionTypes';

export const appbar = CreateReducer(
	{
		visible: false,
	},
	{
		[ActionTypes.TOGGLE_APPBAR]: (state, action) => Object.assign({}, state, action),
		[ActionTypes.LOGOUT_SUCCESS]: (state, action, initialState) => initialState,
	}
);

export const menubar = CreateReducer(
	{
		menu: null,
		visible: false,
	},
	{
		[ActionTypes.SET_MENU]: (state, action) => Object.assign({}, state, action),
		[ActionTypes.TOGGLE_MENUBAR]: (state, action) => Object.assign({}, state, action),
		[ActionTypes.LOGOUT_SUCCESS]: (state, action, initialState) => initialState,
	}
);

export const snackbar = CreateReducer(
	{
		show: false,
		message: null,
		variant: '',
	},
	{
		[ActionTypes.SHOW_SNACKBAR]: (state, action) => Object.assign({}, state, action),
		[ActionTypes.HIDE_SNACKBAR]: (state, action) => Object.assign({}, state, action),
		[ActionTypes.RESET_SNACKBAR]: (state, action, initialState) => initialState,
	}
);

export const alertDialog = CreateReducer(
	{
		show: false,
		heading: null,
		message: null,
		actions: null,
		disableEsc: false,
		disableBackdropClick: false,
	},
	{
		[ActionTypes.SHOW_DIALOG]: (state, action) => Object.assign({}, state, action),
		[ActionTypes.HIDE_DIALOG]: (state, action) => Object.assign({}, state, action),
		[ActionTypes.RESET_DIALOG]: (state, action, initialState) => initialState,
	}
);

export const page = CreateReducer(
	{
		fullPage: false,
		dialogName: null,
	},
	{
		[ActionTypes.UPDATE_PAGE_INFO]: (state, action) => Object.assign({}, state, action),
	}
);

// select all for the various pages

export const selectedAllItems = CreateReducer(
	{ checked: false },
	{
		[ActionTypes.SELECT_ALL_ITEMS]: (state, action, { checked }) => ({ ...state, checked: !state.checked }),
	}
);

export const selectedAllInvoices = CreateReducer(
	{
		checked: false,
	},
	{ [ActionTypes.SELECT_ALL_INVOICES]: (state, action, { checked }) => ({ ...state, checked: !state.checked }) }
);

export const selectedAllClients = CreateReducer(
	{
		checked: false,
	},
	{
		[ActionTypes.SELECT_ALL_CLIENTS]: (state, action, { checked }) => ({ ...state, checked: !state.checked }),
	}
);

export const selectedAllExpenses = CreateReducer(
	{
		checked: false,
	},
	{
		[ActionTypes.SELECT_ALL_EXPENSES]: (state, action, { checked }) => ({ ...state, checked: !state.checked }),
	}
);
