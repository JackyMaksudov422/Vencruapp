import React from 'react';
import NavLink from 'react-router-dom/NavLink';
import withRouter from 'react-router-dom/withRouter';

class SettingsTab extends React.Component {
	render() {
		const { classes, showMobileNav } = this.props;
		return (
			<div className='settings-nav-tab'>
				{/* nav tab list */}
				<ul className='settings-nav-list  desktop-navlist'>
					<li className='settings-nav-item'>
						<NavLink exact to='/settings' activeClassName='active'>
							Profile Settings
    					</NavLink>
					</li>
					{/* <li className='settings-nav-item'>
						<NavLink exact to='/settings2' activeClassName='active'>
							Profile Settings2
    					</NavLink>
					</li> */}
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


				<div className={`${showMobileNav != 0 ? 'mobile-navlist' : 'hidden'}`}>
					<ul>

						{/* <li><NavLink exact to='/settings' activeClassName='active'>
							Profile Settings<em>></em>
    					</NavLink></li> */}
						<li><NavLink exact to='/settings/profile' activeClassName='active'>
							Profile Settings<em>></em>
    					</NavLink></li>
						<li><NavLink exact to='/settings/business' activeClassName='active'>
							Business Settings<em>></em>
    					</NavLink></li>
						<li><NavLink exact to='/settings/payment' activeClassName='active'>
							Payment Settings<em>></em>
    					</NavLink></li>
						<li><NavLink exact to='/settings/team-members' activeClassName='active'>
							Team Members<em>></em>
    					</NavLink></li>

					</ul>
				</div>


				{/* settings tab content */}
				<div
					className={`settings-nav-tab-content ${classes && classes.content || ''}`}
				>
					{this.props.children}
				</div>
			</div>

		);
	}
}

export default withRouter(SettingsTab);