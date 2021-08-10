import { SET_TOTAL_SALES, SET_THIRTY_DAY_SNAPSHOT, SET_REPORT_TOTAL_SALES, SET_REPORT_ESTIMATED_PAYROLL, SET_REPORT_SERVICES_COMPLETED, SET_REPORT_PRODUCT_SALES, SET_REPORT_CLIENT_REPORT, SET_STAFF_BOOKING_ANALYSIS } from '../types'

export type State = Readonly<{
    totalSales: object,
    thirtyDaySnapshot: object,
    reportTotalSales: [],
    reportEstimatedRoll: [],
    reportServiceCompleted: [],
    reportProductSales: [],
    reportClientReport: [],
    reportStaffBookingAnalysis: []
}>

const initialState: State = {
    totalSales: {},
    thirtyDaySnapshot: {},
    reportTotalSales: [],
    reportEstimatedRoll: [],
    reportServiceCompleted: [],
    reportProductSales: [],
    reportClientReport: [],
    reportStaffBookingAnalysis: []
}

export default function reportReducers(state = initialState, action: any) {
    switch (action.type) {
        case SET_TOTAL_SALES:
            return {
                ...state,
                totalSales: action.payload,
            }
        case SET_THIRTY_DAY_SNAPSHOT:
            return {
                ...state,
                thirtyDaySnapshot: action.payload,
            }
        case SET_REPORT_TOTAL_SALES:
            return {
                ...state,
                reportTotalSales: action.payload,
            }
        case SET_REPORT_ESTIMATED_PAYROLL:
            return {
                ...state,
                reportEstimatedRoll: action.payload,
            }
        case SET_REPORT_SERVICES_COMPLETED:
            return {
                ...state,
                reportServiceCompleted: action.payload,
            }
        case SET_REPORT_PRODUCT_SALES:
            return {
                ...state,
                reportProductSales: action.payload,
            }
        case SET_REPORT_CLIENT_REPORT:
            return {
                ...state,
                reportClientReport: action.payload,
            }
        case SET_STAFF_BOOKING_ANALYSIS:
            return {
                ...state,
                reportStaffBookingAnalysis: action.payload,
            }
        default:
            return state
    }
}
