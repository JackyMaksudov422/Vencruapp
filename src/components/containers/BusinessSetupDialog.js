import * as React from 'react';
import { withRouter } from 'react-router-dom';
import PageDialog from '../presentation/PageDialogs';
import Typography from '../presentation/Typography';
import Button from '../presentation/Button';

/**
 * component template
 */
let BusinessSetupDialog = ({ history, togglePageDialog }) => (
    <PageDialog
        backdropClose={false}
        escClose={false}
        show={true}
        afterDismiss={() => togglePageDialog()}
        contentClassNames='h-full md:h-auto'
    >
        <div className='business-setup-dialog'>
            <Typography
                size='lg'
                align='center'
                variant='active'
                className='heading mb30'
            >
                Welcome To Vencru
            </Typography>

            <Typography
                align='center'
                className='sub-heading mb60'
            >
                Better Business Management just ahead
            </Typography>

            <div className='spanned text-center'>
                <img
                    className='dialog-image'
                    src={require('../../assets/business-setup-macbook.png')}
                />
            </div>

            <Button
                variant='primary'
                className='setup-button'
                onClick={() => history.push('/onboarding')}
            >
                Set Up My Business
            </Button>
        </div>
    </PageDialog>
);

export default withRouter(BusinessSetupDialog);