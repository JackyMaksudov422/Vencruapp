import * as React from 'react';
import { withRouter, Route } from 'react-router-dom';
import ClientsHome from './ClientsHome';
import ClientsCreate from './ClientsCreate';
import ClientsEdit from './ClientsEdit';
import ClientsBusinessCard from './ClientsBusinessCard';
import ClientDetailedInfo from './ClientDetailedInfo';
import ImportCsv from './ImportClientCsv';

import PageWrapper from '../../components/wrappers/PageWrapper';
import InvoiceCreate from '../containers/InvoiceCreate';


const InvoiceCreatePage = () => (
    <PageWrapper
        noMenubar
        fullPage
    >
        <InvoiceCreate />
    </PageWrapper>
);

/**
 * component template
 */
let Template = ({ fn }) => (
    <div className='app-authenticated-body'>

        {/* New Routes */}
        
        {/* <Route exact path={["/clients","/clients/create"]} component={ClientsHome} /> */}
        <Route exact path="/clients" component={ClientsHome} />
        <Route exact path='/clients/create' component={ClientsCreate} />
        <Route exact path='/clients/importcsv' component={ImportCsv} />
        {/* <Route exact path={["/clients/:clientId(\d+)/", "/clients/create"]} component={ClientDetailedInfo} />         */}      
        <Route exact path='/clients/:clientId(\d+)/' component={ClientDetailedInfo} />
        <Route exact path='/clients/:clientId/create-invoice' component={InvoiceCreatePage} />
        <Route exact path='/clients/:clientId/edit' component={ClientsEdit} />
        <Route exact path='/clients/:clientId/business-card' component={ClientsBusinessCard} />

        {/* Old Routes */}

        {/* <Route exact  path={["/clients/create", "/clients"]} component={ClientsHome} />
        <Route exact path='/clients/create' component={ClientsCreate} />     
        <Route exact path='/clients/importcsv' component={ImportCsv} />
        <Route exact path='/clients/:clientId(\d+)/' component={ClientDetailedInfo} />
        <Route exact path='/clients/:clientId/create-invoice' component={InvoiceCreatePage} />
        <Route exact path='/clients/:clientId/edit' component={ClientsEdit} />
        <Route exact path='/clients/:clientId/business-card' component={ClientsBusinessCard} />         */}
    </div>
);

class Clients extends React.Component {
    state = {

    };

    render() {
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

export default withRouter(Clients);