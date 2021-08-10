import { SET_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED, LOADING_USER, SET_CLIENTS, SET_CLIENT, SET_STAFFS, SET_STAFF, SET_STAFF_RESOURCES,SET_STAFF_RESPONSE_DATA } from '../types'

export type State = Readonly<{
	authenticated: boolean,
	credentials: object,
	loading: boolean,
	allClients: [],
	clientInfo: object,
	allStaff: [],
	staffInfo: object,
	resourcesServices: [],
	staffResponseData: []
}>

const initialState: State = {
	authenticated: false,
	credentials: {},
	loading: false,
	allClients: [],
	clientInfo: {},
	allStaff: [],
	staffInfo: {},
	resourcesServices: [],
	staffResponseData: []
}

export default function userReducers(state = initialState, action: any) {
	switch (action.type) {
		case SET_AUTHENTICATED:
			return {
				...state,
				authenticated: true,
			}
		case SET_UNAUTHENTICATED:
			return initialState
		case SET_USER:
			return {
				...state,
				authenticated: true,
				loading: false,
				credentials: action.payload,
			}
		case LOADING_USER:
			return {
				...state,
				loading: true,
			}
		case SET_CLIENTS:
			return {
				...state,
				allClients: action.payload,
			}
		case SET_CLIENT:
			return {
				...state,
				clientInfo: action.payload,
			}
		case SET_STAFFS:
			return {
				...state,
				allStaff: action.payload,
			}
		case SET_STAFF:
			return {
				...state,
				staffInfo: action.payload,
			}
		case SET_STAFF_RESOURCES:
			return {
				...state,
				resourcesServices: action.payload,
			}
		case SET_STAFF_RESPONSE_DATA:
			return {
				...state,
				staffResponseData:action.payload,
				
			}
		default:
			return state
	}
}
