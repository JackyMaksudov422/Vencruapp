//import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { connect } from 'react-redux';
import withRouter from 'react-router-dom/withRouter';
import NavLink from 'react-router-dom/NavLink';
import Button from '../presentation/Button';
import PageModal from '../presentation/PageModal';
import SubscriptionPlans from '../containers/SubscriptionPlans'
const more = require('../../assets/more.svg');

let showDropDownClass = false;

const toggleDropDown = () => {
	showDropDownClass = !showDropDownClass;
	return console.log(showDropDownClass);
}

let Template = ({ 
	fn, 
	menu, 
	visible, 
	blur, 
	emailConfirmed,
	showMoreDropDrown,
	showPlans,
	userInfo
}) => {
    if (!visible) {
        return null;
    }
    return (
        <div className={`vc-menubar ${blur ? 'vc-blur-it' : ''}`}>
			
            <div className='vc-menubar-inner'>
                <ul onClick={fn.closeDropDown}  className='vc-menubar-nav-list'>
                    <li className='nav-item'>
                        <NavLink to='/' activeClassName='active' exact>
                            <span className='nav-icon'>
                                <i className='material-icons'>dashboard</i>
                            </span>
                            <span className='nav-label'>
                                Dashboard
                            </span>
                        </NavLink>
                    </li>
                    { emailConfirmed &&
                    	<React.Fragment>
		                    <li className='nav-item'>
		                        <NavLink to='/sales' activeClassName='active'>
		                            <span className='nav-icon'>
		                                <i className='material-icons'>insert_drive_file</i>
		                            </span>
		                            <span className='nav-label'>
		                                Sales
		                            </span>
		                        </NavLink>
		                    </li>
		                    <li className='nav-item'>
		                        <NavLink to='/expenses' activeClassName='active'>
		                            <span className='nav-icon'>
		                                <i className='material-icons'>bar_chart</i>
		                            </span>
		                            <span className='nav-label'>
		                                Expenses
		                            </span>
		                        </NavLink>
		                    </li>
		                    <li className='nav-item'>
		                        <NavLink to='/items' activeClassName='active'>
		                            <span className='nav-icon'>
		                                <i className='material-icons'>shopping_cart</i>
		                            </span>
		                            <span className='nav-label'>
		                                Items
		                            </span>
		                        </NavLink>
		                    </li>
							<div className='dropdown'>
							<li onClick={fn.toggleDropDown} className='nav-item more-nav-item'>
							    <span className='nav-icon'>
									<i className="material-icons">more_horiz</i>
		                        </span>
								
		                        <span className='nav-label'>
		                            More
		                        </span>
		                    </li>
								<div id="more-dropdown" className={showMoreDropDrown ? `show dropdown-content` : `dropdown-content`}>
								<li className='nav-item'>
		                        <NavLink to='/clients' onClick={fn.toggleDropDown} activeClassName='active'>
		                            <i className='more-dropdown-icon material-icons'>contacts</i>
									&nbsp;
									&nbsp;
									&nbsp;
									&nbsp;
		                            Clients
		                        </NavLink>
		                    </li>
		                    {/* <li className='nav-item'>
		                        <NavLink to='/campaigns' onClick={fn.toggleDropDown} activeClassName='active'>
		                            <i className='more-dropdown-icon material-icons'>send</i>
									&nbsp;
									&nbsp;
		                            Campaign
		                        </NavLink>
		                    </li> */}
		                    <li className='nav-item'>
		                        <NavLink to='/settings' onClick={fn.toggleDropDown} activeClassName='active'>
		                            <i className='more-dropdown-icon material-icons'>settings</i>
									&nbsp;
									&nbsp;
		                            Settings
		                        </NavLink>
		                    </li>
						<li className='nav-item'>
							<NavLink to='/feedback' onClick={fn.toggleDropDown} activeClassName='active'>
								<i className='more-dropdown-icon material-icons'>feedback</i>
								&nbsp;
								&nbsp;
								Feedback
		                    </NavLink>
						</li>
								</div>
							</div>
		                    <li className='nav-item'>
		                        <NavLink to='/clients' activeClassName='active'>
		                            <span className='nav-icon'>
		                                <i className='material-icons'>contacts</i>
		                            </span>
		                            <span className='nav-label'>
		                                Clients
		                            </span>
		                        </NavLink>
		                    </li>
		                    {/* <li className='nav-item'>
		                        <NavLink to='/campaigns' activeClassName='active'>
		                            <span className='nav-icon'>
		                                <i className='material-icons'>send</i>
		                            </span>
		                            <span className='nav-label'>
		                                Campaign
		                            </span>
		                        </NavLink>
		                    </li> */}
		                    <li className='nav-item'>
		                        <NavLink to='/settings' activeClassName='active'>
		                            <span className='nav-icon'>
		                                <i className='material-icons'>settings</i>
		                            </span>
		                            <span className='nav-label'>
		                                Settings
		                            </span>
		                        </NavLink>
		                    </li>
						<li className='nav-item'>
							<NavLink to='/feedback' activeClassName='active'>
								<span className='nav-icon'>
									<i className='material-icons'>feedback</i>
								</span>
								<span className='nav-label'>
									Feedback
		                            </span>
							</NavLink>
						</li>
						<div className='mb-6 hidden md:block'>&nbsp;</div>
						{userInfo && userInfo.userplan.planKey === "PLN_trail" &&
							<div className='text-center text-black px-2 hidden md:block'>
								<div className='mb-3 px-4'>
									<Button
										variant='primary'
										type='submit'
										onClick={fn.toggleSubPlans}
									> Upgrade
									</Button>
								</div>
								<p>Currently on a <span className='text-brand-blue'>30 day trial</span>.</p>
								<p>Upgrade to continue to enjoy these benefits</p>
								{showPlans &&
									<PageModal
										backdropClose={false}
										escClose={false} 
										show={true}
										className=''
										onDismiss={method => fn.handlePlansDialogDismiss(method)}
									>
										<SubscriptionPlans
										/>
									</PageModal>
								}
							</div>
						}
                    	</React.Fragment>
                    }
                </ul>
            </div>
        </div>
    );
}

class Menubar extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			showMoreDropDrown : false,
			showSubPlans: false
		}
	}
	render() {
        return <Template

            {...this.prps()}
            fn={this.fn()}
        />;
	}

	toggleDropDown(){
		this.setState({
			showMoreDropDrown:!this.state.showMoreDropDrown
		});
	}
	closeDropDown(){
		if(!this.state.showMoreDropDrown){
			return;
		}
		this.toggleDropDown();
	}
    fn = () => ({
		navigate: (path) => this.navigate(path),
		toggleDropDown:() => this.toggleDropDown(),
		closeDropDown:() => this.closeDropDown(),
		toggleSubPlans: () => this.toggleSubPlans(),
		handlePlansDialogDismiss: (method) => this.handlePageDialogDismiss(method)
    })

    prps = () => ({
        visible: this.props.menubar.visible,
        menu: this.props.menubar.menu,
        blur: this.props.blur,
		emailConfirmed: this.props.emailConfirmed,
		showMoreDropDrown:this.state.showMoreDropDrown,
		showPlans: this.state.showSubPlans,
		userInfo: this.props.userInfo
    })

    navigate(path) {
        // go to specified path
	}
	
	toggleSubPlans(){
		this.setState({
			showSubPlans: !this.state.showSubPlans
		})
	}

	handlePageDialogDismiss(method){
        switch(method){
            case 'backdrop':
            case 'escape':
                this.toggleSubPlans();
            break;
        }
    }
}

const mapStateToProps = ({ menubar, userInfo }) => ({
	userInfo: userInfo.data,
    menubar,
    emailConfirmed: userInfo.data && 
		(userInfo.data.emailconfirmed === 'True' || 
		 userInfo.data.emailconfirmed === true
		) ? true : false
});

export default connect(mapStateToProps)(withRouter(Menubar))