import { SET_PRODUCT_CATEGORIES, SET_PRODUCT_CATEGORY, SET_PRODUCTS } from '../types'

export type State = Readonly<{
    productCategories: [],
    productCategory: object,
    productDetails: []
}>

const initialState: State = {
    productCategories: [],
    productCategory: {},
    productDetails: []
}

export default function productReducers(state = initialState, action: any) {
    switch (action.type) {
        case SET_PRODUCT_CATEGORIES:
            return {
                ...state,
                productCategories: action.payload,
            }
        case SET_PRODUCT_CATEGORY:
            return {
                ...state,
                productCategory: action.payload,
            }
        case SET_PRODUCTS:
            return {
                ...state,
                productDetails: action.payload,
            }
        default:
            return state
    }
}