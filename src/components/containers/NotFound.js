import * as React from 'react';
import { withRouter } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import primary from '@material-ui/core/colors/blue';
import logo from '../../assets/vencru.svg';
import bgHero from '../../assets/bg-expand-reach-1.png'
import ReachUs from '../containers/ReachUs';
const styles = theme => ({
    // body: {
    //     backgroundColor: '#2D74DA',
    // },
    body: {
        backgroundColor: '#2D74DA',
    },
    root: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        background: `linear-gradient(0deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${bgHero})`,
        backgroundColor: '#2D74DA',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        width: '100vw',
    },
    container: {
        width: '100%',
        position: 'relative',
        padding: '0 50px',
    },
    header: {
        padding: '10px 0',
    },
    clearFix: {
        content: '',
        display: 'block',
        clear: 'both',
    },
    logo: {
        width: '124px !important',
        height: '10%',
        float: 'left',
        marginTop: '20px'
    },
    menu: {
        float: 'right',
    },
    content: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        // textAlign: 'center'
    },
    intro: {
        fontWeight: 'bolder',
    },
    bigIntro: {
        textTransform: 'uppercase',
        fontWeight: 900,
        color: '#fff',
    },
    bigNumber: {
        borderTop: '2px solid #fff',
        marginRight: '6px',
    },
    message: {
        color: '#fff',
        lineHeight: '20px',
        
    }, 
    link: {
        color: '#2D74DA',
        testDecorationLine: 'none'


    },
    linksContainer: {

    }, 
    button: {
        backgroundColor: '#fff',
        border: 'none',
        width: '100px',
        height: '35px',
        borderRadius: '3px',
        marginTop: '15px',
        lineHeight: '35px',
    },
    orWord: {
        color: '#fff',
        margin: '10px'

    },
    reachUs: {
        color: '#fff',
        Margin: '40px !important',
        paddingttom: 0,
        justifyContent: 'space-between'
    }
});

let Template = ({ fn, classes }) => (
    <div className={classes.root}>
        <div className={classes.container }>
            <div className={ classes.header }>
                <div className={classes.logo}>
                <a href="https://vencru.com">
                    <img src={ logo } alt="vencru Logo" />
                    </a>
                </div>
            </div>
            <div className={ classes.clearFix }></div>
            <div className={ classes.content }>
                <div className={ classes.intro }>
                    <h1 className={ classes.bigIntro }>
                        <span className={ classes.bigNumber }>404</span> Error.
                    </h1>
                    <Typography className={classes.message}>
                        The page you are looking for has either<br /> been moved or does not exist.
                </Typography>
                </div>
                <div className={classes.linksContainer}>
                    <button className={classes.button}><a href='javascript:;' className={classes.link} onClick={() => fn.goBack()}>Go Back</a>
                    </button>
                     {/* <span className= {classes.orWord}>OR</span>
                    <button className={classes.button}><a href='javascript:;' className={classes.link} onClick={() => fn.replace('/')}> Home</a> </button> */}
                </div>
                {/* <ReachUs classNames={classes.reachUs}  */}
            </div>
        </div>
       
    </div>
);

Template = withStyles(styles)(Template);

class NotFound extends React.Component{
    render() {
        return <Template
            fn={this.fn()}
        />
    }

    fn = () => ({
        replace: this.props.history.replace,
        goBack: this.props.history.goBack,
    })
}

export default withRouter(NotFound);