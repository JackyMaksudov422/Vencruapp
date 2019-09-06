import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent/SnackbarContent';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';

const variantIcon = {
    success: 'check',
    warning: 'warning',
    error: 'error',
    info: 'info',
};

const styles = theme => ({
    success: {
        backgroundColor: '#17BF5F',
    },
    error: {
        backgroundColor: '#F56A6A',
    },
    info: {
        backgroundColor: '#2D74DA',
    },
    warning: {
        backgroundColor: '#FE8500',
    },
    icon: {
        fontSize: 20,
        marginRight: 5
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15
    },
});

const CustomSnackbar = ({ 
    classes, 
    className, 
    hideSnackbar, 
    snackbar,
    resetSnackbar
}) => {
    const Icon = variantIcon[snackbar.variant];
    const variantClass = classes[snackbar.variant] || 'danger'
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => hideSnackbar()}
            onExited={() => resetSnackbar()}
        >
            <SnackbarContent
                className={`${variantClass} ${className | ""}`}
                aria-describedby="client-snackbar"
                message={
                    <span id="client-snackbar" className={classes.message}>
                        { Icon && <i className={`${classes.icon} material-icons`}>{Icon}</i>} 
                        { snackbar.message }
                    </span>
                }
            />
        </Snackbar>
    )
};

const mapStateToProps = ({
    snackbar
}) => ({
    snackbar
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    hideSnackbar: ActionCreators.hideSnackbar,
    resetSnackbar: ActionCreators.resetSnackbar
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CustomSnackbar));