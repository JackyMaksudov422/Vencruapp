import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as UIReducers from './ui/reducers';
import * as AuthReducers from './auth/reducers';
import * as UserReducers from './user/reducers';
import * as ClientReducers from './clients/reducers';
import * as ItemReducers from './items/reducers';
import * as ExpenseReducers from './expenses/reducers';
import * as BankAccountsReducers from './banks/reducers';

var createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);

var reducers = Object.assign(
	{},
	UIReducers,
	AuthReducers,
	UserReducers,
	ClientReducers,
	ItemReducers,
	ExpenseReducers,
	BankAccountsReducers
);

reducers = combineReducers(reducers);

var store = createStoreWithMiddleware(
	reducers,
	window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
);

export default store;
