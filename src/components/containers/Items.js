import * as React from 'react';
import { withRouter, Route } from 'react-router-dom';
import ItemsHome from './ItemsHome';
import ItemsCreate from './ItemsCreate';
import ItemsEdit from './ItemsEdit';
import ImportCsv from './ImportItemCsv';
/**
 * component template
 */
let Template = ({fn}) => (
    <div className='app-authenticated-body items-container items'>
        <Route path='/items' component={ItemsHome} />
        <Route exact path='/items/create' component={ItemsCreate} />
        <Route exact path='/items/importcsv' component={ImportCsv} />
        <Route exact path='/items/:itemId/edit' component={ItemsEdit} />
        
    </div>
);

class Items extends React.Component {
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

export default withRouter(Items);