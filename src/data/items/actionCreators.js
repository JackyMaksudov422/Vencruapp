import { ActionTypes } from '../actionTypes';
import { CREATE_ITEM, GET_ITEMS, UPDATE_ITEM } from '../../configs/api.config';

export const createItemRequest = () => ({
	type: ActionTypes.CREATE_ITEM_REQUEST,
	isFetching: true,
	errorMessage: null,
	data: null,
});

export const createItemSuccess = data => ({
	type: ActionTypes.CREATE_ITEM_SUCCESS,
	isFetching: false,
	errorMessage: null,
	data: data,
});

export const createItemFailure = errorMessage => ({
	type: ActionTypes.CREATE_ITEM_FAILURE,
	isFetching: false,
	errorMessage: errorMessage || null,
	data: null,
});

export const doCreateItem = ({ productname, stocknumber, unitprice, description, businessid }) => dispatch => {
	dispatch(createItemRequest());
	setTimeout(() => {
		CREATE_ITEM({
			productname,
			stocknumber,
			unitprice,
			description,
			businessid,
		})
			.then(newItem => {
				dispatch(createItemSuccess(newItem));
			})
			.catch(error => {
				let errorMessage =
					(typeof error == 'string' && error.trim().length > 0 && error) || 'An unknown error occured';
				dispatch(createItemFailure(errorMessage));
			});
	}, 400);
};

export const updateItemRequest = () => ({
	type: ActionTypes.UPDATE_ITEM_REQUEST,
	isFetching: true,
	errorMessage: null,
	data: null,
});

export const updateItemSuccess = data => ({
	type: ActionTypes.UPDATE_ITEM_SUCCESS,
	isFetching: false,
	errorMessage: null,
	data: data,
});

export const updateItemFailure = errorMessage => ({
	type: ActionTypes.UPDATE_ITEM_FAILURE,
	isFetching: false,
	errorMessage: errorMessage || null,
	data: null,
});

export const doUpdateItem = props => dispatch => {
	const { stocknumber, productname, description, unitprice, userid, costofitem, businessid, id } = props;

	dispatch(updateItemRequest());
	setTimeout(() => {
		UPDATE_ITEM({
			stocknumber,
			productname,
			description,
			unitprice,
			userid,
			costofitem,
			businessid,
			id,
		})
			.then(item => {
				dispatch(updateItemSuccess(item));
			})
			.catch(error => {
				let errorMessage =
					(typeof error == 'string' && error.trim().length > 0 && error) || 'An unknown error occured';
				dispatch(updateItemFailure(errorMessage));
			});
	}, 400);
};

const getAllItemsRequest = () => ({
	type: ActionTypes.GET_ALL_ITEMS_REQUEST,
	isFetching: true,
	errorMessage: null,
});

const getAllItemsSuccess = data => ({
	type: ActionTypes.GET_ALL_ITEMS_SUCCESS,
	isFetching: false,
	errorMessage: null,
	data: data,
});

const getAllItemsFailure = errorMessage => ({
	type: ActionTypes.GET_ALL_ITEMS_FAILURE,
	isFetching: false,
	errorMessage: errorMessage || null,
});

export const getAllItems = () => {
	return (dispatch, getState) => {
		const { currentBusiness } = getState();

		if (!currentBusiness.data) {
			return;
		}

		dispatch(getAllItemsRequest());

		setTimeout(() => {
			GET_ITEMS({
				businessId: currentBusiness.data.id || null,
				page: 1,
				fromDate: '',
				toDate: '',
				sortBy: 'name',
				sortOrder: 'asc',
				searchQuery: '',
				limit: 1000000,
				filter: '',
			})
				.then(response => {
					dispatch(getAllItemsSuccess(response.products));
				})
				.catch(error => {
					dispatch(getAllItemsFailure((typeof error == 'string' && error) || 'Failed to load items.'));
				});
		}, 100);
	};
};
