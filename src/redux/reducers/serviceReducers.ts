import { SET_SERVICE_CATEGORIES, SET_SERVICE_ORDERS, SET_SERVICES, SET_ROOT_SERVICE_CATEGORIES, SET_SERVICE_CATEGORY } from '../types'

export type State = Readonly<{
	categoryDetails: object,
	serviceDetails: object,
	orderDetails: object,
	getRootServiceCategory: object,
	serviceCategory:[]
}>

const initialState: State = {
	categoryDetails: {},
	serviceDetails: {},
	orderDetails: {},
	getRootServiceCategory: {},
	serviceCategory:[]
}

export default function serviceReducers(state = initialState, action: any) {
	switch (action.type) {
		case SET_SERVICE_CATEGORIES:
			return {
				...state,
				categoryDetails: action.payload,
			}
		case SET_SERVICE_ORDERS:
			return {
				...state,
				orderDetails: action.payload,
			}
		case SET_SERVICES:
			return {
				...state,
				serviceDetails: action.payload,
			}
		case SET_ROOT_SERVICE_CATEGORIES:
			return {
				...state,
				getRootServiceCategory: action.payload,
			}
		case SET_SERVICE_CATEGORY:
			return {
				...state,
				serviceCategory: action.payload,
			}
		default:
			return state
	}
}