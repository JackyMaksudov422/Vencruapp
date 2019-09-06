import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';

const styles = theme => ({
    root: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%'
    }
});

const Progress = ({ classes, color }) => {
    return (
    <div className={classes.root} elevation={2}>
        <LinearProgress
            color={color || 'secondary'}
        />
    </div>
)};

export default withStyles(styles)(Progress);