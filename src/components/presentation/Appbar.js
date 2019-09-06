import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { ActionCreators } from '../../data/actionCreators';
import AppbarSearch from './AppbarSearch';
import Button from './Button';
import Dropdown from './Dropdown';
import AppbarNotification from './AppbarNotification';
import AppbarUser from './AppbarUser';

let Template = ({ fn, visible, blur, pageName, pathname }) => {
	if (!visible) {
		return null;
	}
	return (
		<div>
			<div className={`vc-appbar ${blur ? 'vc-blur-it' : ''}`}>
				<div className="brand-container">
					<img className="brand" src={require('../../assets/dashboard-logo.png')} alt="brand-logo" />
				</div>
				<div
					className={
						(pageName || pathname.split('/')[pathname.split('/').length - 1].toUpperCase()).includes(
							'Settings'
						) == true
							? 'page-click-outer hide'
							: 'page-click-outer show'
					}
				>
					<div className="page-name-click mobile-items-header" onClick={() => fn.handleCheckAll()}>
						<span>
							{' '}
							<img className="brand" src={require('../../assets/tick-rect.png')} alt="add" />
						</span>
					</div>
					{/* Show create invoice/receipt dropdown if the path is on sales */}
					{pathname.includes('sales') &&
						<div className='md:hidden -mt-3'>
						<Dropdown
							type="button"
							variant="link"
							size="sm"
							align="left"
							label={
								<img className="brand" src={require('../../assets/add.png')} alt="add" />
							}
							onChange={event => fn.handleChange(event)}
							options={['Send Invoice', 'Create new Receipt']}
						/>
						</div>
					}
					{/* else link to normal create path */}
					{!pathname.includes('sales') &&
						<Link to={pathname.includes('sales') ? `${pathname}/create-invoice` : `${pathname}/create`}>
							<div className="page-name-click mobile-items-header">
							<span>
								{' '}
								<img className="brand" src={require('../../assets/add.png')} alt="add" />
							</span>
							</div>
						</Link>
					}
				</div>
				<div
					className={
						(pageName || pathname.split('/')[pathname.split('/').length - 1].toUpperCase()).includes(
							'Settings'
						) == true
							? 'mobile-items-header page-name-click page-click-outer show'
							: 'mobile-items-header page-click-outer hide'
					}
				>
					<span className="go-back" onClick={() => fn.goBack()}>
						&#x3c;
					</span>
				</div>
				<div className="page-name-container">
					<span id="pageName">{(pageName === 'Sales') ? 'Invoices' : pageName}</span>
				</div>
				<div className="content">
					{/* <div className="search-container"> */}
						{/* <AppbarSearch
							ref={ref => fn.setSearchField(ref)}
							onChange={value => fn.handleSearchChange(value)}
						/> */}
					{/* </div> */}
					<div className="user-content-container">
						<Dropdown
							type="button"
							variant="primary"
							size="sm"
							classes={{ container: 'create-dropdown-button' }}
							label="Create New..."
							align="right"
							onChange={event => fn.handleChange(event)}
							options={['New Invoice', 'New Client', 'New Expense']}
						/>
						<AppbarNotification />

						<Dropdown
							type="button"
							size="sm"
							classes={{
								container: 'user-dd-button-container',
							}}
							align="right"
							label={<AppbarUser />}
							onChange={event => fn.handleChange(event)}
							options={['Edit Account Settings', 'Logout']}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

class Appbar extends React.Component {
	state = {};

	render() {
		return <Template {...this.prps()} fn={this.fn()} />;
	}
	goBack() {
		this.props.history.goBack();
	}
	fn = () => ({
		goBack: () => this.props.history.goBack(),
		setSearchField: ref => this.setSearchField(ref),
		handleSearchChange: value => this.setState({ search: value }),
		logout: () => this.props.history.push('/logout'),
		editProfile: () => this.props.history.push('/settings'),
		handleChange: e => {
			if (e.target.value === 'Logout') {
				this.props.history.push('/logout');
			} else if (e.target.value === 'Edit Account Settings') {
				this.props.history.push('/settings');
			} else if (e.target.value === 'New Expense') {
				this.props.history.push('/expenses/create');
			} else if (e.target.value === 'New Client') {
				this.props.history.push('/clients/create');
			} else if (e.target.value === 'New Invoice' || e.target.value === 'Send Invoice') {
				this.props.history.push('/sales/create-invoice');
			}else if(e.target.value === 'Create new Receipt'){
				this.props.history.push('/sales/create-receipt');
			}
		},
		handleCheckAll: () => {
			const { selectAllClients, selectAllExpenses, selectAllInvoices, selectAllItems } = this.props;
			if (this.props.location.pathname.includes('expenses')) {
				return selectAllExpenses();
			} else if (this.props.location.pathname.includes('items')) {
				return selectAllItems();
			} else if (this.props.location.pathname.includes('clients')) {
				return selectAllClients();
			} else if (this.props.location.pathname.includes('invoices')) {
				return selectAllInvoices();
			}
		},
	});

	prps = () => ({
		visible: this.props.appbar.visible,
		blur: this.props.blur,
		pageName: this.props.menubar.menu,
		pathname: this.props.location.pathname,
	});

	setSearchField(ref) {
		if (!this.searchField) {
			this.searchField = ref;
		}
	}
}

const mapStateToProps = ({ appbar, menubar }) => ({
	appbar,
	menubar,
});

const mapDispatchToProps = dispatch => {
	const { logout, selectAllExpenses, selectAllInvoices, selectAllItems, selectAllClients } = ActionCreators;
	return bindActionCreators(
		{
			logout,
			selectAllInvoices,
			selectAllExpenses,
			selectAllItems,
			selectAllClients,
		},
		dispatch
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(Appbar));
