import React from 'react';
import { connect } from 'react-redux';
import PlainCard from './PlainCard';
import Button from './Button';
import PageModal from './PageModal';
import SubscriptionPlans from '../containers/SubscriptionPlans';
import Typography from './Typography';
import Link from 'react-router-dom/Link';
const avatar = require('../../assets/avatar.jpg');

class SettingsUserCard extends React.Component{
	render(){
		const {
			hideProfileButton,
			onSelectProfilePicture,
			onUndoSelectProfilePicture,
			newAvatar,
			userInfo
		} = this.props;

		const { showPlans } = this.state;

		// display nothing if no user info is available yet.
		if(!userInfo) return null;

		var hideUserCard = false;
		if(window.location.href.indexOf("/settings/")>0)
			hideUserCard = true;
		if(hideUserCard)
			return null;
		// render the card's UI
		return (
			<PlainCard>
				<div className="flex flex-col md:flex-row items-center w-full">
					<img 
						src={newAvatar || userInfo.profileimageurl || avatar} 
						className='w-32 h-32 rounded-full my-4 md:my-0'
						alt='avatar'
					/>
					<div className='md:w-full md:ml-8 md:mt-6'>
						<div className='flex flex-col md:flex-row md:mb-4'>
							<div className="text-sm mb-4">
								<p className="text-grey-dark mb-2">Points Earned</p>
								<p className="text-black text-base leading-none">1234</p>
							</div>
						</div>
						<div className='flex flex-col md:flex-row'>
							<div className="md:w-1/4 text-sm mb-4">
								<p className="text-grey-dark mb-2">Full name</p>
								<p className="text-black text-base leading-none">{userInfo.firstname} {userInfo.lastname}</p>
							</div>
							<div className="md:w-1/4 text-sm">
								<p className="text-grey-dark mb-2">Status</p>
								<p className="text-black text-base leading-none">{ this.currentBusinessRole() }</p>
							</div>
							<div className="md:w-1/4 text-sm hidden md:block">
								<p className="text-grey-dark mb-2">Date Joined</p>
								<p className="text-black text-base leading-none">12/21/32</p>
							</div>
							<div className="md:w-1/4 hidden md:block">
								{typeof onSelectProfilePicture == 'function' && !newAvatar &&
									<div className=''>
										<Button
											variant='primary'
											type='button'
										>
											Upload Picture
										</Button>
										<input 
											ref={ref => this.selectField = ref}
											type='file' 
											onChange={(event) => this.handleFileSelected(event)}
										/>
									</div>
								}
								{typeof onUndoSelectProfilePicture == 'function' && newAvatar &&
									<Button
										variant='primary'
										type='button'
										onClick={onUndoSelectProfilePicture}
									>
										Undo Picture Select
									</Button>
								}
								{!hideProfileButton && 
									<Link
										className='vc-button vc-button-primary'
										to='/settings'
									>
										Edit Profile
									</Link>
								}
							</div>
						</div>
						<div className='mb-2 md:hidden'></div>
						{userInfo && userInfo.userplan.planKey === "PLN_trail" &&
							<div className='text-center text-black px-2 md:hidden'>
								<div className='mb-2 px-4'>
									<Button
										variant='primary'
										type='submit'
										onClick={() => {
											this.setState({
												showPlans: !showPlans
											})
										}}
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
										onDismiss={method => this.handlePlansDialogDismiss(method)}
									>
										<SubscriptionPlans
										/>
									</PageModal>
								}
							</div>
						}
					</div>
				</div>
			</PlainCard>
		);
	}

	constructor(props){
		super(props);
		this.state = {
			showPlans: false
		};
	}

	currentBusinessRole(){
		const { currentBusiness, userInfo } = this.props;
		if(currentBusiness){
			if(currentBusiness.ownerid == userInfo.userid){
				return 'Business Owner';
			}
			return currentBusiness.role || 'Staff';
		}
		return 'Staff';
	}

	handleFileSelected(event){
		if(typeof this.props.onSelectProfilePicture == 'function'){
			this.props.onSelectProfilePicture(event);
		}

		if(this.selectField){
			this.selectField.value = '';
		}
	}

	handlePlansDialogDismiss(method){
		const { showPlans } = this.state;
        switch(method){
            case 'backdrop':
            case 'escape':
				this.setState({
					showPlans: !showPlans
				});
				return
            break;
        }
	}
}

const mapStateToProps = ({userInfo, currentBusiness}) => ({
	userInfo: userInfo.data,
	currentBusiness: currentBusiness.data || null,
});

export default connect(mapStateToProps)(SettingsUserCard);