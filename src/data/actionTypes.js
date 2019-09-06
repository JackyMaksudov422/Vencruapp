import * as UIActionTypes from './ui/actionTypes';
import * as AuthActionTypes from './auth/actionTypes';
import * as UserActionTypes from './user/actionTypes';
import * as ClientsActionTypes from './clients/actionTypes';
import * as ItemsActionTypes from './items/actionTypes';
import * as ExpensesActionTypes from './expenses/actionTypes';
import * as BankAccountsActionTypes from './banks/actionTypes';

export const ActionTypes = Object.assign({}, 
    UIActionTypes, 
    AuthActionTypes, 
    UserActionTypes,
    ClientsActionTypes,
    ItemsActionTypes,
    ExpensesActionTypes,
    BankAccountsActionTypes,
);