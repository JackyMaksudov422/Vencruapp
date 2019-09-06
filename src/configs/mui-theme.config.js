import RedColor from '@material-ui/core/colors/red';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

export default createMuiTheme({
    palette: {
        primary: {
            light: '#5392FF',
            main : '#2D74DA',
            dark : '#25467A',
        },
        secondary: {
            light: '#1F57A4',
            main : '#25467A',
            dark : '#25467A',
        },
        error: {
            light: RedColor[100],
            main : RedColor[600],
            dark : RedColor[900],
        },
        type: 'light'
    },
    typography: {
        useNextVariants: true,
    }
});

export const drawerWidth = 240;