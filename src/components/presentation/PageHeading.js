import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        paddingLeft: theme.spacing.unit * 3,
        paddingRight: theme.spacing.unit * 3,
        paddingTop: theme.spacing.unit * 6,
        paddingBottom: theme.spacing.unit * 6,
        borderRadius: 0
    },
    title: {
        fontSize: '1.5em',
        color: '#fff'
    },
    subtitle: {
        fontSize: '1em',
        color: 'rgba(255,255,255, 0.7)',
        fontWeight: 300
    }
});

const PageHeading= ({ title, subtitle, classes }) => {
    return (
    <Paper className={classes.root} elevation={2}>
        <Typography className={classes.title}>{ title }</Typography>
        {subtitle && <Typography className={classes.subtitle}>{ subtitle }</Typography>}
    </Paper>
)};

export default withStyles(styles);