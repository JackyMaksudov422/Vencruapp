import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Drawer from '@material-ui/core/Drawer/Drawer';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import Typography from '@material-ui/core/Typography/Typography';
import Hidden from '@material-ui/core/Hidden/Hidden';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import SettingsIcon from '@material-ui/icons/SettingsApplicationsOutlined';
import DashboardIcon from '@material-ui/icons/Dashboard';
import UsersIcon from '@material-ui/icons/People';
import { drawerWidth } from '../../configs/theme.config';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';

const styles = theme => ({
    drawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.up('md')]: {
            position: 'relative',
        },
    },
    menuLabel: {

    },
    activeMenu: {

    }
});

let Menu = ({classes, menu, submenu}) => (
    <List component="nav">
            {/* dashboard */}
            <ListItem button onClick={() => {}}
                className={`${menu == 'Dashboard' ? classes.activeMenu : ''}`}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <Typography className={classes.menuLabel}>Dashboard</Typography>
            </ListItem>
            {/* users */}
            <ListItem button onClick={() => {}}
                className={`${menu == 'Users' ? classes.activeMenu : ''}`}>
                <ListItemIcon>
                    <UsersIcon />
                </ListItemIcon>
                <Typography className={classes.menuLabel}>Users</Typography>
            </ListItem>
            {/* settings */}
            <ListItem button onClick={() => {}}
                className={`${menu == 'Settings' ? classes.activeMenu : ''}`}>
                <ListItemIcon>
                    <SettingsIcon />
                </ListItemIcon>
                <Typography className={classes.menuLabel}>Settings</Typography>
            </ListItem>
        </List>
);
Menu = withStyles(styles)(Menu);

let Template = ({ fn, classes, menu, submenu, visible, remove }) => {
    if(remove){
        return null;
    }
    return (
        <div>
            <Hidden mdUp>
                <Drawer
                    variant="temporary"
                    anchor='left'
                    open={visible}
                    onClose={fn.handleDrawerToggle}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{ keepMounted: true }}
                >
                    <Menu menu submenu />
                </Drawer>
            </Hidden>
            <Hidden smDown implementation="css">
                <Drawer
                    variant="permanent"
                    open
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <Menu menu submenu />
                </Drawer>
            </Hidden>
        </div>
    );
}
Template = withStyles(styles)(Template);

class AppDrawer extends React.Component{

    componentWillUnmount(){
        this.props.hideDrawer();
    }

    render(){
        return <Template
            { ...this.prps() }
            fn={this.fn()}
        />;
    }

    fn = () => ({
        handleDrawerToggle: this.handleDrawerToggle.bind(this),
        navigate: this.navigate.bind(this)
    })

    prps = () => ({
        visible: this.props.drawer.visible,
        menu: this.props.drawer.menu,
        submenu: this.props.drawer.submenu,
        remove: this.props.drawer.remove,
    })

    handleDrawerToggle = () => {
        const { drawer, showDrawer, hideDrawer } = this.props;
        if(drawer.visible){
            showDrawer();
        }
        else{
            hideDrawer();
        }
    };

    navigate(){
        this.props.hideDrawer();
    }
}

const mapStateToProps = ({ drawer }) => ({
    drawer
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showDrawer: ActionCreators.showDrawer,
    hideDrawer: ActionCreators.hideDrawer,
}, dispatch)

export default connect(mapStateToProps)(AppDrawer)