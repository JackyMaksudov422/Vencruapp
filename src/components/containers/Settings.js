import * as React from 'react';
import { connect } from 'react-redux';
import withRouter from 'react-router-dom/withRouter';
import Route from 'react-router-dom/Route';
import NavLink from 'react-router-dom/NavLink';
import ProfileSettings from './ProfileSettings';
import BusinessSettings from './BusinessSettings';
import PaymentSettings from './PaymentSettings';
import TeamMembers from './TeamMembers';
import DashboardSection from '../presentation/DashboardSection';
import SettingsUserCard from '../presentation/SettingsUserCard';
import Button from '../presentation/Button';

class Settings extends React.Component {
    render(){
		return (
        	<div className='app-authenticated-body settings-page'>
        		<div className='spanned text-right mb15'>
        			<Button 
        				variant='success'
        				size='sm'
        				children='Save'
        			/>
        		</div>
        		{/* user info section */}
        		<DashboardSection>
        			{/* settings user card */}
					<SettingsUserCard />
        		</DashboardSection>

        	 	{/* tabs */}
        		<DashboardSection>

        			<div className='settings-nav-tab'>
	        			{/* nav tab list */}
	        			<ul className='settings-nav-list desktop-navlist '>
	        				<li className='settings-nav-item'>
	        					<NavLink exact to='/settings' activeClassName='active'>
	        						Profile Settings
	        					</NavLink>
	        				</li>
							<li className='settings-nav-item'>
	        					<NavLink exact to='/settings2' activeClassName='active'>
	        						Profile Settings
	        					</NavLink>
	        				</li>
	        				<li className='settings-nav-item'>
	        					<NavLink exact to='/settings/business' activeClassName='active'>
	        						Business Settings
	        					</NavLink>
	        				</li>
	        				<li className='settings-nav-item'>
	        					<NavLink exact to='/settings/payment' activeClassName='active'>
	        						Payment Settings
	        					</NavLink>
	        				</li>
	        				<li className='settings-nav-item'>
	        					<NavLink exact to='/settings/team-members' activeClassName='active'>
	        						Team Members
	        					</NavLink>
	        				</li>
	        			</ul>
						


	        			{/* settings tab content */}
	        			<div className='settings-nav-tab-content'>
			        		<Route exact path='/settings' component={ProfileSettings}/>
							<Route exact path='/settings2' component={ProfileSettings}/>
			        		<Route exact path='/settings/business' component={BusinessSettings}/>
			        		<Route exact path='/settings/payment' component={PaymentSettings}/>
			        		<Route exact path='/settings/team-members' component={TeamMembers}/>
	        			</div>
        			</div>

        		</DashboardSection>
        	</div>
        );
    }
}

const mapStateToProps = (state) => ({ 
    // states go here
});

export default connect(mapStateToProps)(withRouter(Settings));