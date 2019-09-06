import * as UIActionCreators from './ui/actionCreators';
import * as AuthActionCreators from './auth/actionCreators';
import * as UserActionCreators from './user/actionCreators';
import * as ClientsActionCreators from './clients/actionCreators';
import * as ItemsActionCreators from './items/actionCreators';
import * as ExpensesActionCreators from './expenses/actionCreators';
import * as BankAccountsActionCreators from './banks/actionCreators';

export const ActionCreators = Object.assign({}, 
    UIActionCreators,
    AuthActionCreators,
    UserActionCreators,
    ClientsActionCreators,
    ItemsActionCreators,
    ExpensesActionCreators,
    BankAccountsActionCreators,
);