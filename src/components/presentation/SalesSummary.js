import React from 'react';
import QuickStatisticsCard from './QuickStatisticsCard';
import { INVOICES_QUICK_STATISICS } from '../../configs/api.config';
import propTypes from 'prop-types';
import DashboardSection from './DashboardSection';
import Typography from './Typography';
import Button from './Button';
import ContentCircularLoader from './ContentCircularLoader';
import { connect } from 'react-redux';
import Dropdown from './Dropdown';
import Select from './Select';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import { padNumber, thousand } from '../../helpers/Misc';
import isEqaul from 'lodash/isEqual';

const CustomOptionContent = ({ fromTime, toTime }) => (
	<div className='filter-salts-summary-custom-option'>
		<span>{fromTime}</span>
		<span>{toTime}</span>
	</div>
);

const MONTHS = [
	'01', '02',
	'03', '04',
	'05', '06',
	'07', '08',
	'09', '10',
	'11', '12',
];

const YEARS = () => {
	let limit = new Date().getFullYear();
	let start = 2000;
	let years = [];
	for (var i = start; i <= limit; i++) {
		years.push(`${i}`);
	}
	return years;
};

const FILTER_OPTIONS = {
	'today': 'Today',
	'yesterday': 'Yesterday',
	'this-week': 'This Week',
	'this-month': 'This Month',
	'this-year': 'This Year',
	'custom': (
		<CustomOptionContent
			fromTime='mm/yy'
			toTime='mm/yy'
		/>
	),
};

class SalesSummary extends React.Component {

	static propTypes = {
		businessId: propTypes.oneOfType([
			propTypes.string,
			propTypes.number
		]).isRequired,
		setRef: propTypes.func,
		currencySign: propTypes.string
	}

	constructor(props) {
		super(props);
		this.handleFilterOptionChange = this.handleFilterOptionChange.bind(this);
		this.handleOptionSelect = this.handleOptionSelect.bind(this);
		this.years = YEARS();

		let currentYear = new Date().getFullYear();

		this.state = {
			isFetching: false,
			data: null,
			errorMessage: null,
			filterOption: 'today',
			showDateFilter: false,
			filterDate: {},
			filterForm: {
				fromMonth: padNumber(new Date().getMonth() + 1, 2),
				fromYear: `${this.years[0]}`,
				toMonth: padNumber(new Date().getMonth() + 1, 2),
				toYear: `${currentYear}`,
			}
		};
	}

	componentDidMount() {
		this.fetch();
		if (this.props.setRef) {
			this.props.setRef(this);
		}
	}

	componentWillUnmount() {
		if (this.props.setRef) {
			this.props.setRef(undefined);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.clientCreate.isFetching &&
			!this.props.clientCreate.isFetching &&
			!this.props.clientCreate.errorMessage
		) {
			this.fetch();
		}

		if (prevState.filterOption !== this.state.filterOption) {
			this.fetch();
		}

		if (!isEqaul(prevState.filterDate, this.state.filterDate) &&
			prevState.filterOption === this.state.filterOption &&
			this.state.filterOption === 'custom' &&
			Object.assign(
				(
					this.state.filterDate &&
					this.state.filterDate.constructor === Object
				) ? this.state.filterDate : {}
			)
		) {
			this.fetch();
		}
	}

	render() {
		const {
            errorMessage,
			data,
			isFetching,
			showDateFilter,
			filterForm,
        } = this.state;

		const { currencySign } = this.props;
		return (
			<DashboardSection
				title='Sales Summary'
				classes={{
					rightContent: 'mt20 mb15'
				}}
				rightContent={
					<Dropdown
						options={this.getFilterOptions()}
						noArrow
						variant='default'
						align='right'
						// noArrow={false}
						classes={{
							toggler: 'summary-dropdown',
							list: 'summary-dd-list'
						}}
						label={this.getFilterLabel()}
						onChange={this.handleFilterOptionChange}
					/>
				}
			>
				{!errorMessage && data &&
					<div className='row'>
						<div className='col-md-4'>
							<QuickStatisticsCard
								placeholder={isFetching && !data}
								title='Total Paid'
								icon={<img src={require('../../assets/item-one.png')} alt='icon' />}
								value={`${currencySign} ${data ? thousand(data.totalpaid) : 0}`}
							/>
						</div>
						<div className='col-md-4'>
							<QuickStatisticsCard
								placeholder={isFetching && !data}
								title='Total Outstanding'
								icon={<img src={require('../../assets/item-two.png')} alt='icon' />}
								value={`${currencySign} ${data ? thousand(data.totaloutstanding) : 0}`}
							/>
						</div>
						<div className='col-md-4'>
							<QuickStatisticsCard
								placeholder={isFetching && !data}
								title='In Draft'
								icon={<img src={require('../../assets/item-three.png')} alt='icon' />}
								value={`${currencySign} ${data ? thousand(data.totaldraft) : 0}`}
							/>
						</div>
					</div>
				}
				{errorMessage && !data &&
					<div className='spanned text-center'>
						<Typography align='center' className='mb15'>{errorMessage}</Typography>
						<Button
							size='sm'
							onClick={() => this.fetch()}
						>Try Again</Button>
					</div>
				}
				{isFetching && !data && <ContentCircularLoader />}

				{!errorMessage &&
					<Dialog
						open={showDateFilter}
						onClose={() => this.setState({
							showDateFilter: false
						})}
						disableEscapeKeyDown={false}
						disableBackdropClick={false}
						transitionDuration={200}
						aria-labelledby="sales-summary-filter-alert-dialog-title"
						aria-describedby="sales-summary-filter-alert-dialog-description"
						className='sales-summary-filter-alert-dialog'
					>
						<DialogTitle
							id="sales-summary-filter-alert-dialog-title"
							className='sales-summary-filter-alert-dialog-title'
						>
							Select Custom Date
		                </DialogTitle>
						<DialogContent className='ph25'>
							<div className='row'>
								<div className='col-md-12'>
									<h5 className='mb20 text-black'>
										From Date
			                		</h5>
									<div className='row'>
										<div className='col-md-6 mb30'>
											<Select
												size='sm'
												label='Month'
												setRef={ref => this.fromMonth = ref}
												options={MONTHS}
												value={filterForm.fromMonth}
												onChange={e => this.setState({
													filterForm: {
														...filterForm,
														fromMonth: e.target.value
													}
												})}
											/>
										</div>
										<div className='col-md-6 mb30'>
											<Select
												size='sm'
												label='Year'
												options={this.years}
												setRef={ref => this.fromYear = ref}
												value={filterForm.fromYear}
												onChange={e => this.setState({
													filterForm: {
														...filterForm,
														fromYear: e.target.value
													}
												})}
											/>
										</div>
									</div>
								</div>
								<div className='col-md-12'>
									<h5 className='mb20 text-black'>
										End Date
			                		</h5>
									<div className='row'>
										<div className='col-md-6 mb30'>
											<Select
												size='sm'
												label='Month'
												options={MONTHS}
												value={filterForm.toMonth}
												setRef={ref => this.toMonth = ref}
												onChange={e => this.setState({
													filterForm: {
														...filterForm,
														toMonth: e.target.value
													}
												})}
											/>
										</div>
										<div className='col-md-6 mb30'>
											<Select
												size='sm'
												label='Year'
												options={this.years}
												setRef={ref => this.toYear = ref}
												value={filterForm.toYear}
												onChange={e => this.setState({
													filterForm: {
														...filterForm,
														toYear: e.target.value
													}
												})}
											/>
										</div>
									</div>
								</div>
							</div>
						</DialogContent>
						<DialogActions
							className='sales-summary-filter-alert-dialog-actions text-center pb20 ph15 '
						>
		                    <Button
							size='sm'
							type='button'
							variant='link-gray'
							onClick={() => this.setState({
								showDateFilter: false
							})}
						>
							Cancel
		                    </Button>
						<Button
							size='sm'
							type='button'
							variant='primary'
							onClick={this.handleOptionSelect}
						>
							Select Date
		                    </Button>
		                </DialogActions>
		            </Dialog>

                }
            </DashboardSection>
		)
	}

	handleOptionSelect() {
		this.setState(state => ({
			showDateFilter: false,
			filterOption: 'custom',
			filterDate: { ...state.filterForm }
		}));
	}

	getFilterOptions() {
		const {
    		filterOption,
			filterDate
    	} = this.state;
		let options = {};

		for (var i in FILTER_OPTIONS) {
			if (filterOption === 'custom' &&
				i === 'custom'
			) {
				let fromTime, toTime;
				if (filterDate.fromMonth &&
					filterDate.fromYear
				) {
					fromTime = filterDate.fromMonth + '/' + filterDate.fromYear
				}
				if (filterDate.toMonth &&
					filterDate.toYear
				) {
					toTime = filterDate.toMonth + '/' + filterDate.toYear
				}

				// set custom date range
				options[i] = <CustomOptionContent
					fromTime={fromTime || 'mm/yy'}
					toTime={toTime || 'mm/yy'}
				/>

				continue;
			}
			options[i] = FILTER_OPTIONS[i];
		}

		return options;
	}

	getFilterLabel() {
		const { filterOption, filterDate } = this.state;
		const filterOptions = this.getFilterOptions();
		if (filterOption == 'custom') {
			let fromTime, toTime;
			if (filterDate.fromMonth &&
				filterDate.fromYear
			) {
				fromTime = filterDate.fromMonth + '/' + filterDate.fromYear
			}
			if (filterDate.toMonth &&
				filterDate.toYear
			) {
				toTime = filterDate.toMonth + '/' + filterDate.toYear
			}
			return (
				<span>
					<i className="icon ion-md-calendar"></i>{` `}
					<span>{fromTime} - {toTime}</span>
				</span>
			);
		}
		return (
			<span>
				<i className="icon ion-md-calendar"></i>{` `}
				<span>{filterOptions[filterOption]}</span>
			</span>
		);
	}

	handleFilterOptionChange(e) {
		if (e.target.value == 'custom') {
			this.setState(state => ({
				showDateFilter: true,
				filterForm: Object.keys(state.filterDate).length > 0
					? state.filterDate : state.filterForm
			}));
			return;
		}
		this.setState({
			filterOption: e.target.value
		});
	}

	fetch() {
		this.setState({
			isFetching: true,
			errorMessage: null
		});

		setTimeout(() => {
			INVOICES_QUICK_STATISICS(this.props.businessId)
				.then(response => {
					this.setState({
						isFetching: false,
						data: response
					})
				}).catch(error => {
					this.setState({
						isFetching: false,
						errorMessage: typeof error == 'string' && error.length > 0 && error || 'Failed to load, please try again.'
					})
				});
		}, 1000);
	}
}

const mapStateToProps = ({ clientCreate }) => ({
	clientCreate
});

export default connect(mapStateToProps, null)(SalesSummary);