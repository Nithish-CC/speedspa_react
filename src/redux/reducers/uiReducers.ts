import { SET_ERRORS, LOADING_UI, CLEAR_ERRORS, LOADING_CLEAR, BUTTON_LOADING } from '../types'
const initialState = {
	loading: false,
	errors: null,
	buttonLoading: false
}

export default function uiReducers(state = initialState, action: any) {
	switch (action.type) {
		case SET_ERRORS:
			return {
				...state,
				loading: false,
				errors: action.payload,
			}
		case CLEAR_ERRORS:
			return {
				...state,
				loading: false,
				errors: null,
			}
		case LOADING_UI:
			return {
				...state,
				loading: true,
			}
		case LOADING_CLEAR:
			return {
				...state,
				buttonLoading: false,
			}
		case BUTTON_LOADING:
			return {
				...state,
				buttonLoading: true,
			}
		default:
			return state
	}
}
