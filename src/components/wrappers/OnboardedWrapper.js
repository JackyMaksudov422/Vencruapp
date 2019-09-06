import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import { PAGE_DIALOG } from '../../configs/data.config';

class OnboardedWrapper extends React.Component {

    componentDidMount() {
        this.checkSetup();
        if( !this.props.userInfo.data &&
            !this.props.userInfo.isFetching
        ){
            this.props.getUserInfo();
        }
    }

    componentDidUpdate(){
        this.checkSetup();
    }
    
    render() {
        return this.props.children || null;
    }
    
    checkSetup(){
        if(this.props.userInfo.isFetching){
            return;
        }
        const { currentBusiness } = this.props;
        let userInfo = Object.assign({}, this.props.userInfo.data);
        let incomplete = false;
        let fields = [
            'phonenumber',
            'address',
            'city',
            'country',
            'companyname',
            'isincorporated',
        ];

        // stop if user info is not available
        if(Object.keys(userInfo).length < 1){
            return;
        }

        // stop if email has not been confirmed
        if( userInfo.emailconfirmed == 'False' ||
            !userInfo.emailconfirmed
        ){
            return;
        }

        if(userInfo['business'].length < 1 || !currentBusiness){
            incomplete = true;
        }

        // look for an empty field
        // if(currentBusiness){
	       //  for(var i = 0; i < fields.length; i++){
	       //      if( currentBusiness[fields[i]] === null || 
	       //          (typeof currentBusiness[fields[i]] === 'string' && currentBusiness[fields[i]].trim().length < 1)
	       //      ){
	       //          incomplete = true;
	       //          break;
	       //      }
	       //  }
        // }

        // display setup dialog if business is not setup
        if(incomplete){
            if(this.props.page.dialogName != PAGE_DIALOG.BUSINESS_SETUP_REQUEST){
                this.props.togglePageDialog(PAGE_DIALOG.BUSINESS_SETUP_REQUEST);
            }
        }
    }
}

const mapStateToProps = ({userInfo, page}) => {
    return { 
    	userInfo,
    	page,
    	currentBusiness: userInfo.data && 
    		userInfo.data.business && 
    		userInfo.data
    			.business
    			.find(item => item.id == userInfo.data.currentbusinessid)
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showAlertDialog: ActionCreators.showAlertDialog,
    getUserInfo: ActionCreators.getUserInfo,
    togglePageDialog: ActionCreators.togglePageDialog
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OnboardedWrapper));