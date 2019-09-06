import React from 'react';
import { connect } from 'react-redux';
// import Button from '@material-ui/core/Button/Button';
import Button from './Button';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';

class AlertDialog extends React.Component {

    handleClose = (callback) => {
        if(this.props.alertDialog.open){
            this.props.hideAlertDialog();
            if(typeof callback == 'function'){
                callback();
            }
        }
    };

    render() {
        const { 
            alertDialog, 
            resetAlertDialog
        } = this.props;

        return (
            <Dialog
                open={alertDialog.open || false}
                onClose={() => this.handleClose()}
                onExited={() => resetAlertDialog()}
                disableEscapeKeyDown={alertDialog.disableEsc}
                disableBackdropClick={alertDialog.disableBackdropClick}
                transitionDuration={200}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className='vc-alert-dialog'
            >
                <DialogTitle id="alert-dialog-title" className='vc-alert-dialog-title'>
                    { alertDialog.heading }
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" className='vc-alert-dialog-content'>
                        { alertDialog.message }
                    </DialogContentText>
                </DialogContent>
                <DialogActions
                    className='vc-alert-dialog-actions'
                >
                    { this.getActions().map((item, index) => this.renderButton(item, index)) }
                </DialogActions>
            </Dialog>
        );
    }

    getActions(){
        const { alertDialog } = this.props;
        let item;

        // check if dialog actions have been set
        if(alertDialog.actions && alertDialog.actions.constructor == Array){
            let actions = [];

            for(var i = 0; i < alertDialog.actions.length; i++){
                item = Object.assign({}, alertDialog.actions[i]);
                let onClick = item.onClick;
                item.onClick = () => this.handleClose(onClick);
                actions.push(item);
            }

            return actions;
        }

        return [
            {
                onClick: () => this.handleClose(),
                text: 'Dismiss'
            }
        ]
    }

    renderButton(item, index){
        let variant = item.variant == 'destructive' ? 'danger' : item.variant == 'gray' ? 'gray' : 'primary';
        let handleClick = typeof item.onClick == 'function' ? item.onClick : () => this.handleClose();
        return (
            <Button 
                key={index} 
                onClick={handleClick} 
                variant={variant} 
                size='sm'
            >
                { item.text }
            </Button>
        )
    }
}

const mapStateToProps = ({
    alertDialog
}) => ({
    alertDialog
});

const mapDispatchToProps = dispatch => bindActionCreators({
    hideAlertDialog: ActionCreators.hideAlertDialog,
    resetAlertDialog: ActionCreators.resetAlertDialog
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AlertDialog);