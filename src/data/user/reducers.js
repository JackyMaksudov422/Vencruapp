import CreateReducer from '../../helpers/CreateReducer';
import { ActionTypes } from '../actionTypes';

export const onboarding = CreateReducer({
    isFetching: false,
    failed: false,
    message: null
}, {
    [ActionTypes.ONBOARDING_REQUEST]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.ONBOARDING_FAILURE]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.LOGOUT_SUCCESS]: (state, action, initialState) => initialState,
    [ActionTypes.ONBOARDING_SUCCESS]: (state, action) => Object.assign({}, state, {
        isFetching: false,
        failed: false,
        message: null
    }),
}, true);

export const userInfo = CreateReducer({
    isFetching: false,
    failed: false,
    message: null,
    data: null
}, {
    [ActionTypes.GET_USER_INFO_REQUEST]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.GET_USER_INFO_SUCCESS]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.GET_USER_INFO_FAILURE]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.SET_USER_INFO]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.LOGOUT_SUCCESS]: (state, action, initialState) => initialState,
    [ActionTypes.ONBOARDING_SUCCESS]: (state, action) => Object.assign({}, state, {
        isFetching: false,
        failed: false,
        message: null,
        data: action.data
    }),
});

export const currentBusiness = CreateReducer({
    data: null
}, {
    [ActionTypes.SET_CURRENT_BUSINESS]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.LOGOUT_SUCCESS]: (state, action, initialState) => initialState,
})

export const businessSetup = CreateReducer({
    done: null
}, {
    [ActionTypes.BUSINESS_SETUP_STATE]: (state, action) => Object.assign({}, state, action),
    [ActionTypes.LOGOUT_SUCCESS]: (state, action, initialState) => initialState,
    [ActionTypes.ONBOARDING_SUCCESS]: (state, action) => Object.assign({}, state, {
        done: true
    }),
});