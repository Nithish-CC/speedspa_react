import { LOADING_UI, CLEAR_ERRORS, SET_STAFF, SET_STAFFS ,BUTTON_LOADING,LOADING_CLEAR,SET_ERRORS,SET_STAFF_RESOURCES,SET_STAFF_RESPONSE_DATA} from '../types'
import axios from 'axios'

export const getAllStaff = (params: any) => (dispatch: any) => {
	dispatch({ type: LOADING_UI })
	axios
		.get(`/users/search?`, { params })
		.then(res => {
			dispatch({
				type: SET_STAFFS,
				payload: res.data,
			})
			dispatch({ type: CLEAR_ERRORS })
		})
		.catch(err => {
			console.log(err)
		})
}

export const searchStaff = (params: any) => (dispatch: any) => {
	dispatch({ type: LOADING_UI })
	axios
		.get(`/users/search`, { params })
		.then(res => {
			dispatch({
				type: SET_STAFFS,
				payload: res.data,
			})
			dispatch({ type: CLEAR_ERRORS })
		})
		.catch(err => {
			console.log(err)
		})
}

export const addStaff = (params: any, history: any, callback:any) => (dispatch: any) => {
	dispatch({ type: BUTTON_LOADING })
		axios
		.post('users', params)
		.then(res => {
			const id = res.data.id
			const businessId = res.data.businessId
			const serviceIds = res.data.serviceIds
			const params = {
				id:id,
				businessId:businessId,
				serviceIds:serviceIds,
				resourceId:id
			}
			console.log(params)
			history.push('/staff')
			dispatch({ type: LOADING_CLEAR })
		})
		.catch(err => {
			dispatch({
				type: SET_ERRORS,
				payload: err.response.data,
			})
			dispatch({ type: LOADING_CLEAR })
		})
}

export const updateClient = (params: any, history: any, props: any)  => (dispatch: any) => {
	dispatch({ type: BUTTON_LOADING })
	axios
		.patch(`users/${params.id}`, params)
		.then(res => {
			history.push(history)
			dispatch({ type: LOADING_CLEAR })
		})
		.catch(err => {
			dispatch({
				type: SET_ERRORS,
				payload: err.response.data,
			})
			dispatch({ type: LOADING_CLEAR })
		})
}

export const getStaffDetails = (clientId: any, params: any) => (dispatch: any) => {
	dispatch({ type: LOADING_UI })
	axios
		.get(`/users/${clientId}`, { params })
		.then(res => {
			dispatch({
				type: SET_STAFF,
				payload: res.data,
			})
			dispatch({ type: CLEAR_ERRORS })
		})
		.catch(err => {
			console.log(err)
		})
}

export const deleteStaff = (clientId: any, params: any) => (dispatch: any) => {
	axios
		.delete(`/users/${clientId}`, { params })
		.then(res => {
		})
		.catch(err => {
			console.log(err)
		})
}


export const getResourceServices = (params: any) => (dispatch: any) => {
	dispatch({ type: LOADING_UI })
	axios
		.get(`/resourcesServices`, { params })
		.then(res => {
			dispatch({
				type: SET_STAFF_RESOURCES,
				payload: res.data,
			})
			dispatch({ type: CLEAR_ERRORS })
		})
		.catch(err => {
			console.log(err)
		})
}
