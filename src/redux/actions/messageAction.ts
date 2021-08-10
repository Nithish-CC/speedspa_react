import { SET_ERRORS, BUTTON_LOADING, LOADING_CLEAR } from '../types'
import axios from 'axios'

export const sendMessage = (params: any, callback: (args: any) => void) => (dispatch: any) => {
	dispatch({ type: BUTTON_LOADING })
	axios
		.post('/messages', params)
		.then(res => {
			callback(true)
			dispatch({ type: LOADING_CLEAR })
		})
		.catch(err => {
			callback(false)
			dispatch({
				type: SET_ERRORS,
				payload: err.response.data,
			})
			dispatch({ type: LOADING_CLEAR })
		})
}
