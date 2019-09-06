import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { GET_ALL_USERS } from '../../configs/api.config';
import { ActionCreators } from '../../data/actionCreators';
import moment from 'moment';
/**
 * component template
 */

let Template = ({ fn, users}) => {

	return (
		<div className='w-1/2 mx-auto'>
			<table className="w-full text-black table-collapse">
				<thead>
					<tr>
						<th className="text-sm font-semibold px-4 py-2 text-left">Name</th> 
						<th className="text-sm font-semibold px-4 py-2 text-right">Email</th>
					</tr>
				</thead>
				<tbody>
				{users &&
					users.constructor === Array &&
					users.map((user, index) => (
						<tr key={index}>
							<td className="p-4 border-t border-grey-light whitespace-no-wrap">
								<p className='mb-2'>{`${user.firstname} ${user.lastname}`}</p>
								<p className='text-grey'>{moment(user.date_created).format('DD/MM/YYYY')}</p>
							</td>
							<td className="p-4 border-t border-grey-light text-lg text-right text-brand-blue whitespace-pre">
								{ user.Email }
							</td>
						</tr>
					))
				}
				</tbody>
			</table>
		</div>
	);
};
class AdminDisplay extends React.Component {
	state = {
		users: []
	};

	componentDidMount() {
		this.fetch()
	}

	fetch(){
		GET_ALL_USERS().then((res) => {
            this.setState({
                users: res
			})
		})
	}

	render() {
		return (
			<Template
				{...this.prps()}
				fn={this.fn()}
			/>
		);
	}


	fn = () => ({
		goBack: () => this.props.history.goBack(),
	});

	prps = () => ({
        // template props go here
		users: this.state.users
	})

}

const mapStateToProps = ({ currentBusiness, userInfo }) => ({
	userInfo: userInfo.data,
	currentBusiness: currentBusiness.data
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
	showSnackbar: ActionCreators.showSnackbar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminDisplay));
