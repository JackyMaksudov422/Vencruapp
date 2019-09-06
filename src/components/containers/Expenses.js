import * as React from 'react';
import { withRouter, Route } from 'react-router-dom';
import ExpensesHome from './ExpensesHome';
import ExpensesCreate from './ExpensesCreate';
import ExpensesEdit from './ExpensesEdit';
import ExpenseInfo from './ExpenseInfo';

/**
 * component template
 */
let Template = ({fn}) => (
    <div className='app-authenticated-body expenses'>
        <Route path='/expenses' component={ExpensesHome} />
        <Route path='/expenses/create' component={ExpensesCreate} />
        <Route exact path='/expenses/:expenseId/edit' component={ExpensesEdit} />
        <Route exact path='/expenses/:expenseId/info' component={ExpenseInfo} />
    </div>
);

class Expenses extends React.Component {
    state = {

    };

    render(){
        return <Template 
            {...this.prps()} 
            fn={this.fn()} 
        />;
    }

    fn = () => ({
        // bound functions go here
    })

    prps = () => ({
        // template props go here
    })
}

export default withRouter(Expenses);