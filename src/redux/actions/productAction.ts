import { LOADING_UI, CLEAR_ERRORS, SET_ERRORS, BUTTON_LOADING, LOADING_CLEAR, SET_PRODUCT_CATEGORIES, SET_PRODUCT_CATEGORY, SET_PRODUCTS } from '../types'
import axios from 'axios'

export const getAllProductCategories = (params: any) => (dispatch: any) => {
	dispatch({ type: LOADING_UI })
	axios
		.get(`/products_categories`, { params })
		.then(res => {
			const plainCategories: any = []
			let productCategories = categoriesToPlain(res.data, plainCategories, 0);
			dispatch({
				type: SET_PRODUCT_CATEGORIES,
				payload: productCategories,
			})
			dispatch({ type: CLEAR_ERRORS })
		})
		.catch(err => {
			console.log(err)
		})
}

const categoriesToPlain = (categories: any, plainCategories: any, level: any) => {
	categories.forEach((value: any) => {
		var pre = '';
		var i = 1;
		if (level > 0)
			while (i <= level) {
				pre = pre + '- ';
				i++;
			}
		var parent = {
			id: value.id,
			originalNam: value.name,
			name: pre + value.name,
			description: value.description,
			seats: value.seats,
			parentId: value.parentId,
			rootCategoryId: value.rootCategoryId,
			order: value.order,
			resourcesStrategy: value.resourcesStrategy,
			resourcesIds: value.resourcesIds
		};
		plainCategories.push(parent);
		if (value.subcategories) {
			var nLevel = level + 1;
			categoriesToPlain(value.subcategories, plainCategories, nLevel);
		}
	});
	return plainCategories;
}

export const deleteProductCategories = (productId: any, params: any) => (dispatch: any) => {
	axios
		.delete(`/products_categories/${productId}`, { params })
		.then(res => {
		})
		.catch(err => {
			console.log(err)
		})
}

export const addProductCategory =  (params: any, history: any) => (dispatch: any) => {
	dispatch({ type: BUTTON_LOADING })
	axios
		.post('/products_categories', params)
		.then(res => {
			history.push('/products/categories')
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

export const getProductCategory = (productCategoryId: any, params: any) => (dispatch: any) => {
	dispatch({ type: LOADING_UI })
	axios
		.get(`products_categories/${productCategoryId}`, { params })
		.then(res => {
			dispatch({
				type: SET_PRODUCT_CATEGORY,
				payload: res.data,
			})
			dispatch({ type: CLEAR_ERRORS })
		})
		.catch(err => {
			console.log(err)
		})
}

export const updateProductCategory =  (params: any, history: any) => (dispatch: any) => {
	dispatch({ type: BUTTON_LOADING })
	axios
		.put(`products_categories/${params.id}`, params)
		.then(res => {
			history.push('/products/categories')
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

// product
export const getAllProducts = (params: any) => (dispatch: any) => {
	dispatch({ type: LOADING_UI })
	axios
		.get(`/products`, { params })
		.then(res => {
			dispatch({
				type: SET_PRODUCTS,
				payload: res.data,
			})
			dispatch({ type: CLEAR_ERRORS })
		})
		.catch(err => {
			console.log(err)
		})
}

export const deleteProducts = (productId: any, params: any) => (dispatch: any) => {
	axios
		.delete(`/products/${productId}`, { params })
		.then(res => {
		})
		.catch(err => {
			console.log(err)
		})
}