import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from '../presentation/Button';
import Dropdown from '../presentation/Dropdown';
import propTypes from 'prop-types';
import OverlayProgress from '../presentation/OverlayProgress';
import {
	ROLE_DESCRIPTIONS,
	PRIVILEGES
} from '../../configs/data.config.js';
import { ActionCreators } from '../../data/actionCreators';
import { bindActionCreators } from 'redux';
import {
	GET_TEAM_MEMBERS,
	REMOVE_TEAM_MEMBER,
	RESEND_TEAM_MEMBER_INVITE
} from '../../configs/api.config';
import TeamMemberCreate from './TeamMemberCreate';
import TeamMemberEdit from './TeamMemberEdit';
import DashboardSection from '../presentation/DashboardSection';
import SettingsUserCard from '../presentation/SettingsUserCard';
import SettingsTab from '../presentation/SettingsTab';
import Table from '../presentation/Table';
import TableCell from '../presentation/TableCell';
import TableBody from '../presentation/TableBody';
import TableHead from '../presentation/TableHead';
import TableRow from '../presentation/TableRow';
import Typography from '../presentation/Typography';
const avatar = require('../../assets/avatar.jpg');

const TeamMembersBasicInfo = ({
	firstname,
	lastname,
	memberemail
}) => {
	return (
		<div className='vc-team-member-basic-info'>
			<img src={avatar} />
			<div className='info'>
				<h4 className='name'>{`${firstname} ${lastname}`}</h4>
				<h6 className='email'>{memberemail}</h6>
			</div>
		</div>
	);
};

/**
 * component template
 */
let Template = ({
	fn,
	list,
	formType,
	selectedTeamMember,
	isFetching,
	errorMessage,
	isDeleting,
	isResendingInvite
}) => (
		<div className='app-authenticated-body settings-page business-settings member-list'>
			{/* user info section */}
			<DashboardSection>
				{/* settings user card */}
				<SettingsUserCard />
			</DashboardSection>

			{/* tabs */}
			<DashboardSection>

				<SettingsTab
					classes={{
						content: 'pt20 ph30'
					}}
					showMobileNav={false}
				>
					<div className='spanned'>
						<Table className='vc-table-simple'>
							{/* table head */}
							{list && list.constructor == Array && list.length > 0 &&
								<TableHead>
									<TableRow type='th'>
										<TableCell
											className='text-right'
										>
											<h2 className='mv0 normal-font t-member' style={{ fontSize: 16 }}>Team Member</h2>
										</TableCell>
										<TableCell className='text-left' >
											<h2 className='mv0 normal-font' style={{ fontSize: 16 }}>Role</h2>
										</TableCell>
										<TableCell className='text-left' >
											<h2 className='mv0 normal-font' style={{ fontSize: 16 }}>Privileges</h2>
										</TableCell>
										<TableCell >
											&nbsp;
			                        </TableCell>
									</TableRow>
								</TableHead>
							}

							<TableBody>
								{/* table body */}
								{list && list.constructor == Array && list.map((item, index) => {
									if (isDeleting == item.id) return null;
									return (
										<TableRow withSeparator key={index}>
											<TableCell>
												<TeamMembersBasicInfo
													firstname={`${item.firstname}`}
													lastname={item.lastname}
													memberemail={item.memberemail}
												/>
											</TableCell>
											<TableCell>
												<span>
													{ROLE_DESCRIPTIONS[item.roles] || 'Unknown'}
												</span>
											</TableCell>
											<TableCell>
												{fn.getPrivileges(item.roles).join(', ')}
											</TableCell>
											<TableCell>
												<div className='team-member-action-buttons text-right'>
													<Button size='sm'>
														View Dashboard
			                                    </Button>
													<Dropdown
														iconButton
														icon={<i className='material-icons'>more_vert</i>}
														options={['Edit', 'Delete'].concat(
															!item.status && ['Resend Invite']
														)}
														align='right'
														variant='link-gray'
														onChange={(event) => fn.handleSelectMemberAction(event.target.value, item)}
													/>
												</div>
											</TableCell>
											<TableCell showOnMobile mobileOnly>
												<Button
													variant='link-primary'
													className='add-button member'
													onClick={fn.addTeamMember}
													type='button'
												>
													<i className="icon ion-md-add-circle-outline"></i>
													&nbsp;
							<span>Add Team Member</span>
												</Button>
												<div className="member-list-header">
													<span className="item-name"><TeamMembersBasicInfo
														firstname={`${item.firstname}`}
														lastname={item.lastname}
														memberemail={item.memberemail}
													/></span>
													<span className="item-description">
														{ROLE_DESCRIPTIONS[item.roles] || 'Unknown'}
													</span>
												</div>
												<div className='team-member-action-buttons text-right'>
													<Button size='sm'>
														View
			                                    </Button>
													<Dropdown
														iconButton
														icon={<i className='material-icons'>more_vert</i>}
														options={['Edit', 'Delete'].concat(
															!item.status && ['Resend Invite']
														)}
														align='right'
														variant='link-gray'
														onChange={(event) => fn.handleSelectMemberAction(event.target.value, item)}
													/>
												</div>
											</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						</Table>
						{(isFetching || isResendingInvite) && <OverlayProgress />}
					</div>

					<div className='vc-team-members-manager mt40 text-center'>
						<div className='main'>
							{!isFetching && errorMessage &&
								<div className='spanned load-failure text-center pv60'>
									<i className="icon ion-md-close-circle-outline"></i><br />
									<Typography>{errorMessage}</Typography><br />
									<Button
										variant='outline-primary'
										size='sm'
										onClick={fn.fetch}
									>Try Again</Button>
								</div>
							}

							<Button
								variant='link-primary'
								className='add-button desktop-btn'
								onClick={fn.addTeamMember}
								type='button'
							>
								<i className="icon ion-md-add-circle-outline"></i>
								&nbsp;
							<span>Add Team Member</span>
							</Button>
						</div>
					</div>

					{formType == 'add-team-member' &&
						<TeamMemberCreate
							onCancel={fn.handleAddTeamMemberCancel}
							onComplete={fn.handleAddTeamMemberComplete}
						/>
					}

					{formType == 'edit-team-member' &&
						selectedTeamMember &&
						<TeamMemberEdit
							data={selectedTeamMember}
							onCancel={fn.handleEditTeamMemberCancel}
							onComplete={fn.handleEditTeamMemberComplete}
						/>
					}
				</SettingsTab>

			</DashboardSection>
		</div>
	);

class TeamMembers extends React.Component {

	static propTypes = {
		setRef: propTypes.func,
		onRequestCreate: propTypes.func,
		onRequestEdit: propTypes.func,
	};

	state = {
		isFetching: false,
		errorMessage: true,
		list: [],
		formType: null,
		selectedTeamMember: null,
		isDeleting: null
	};

	constructor(props) {
		super(props);
		document.getElementById("pageName").innerText = "Team Members";
	}

	componentDidMount() {
		this.mounted = true;
		if (typeof this.props.setRef == 'function') {
			this.props.setRef(this);
		}
		this.fetch();
	}

	componentWillUnmount() {
		this.mounted = false;
		if (typeof this.props.setRef == 'function') {
			this.props.setRef(undefined);
		}
	}

	render() {
		return <Template
			{...this.prps() }
			fn={this.fn()}
		/>;
	}

	fn = () => ({
		handleAddTeamMemberComplete: (teamMemberInfo) => this.handleAddTeamMemberComplete(
			teamMemberInfo
		),
		handleEditTeamMemberComplete: (teamMemberInfo) => this.handleEditTeamMemberComplete(
			teamMemberInfo
		),
		handleAddTeamMemberCancel: (teamMemberInfo) => this.handleAddTeamMemberCancel(),
		handleEditTeamMemberCancel: (teamMemberInfo) => this.handleEditTeamMemberCancel(),
		setRef: (name, ref) => this.setRef(name, ref),
		addTeamMember: () => this.setState({
			formType: 'add-team-member',
			selectedTeamMember: null
		}),
		handleSelectMemberAction: (action, teamMember) => this.handleSelectMemberAction(action, teamMember),
		fetch: () => this.fetch(),
		getPrivileges: role => this.getPrivileges(role),
	});

	prps = () => ({
		isFetching: this.state.isFetching,
		isResendingInvite: this.state.isResendingInvite,
		isDeleting: this.state.isDeleting,
		list: this.state.list,
		selectedTeamMember: this.state.selectedTeamMember,
		formType: this.state.formType,
		errorMessage: this.state.errorMessage
	});

	setRef(name, ref) {
		if (this[name]) return;
		this[name] = ref;
	}

	getPrivileges(role) {
		let list = [];
		for (var i in PRIVILEGES) {
			if (PRIVILEGES[i].roles.indexOf(role) !== -1) {
				list.push(PRIVILEGES[i].label);
			}
		}
		return list;
	}

	handleAddTeamMemberComplete(newTeamMember) {
		this.setState({
			formType: null
		}, () => {
			const {
    			isFetching,
				errorMessage,
				list
    		} = this.state;

			if (list && list.length > 0) {
				this.takeData([newTeamMember]);
				return;
			}

			if (!isFetching &&
				errorMessage &&
				(!list || list.length < 1)) {
				this.fetch();
			}

		});
	}

	handleEditTeamMemberComplete(editedTeamMember) {
		this.setState({
			formType: null
		}, () => {
			let teamMembersList = [...this.state.list];
			let index = teamMembersList.findIndex(item => item.id == editedTeamMember.id);
			if (index >= 0) {
				teamMembersList[index] = {
					...teamMembersList[index],
					...editedTeamMember
				};
				this.setState({
					list: teamMembersList
				});
			}
		});
	}

	handleAddTeamMemberCancel() {
		this.setState({
			formType: null
		})
	}

	handleEditTeamMemberCancel() {
		this.setState({
			formType: null,
			selectedTeamMember: null
		})
	}

	fetch() {
		const { currentBusiness } = this.props;
		this.setState({
			isFetching: true,
			errorMessage: null
		}, () => {
			setTimeout(() => {
				GET_TEAM_MEMBERS(
					currentBusiness && currentBusiness.id
				).then(response => {
					if (this.mounted) {
						this.setState({
							isFetching: false,
							list: response
						});
					}
				}).catch(error => {
					if (this.mounted) {
						let errorMessage = typeof error == 'string' &&
							error ||
							'Failed to load team members.';

						this.setState({
							isFetching: false,
							errorMessage
						});
					}
				});
			}, 1000);
		})
	}

	takeData(data) {
		let list = [].concat(
			data,
			this.state.list
		);
		this.setState({
			list: list
		});
	}

	handleRequestEdit(teamMemberInfo) {
		if (typeof this.props.onRequestEdit == 'function') {
			this.props.onRequestEdit(teamMemberInfo);
		}
	}

	deleteTeamMember(teamMember) {
		if (this.state.isDeleting) {
			return;
		}
		const { currentBusiness } = this.props;
		let reqData = {
			id: teamMember.id,
			businessid: currentBusiness && currentBusiness.id
		};

		this.props.showAlertDialog(
			'',
			'Are you sure you want to remove this team member?',
			[
				{ text: 'No' },
				{
					text: 'Yes, Remove',
					onClick: () => this.doDeleteTeamMember(reqData),
					variant: 'destructive'
				}
			]
		);

	}

	doDeleteTeamMember(data) {
		this.setState({
			isDeleting: data.id
		}, () => {
			setTimeout(() => {
				REMOVE_TEAM_MEMBER(data).then(response => {
					if (this.mounted) {
						const { list } = this.state;

						// get index of deleted item
						let index = list.findIndex(
							item => item.id == data.id
						);

						// delete item from team members list if found
						if (index >= 0) {
							list.splice(index, 1);
						}

						// show success message
						this.props.showSnackbar(
							'Team Member information deleted.',
							{ variant: 'success' }
						);

						// update component state
						this.setState({
							isDeleting: null,
							list: list
						});
					}
				}).catch(error => {
					if (this.mounted) {
						let errorMessage = typeof error == 'string' &&
							error ||
							'Failed remove team member.';

						this.props.showSnackbar(
							errorMessage,
							{ variant: 'error' }
						);

						this.setState({
							isDeleting: null,
						});
					}
				});
			}, 1000);
		})
	}

	resendInvite(teamMember) {
		if (this.state.isResendingInvite) {
			return;
		}
		const { currentBusiness } = this.props;
		let reqData = {
			id: teamMember.id,
			memberemail: teamMember.memberemail,
			firstname: teamMember.firstname,
			lastname: teamMember.lastname,
			roles: teamMember.roles,
			status: teamMember.status,
			businessid: currentBusiness && currentBusiness.id
		};

		this.props.showAlertDialog(
			'',
			'Resend team member invite?',
			[
				{ text: 'No', variant: 'gray' },
				{
					text: 'Yes, Resend',
					onClick: () => this.doResendInvite(reqData)
				}
			]
		);

	}

	doResendInvite(reqData) {
		this.setState({
			isResendingInvite: reqData.id
		}, () => {
			setTimeout(() => {
				RESEND_TEAM_MEMBER_INVITE(reqData).then(response => {
					if (this.mounted) {
						// show success message
						this.props.showSnackbar(
							'Invite successfully sent.',
							{ variant: 'success' }
						);

						// update component state
						this.setState({
							isResendingInvite: null
						});
					}
				}).catch(error => {
					if (this.mounted) {
						let errorMessage = typeof error == 'string' &&
							error ||
							'Failed resend the invite.';

						this.props.showSnackbar(
							errorMessage,
							{ variant: 'error' }
						);

						this.setState({
							isResendingInvite: null,
						});
					}
				});
			}, 1000);
		})
	}

	handleSelectMemberAction(option, teamMember) {
		switch (option) {
			case 'Edit':
				this.setState({
					formType: 'edit-team-member',
					selectedTeamMember: teamMember
				});
				break;
			case 'Delete':
				this.deletTeamMember(teamMember);
				break;
			case 'Resend Invite':
				this.resendInvite(teamMember);
				break;
		}
	}
}

const mapStateToProps = ({
	userInfo
}) => ({
		userInfo: userInfo.data,
		currentBusiness: userInfo.data &&
			userInfo.data.business &&
			userInfo.data
				.business
				.find(
				item => item.id == userInfo.data.currentbusinessid
				)
	});

const mapDispatchToProps = (dispatch) => bindActionCreators({
	showSnackbar: ActionCreators.showSnackbar,
	showAlertDialog: ActionCreators.showAlertDialog,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(TeamMembers));