import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import PageHeader from '../../core/PageHeader'
import { getAllStaff } from '../../../redux/actions/staffActions'
import { getAllOrder } from '../../../redux/actions/serviceActions'
import { sorting, buildFilter } from '../../../utils/common'
import { Link } from 'react-router-dom'
import Pagination from 'react-js-pagination'
import DeleteModal from '../../core/DeleteModal'
import moment from 'moment'

const ServiceOrders = (props: any) => {
    const [errors, setErrors] = useState({} as Error)
    const [title] = useState('Service Orders')
    const [orderBy, setOrderBy] = useState(false)
    const [field, setField] = useState('name')
    const [activePage, setActivePage] = useState(1)
    const [perPage] = useState(10)
    const [buttons] = useState([
        {
            title: 'Add Appointment',
            url: '/schedule/add-appointment'
        }
    ])
    const [modalPopup, setModalPopup] = useState({
        deleteModal: false,
        id: '',
        name: '',
        index: ''
    })
    const [initialModalPopup] = useState({ ...modalPopup })
    const [params, setParams] = useState({
        date: moment(new Date()).format('YYYY-MM-DD'),
        staff: '',
    });

    // From Reducer
    const UI = useSelector((state: any) => state.UI)
    const user = useSelector((state: any) => state.user)
    const service = useSelector((state: any) => state.service)
    const allStaff = user.allStaff
    const allOrder = service.orderDetails

    useEffect(() => {
        getAllStaff()
        handleSearch()
        if (UI.errors) {
            setErrors(UI.errors)
        }
    }, [])

    const getAllStaff = () => {
        var data: any = {
            'filter': {
                'status': {
                    '$not': { '$eq': 'inactive' }
                },
                'roles': {
                    '$in': ['stylist']
                }
            }

        };
        var query = buildFilter(data);
        query.text = '';
        query.businessId = localStorage.businessId;
        props.getAllStaff(query)
    }

    const handleSearch = () => {
        var start: any = moment(params.date).subtract(1, 'day').subtract(1, 'milliseconds').toISOString()
        var end = moment(params.date).add(1, 'day').add(1, 'milliseconds').toISOString()
        var data: any = {
            timeStart: {
                $lte: end,
                $gt: start
            }
        };
        var query = buildFilter(data);
        query.businessId = localStorage.businessId;
        props.getAllOrder(query);
    };

    const handleChange = (event: any) => {
        setParams({
            ...params,
            [event.target.name]: event.target.value,
        });
    };

    const deletePopup = (order: any, index: any) => {
		setModalPopup({
			deleteModal: !modalPopup.deleteModal,
			id: order.id,
			name: order.firstName + ' ' + order.lastName,
			index: index
		})
	}

	const closeModal = () => {
		setModalPopup(initialModalPopup)
	}

    const handleSortChange = (key: any) => {
        if (field === key) {
            setOrderBy(!orderBy)
        } else {
            setOrderBy(true)
            setField(key)
        }
        sorting(allOrder, key, orderBy);
    }

    return (
        <React.Fragment>
            {user.authenticated && !UI.loading && (
                <React.Fragment>
                    <PageHeader title={title} buttons={buttons} />
                    <div className='row'>
                        <div className='col-lg-12'>
                            <div className='wrapper wrapper-content animated fadeInRight'>
                                <div className='ibox float-e-margins'>
                                    <div className='ibox-content'>
                                        <form role='form'>
                                            <div className='row'>
                                                <div className='col-sm-3'>
                                                    <div className='form-group'>
                                                        <label>Date</label>
                                                        <input
                                                            type='date'
                                                            className='form-control'
                                                            name='date'
                                                            value={params.date}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className='col-sm-3'>
                                                    <div className='form-group'>
                                                        <label>Staff</label>
                                                        <select
                                                            className='form-control'
                                                            onChange={handleChange}
                                                            name='staff'
                                                        >
                                                            <option value=''>All</option>
                                                            {allStaff &&
                                                                allStaff.length &&
                                                                allStaff.map((value: any) => {
                                                                    return (
                                                                        <option value={value.id}>
                                                                            {value.name}
                                                                        </option>
                                                                    );
                                                                })}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className='col-sm-3'>
                                                    <div className='form-group'>
                                                        <label>Status</label>
                                                        <select
                                                            className='form-control'
                                                            onChange={handleChange}
                                                            name='status'
                                                        >
                                                            <option value=''>All</option>
                                                            <option value='paid'>Paid</option>
                                                            <option value='created'>Created</option>
                                                            <option value='canceled'>Canceled</option>
                                                            <option value='extra_service_request'>Requested</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className='col-sm-2'>
                                                    <div className='form-group'>
                                                        <label>&nbsp;</label>
                                                        <div className='input-group'>
                                                            <button
                                                                className='btn btn-primary'
                                                                type='button'
                                                                onClick={(e) => handleSearch()}
                                                            >
                                                                Search
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <div className='hr-line-dashed'></div>
                                        <div className='table-responsive'>
                                            <table className='table table-bordered table-striped table-hover dataTables-example' id='orderTable'>
                                                <thead>
                                                    <tr>
                                                        <th className={field !== 'appTimeStart' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'} onClick={e => handleSortChange('appTimeStart')}>Date/Time</th>
                                                        <th className={field !== 'clientName' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'} onClick={e => handleSortChange('clientName')}>Customer</th>
                                                        <th className={field !== 'staffName' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'} onClick={e => handleSortChange('staffName')}>Staff</th>
                                                        <th className={field !== 'categoryName' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'} onClick={e => handleSortChange('categoryName')}>Category</th>
                                                        <th className={field !== 'items[0].name' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'} onClick={e => handleSortChange('items[0].name')}>Services</th>
                                                        <th className={field !== 'amount' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'} onClick={e => handleSortChange('amount')}>Price</th>
                                                        <th className={field !== 'tip' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'} onClick={e => handleSortChange('tip')}>Tip</th>
                                                        <th className={field !== 'total' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'} onClick={e => handleSortChange('total')}>Total</th>
                                                        <th className={field !== 'status' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'} onClick={e => handleSortChange('status')}>Status</th>
                                                        <th className='text-center'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {allOrder && allOrder.length ? (
                                                        allOrder.slice((activePage - 1) * perPage, activePage * perPage).map((order: any, index: any) => {
                                                            return (
                                                                <tr className='gradeX'>
                                                                    <td>{moment(order.appTimeStart).format('MMM d, yyyy h:mma') }</td>
                                                                    <td style={{ 'textTransform': 'capitalize' }}>{order.clientName}</td>
                                                                    <td style={{ 'textTransform': 'capitalize' }}>{order.staffName}</td>
                                                                    <td>
                                                                        {(order.categoryId && order.rootCategoryId) ? ((order.categoryId ===
                                                                            order.rootCategoryId) ? order.rootCategoryName : order.rootCategoryName + '|' +
                                                                        order.categoryName) : (order.rootCategoryId) ? order.rootCategoryName :
                                                                            order.categoryName}
                                                                    </td>
                                                                    <td></td>
                                                                    <td>${order.amount}</td>
                                                                    <td>${order.tip}</td>
                                                                    <td>${order.total}</td>
                                                                    <td>
                                                                        {order.status==='paid' ?
                                                                            <span className='btn btn-xs btn-primary' style={{'width': '80px'}}>
                                                                                Paid
                                                                            </span>
                                                                            : order.status === 'created' ?
                                                                                <span className='btn btn-xs btn-success' style={{'width': '80px'}}>
                                                                                    Created
                                                                                </span>
                                                                            : order.status === 'canceled' ?
                                                                                <span className='btn btn-xs btn-danger' style={{'width': '80px'}}>
                                                                                    Cancelled
                                                                                </span>
                                                                            : order.status === 'refund' ?
                                                                                <span className='btn btn-xs btn-danger' style={{'width': '80px'}}>
                                                                                    Refund
                                                                                </span>
                                                                            : order.status === 'voided' ?
                                                                                <span className='btn btn-xs btn-warning' style={{'width': '80px'}}>
                                                                                    Voided
                                                                                </span>
                                                                            : order.status === 'extra_service_request' ?
                                                                                <span className='btn btn-xs btn-warning' style={{'width': '80px'}}>
                                                                                    Requested
                                                                                </span>
                                                                            : <></>
                                                                        }
                                                                    </td>
                                                                    <td className='text-center' >
                                                                        {order.status=='created' || order.status=='paid' && (
                                                                            <React.Fragment>
                                                                                <Link style={{'cursor': 'pointer', 'color': '#2a6954'}} key={index} to={`/services/payments/view/${order.id}`}>
                                                                                    <i title='View | Edit' className='far fa-edit'></i>
                                                                                </Link>
                                                                                &nbsp; 
                                                                                <a style={{'cursor': 'pointer', 'color': '#2a6954'}}  onClick={() => deletePopup(order, index)}>
                                                                                    <i title='Delete' className='far fa-trash-alt'></i>
                                                                                </a>
                                                                            </React.Fragment>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={10} className='text-center'>
                                                                No Service Orders
                                                            </td>
                                                        </tr>
                                                    )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

const mapActionsToProps = {
    getAllStaff,
    getAllOrder
}

export default connect(null, mapActionsToProps)(ServiceOrders)