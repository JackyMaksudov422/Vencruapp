import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import TeamMemberForm from './TeamMemberForm';
import PageDialog from '../presentation/PageDialogs';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import OverlayProgress from '../presentation/OverlayProgress';
import { storageGet } from '../../helpers/Storage';
import { STORAGE_KEYS } from '../../configs/storage.config';
import { INVITE_TEAM_MEMBER } from '../../configs/api.config';
import Button from '../presentation/Button';
import ContentCircularLoader from '../presentation/ContentCircularLoader';
import propTypes from 'prop-types';

/**
 * component template
 */
let Template = ({
	fn,
	isFetching,
	currentBusiness
}) => (
    <PageDialog
        backdropClose={false}
        escClose={false} 
        show={true}
        className='team-members-form-page-dialog'
        onDismiss={method => fn.handlePageDialogDismiss(method)}
    >
        <TeamMemberForm
            setRef={(ref) => fn.setForm(ref)}
            title='Add your team members'
            submitLabel='Add Team Member'
            onCancel={() => fn.handleCancelPress()}
            onSubmit={(data) => fn.handleSubmit(data)}
            disabled={isFetching}
            currentBusiness={currentBusiness}
        />

        { isFetching && <OverlayProgress/> }
    </PageDialog>
);

class TeamMemberCreate extends React.Component {

	static propTypes = {
		onComplete: propTypes.func.isRequired,
		onCancel: propTypes.func.isRequired,
	};

    state = {
        isFetching: false,
    };

    componentDidMount(){
    	this.mounted = true;
    }

    componentWillUnmount(){
    	this.mounted = false;
    }

    render(){
        return <Template 
            {...this.prps()} 
            fn={this.fn()} 
        />;
    }

    fn = () => ({
        handleSubmit: (data) => this.handleSubmit(data),
        handlePageDialogDismiss: method => this.handlePageDialogDismiss(
        	method
        ),
        setForm: (form) => this.setForm(form),
        handleCancelPress: () => this.handleCancelPress(),
    })

    prps = () => ({
        isFetching: this.state.isFetching,
        currentBusiness: this.props.currentBusiness
    })

    setForm(form){
        this.form = form;
    }

    handleSubmit(data){
        let business = this.props.currentBusiness;
        let fields = Object.keys(data);
        window.scrollTo(0,0);
        let reqData = {
        	...data,
        	businessid: business && business.id

        };

        // do create teammembers
        this.save(reqData);
    }

    save(data){
    	this.setState({
    		isFetching: true
    	}, () => {
    		setTimeout(() => {
		    	INVITE_TEAM_MEMBER(data)
		    	.then(response => {
		    		if(this.mounted)
		    		{
		    			this.setState({
		    				isFetching: false
		    			}, () => {
		    				this.props.onComplete(response);
		    				this.form.reset();
		    			});

		    			this.props.showSnackbar(
		    				'Team member invite sent!',
		    				{
		    					variant: 'success'
		    				}
		    			);
		    		}
		    	})
		    	.catch(error => {
		    		if(this.mounted)
		    		{
		    			let errorMessage = typeof error == 'string' && 
		    				error || 
		    				'Failed to send team member invite.';

		    			this.setState({
		    				isFetching: false
		    			});

		    			this.props.showSnackbar(
		    				errorMessage,
		    				{
		    					variant: 'error'
		    				}
		    			);
		    		}
		    	});
    		}, 2000)
    	});
    }

    handleCancelPress(){
        if(this.state.isFetching){
            return;
        }
        if( !this.form ||
            !this.form.isUpdated()
        ){
            if(typeof this.props.onCancel == 'function'){
            	this.props.onCancel();
            }
            return; 
         }
         this.props.showAlertDialog(
             ` `, 
             'Are you sure, you want discard your unsaved team member info?',
             [
                 {text: 'No'},
                 {	
                 	text: 'Yes, discard', 
                 	onClick: 
                 	typeof this.props.onCancel == 'function' 
                 	? () => this.props.onCancel() : null
                }
             ]
         )
    }

    handlePageDialogDismiss(method){
        switch(method){
            case 'backdrop':
            case 'escape':
                this.handleCancelPress();
            break;
        }
    }
}

const mapStateToProps = ({userInfo}) => ({
    userInfo: userInfo.data,
    currentBusiness: userInfo.data && 
    	userInfo.data.business && 
    	userInfo.data.business.constructor == Array &&
    	userInfo.data.business.find(item => item.id == userInfo.data.currentbusinessid) || null,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showAlertDialog: ActionCreators.showAlertDialog,
    showSnackbar: ActionCreators.showSnackbar
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TeamMemberCreate));