import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux'
import { getAllStaff, searchStaff, deleteStaff } from '../../redux/actions/staffActions'
import { getAllCategory } from '../../redux/actions/serviceActions'
import { sorting, buildFilter } from '../../utils/common'
import moment from 'moment';
import { Link } from 'react-router-dom'
import PageHeader from '../core/PageHeader'
import Pagination from 'react-js-pagination'
import DeleteModal from '../core/DeleteModal'
import _ from 'lodash'

const Staffs = (props: any) => {
	const [errors, setErrors] = useState({} as Error)
	const [title] = useState('Staff')
	const [orderBy, setOrderBy] = useState(false)
	const [field, setField] = useState('createdAt')
	const [activePage, setActivePage] = useState(1)
	const [perPage] = useState(10)
	const [roles] = useState([
		{
			value: 'all',
			text: 'All'
		}, {
			value: 'stylist',
			text: 'Stylist'
		}, {
			value: 'admin',
			text: 'Admin'
		}
	])
	const [buttons] = useState([
		{
			title: 'Add Staff',
			url: 'Staff/add-new'
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
		text: '',
		status: '',
		role: 'all'

	});
	const [initialParams] = useState({ ...params })

	//From Reducer
	const UI = useSelector((state: any) => state.UI)
	const user = useSelector((state: any) => state.user)
	const allCategories = useSelector((state: any) => state.service.categoryDetails)
	const allStaff = user.allStaff

	useEffect(() => {
		getAllCategory()
		getAllStaff(params)
		if (UI.errors) {
			setErrors(UI.errors)
		}
	}, [])

	const getAllCategory = () => {
		const params = {
			'businessId': localStorage.businessId,
		}
		props.getAllCategory(params)
	}

	const getAllStaff = (params: any) => {
		var requestRoles = [
			'admin',
			'stylist'
		]
		if (params.role !== 'all') {
			requestRoles = [params.role]
		}
		var data: any = {
			'filter': {
				'roles': {
					'$in': requestRoles
				}
			}

		};
		if (params.status) {
			data.filter.status = {
				$in: [params.status]
			}
		} else {
			data.filter.status = {
				$in: ['active', 'inactive']
			}
		}
		var query = buildFilter(data);
		query.text = params.text;
		query.businessId = localStorage.businessId;
		props.getAllStaff(query)
	}

	const handleChange = (event: any) => {
		setParams({
			...params,
			[event.target.name]: event.target.value,
		});
	};

	const handleReset = (e: any) => {
		setParams(initialParams)
		setField('createdAt')
		setOrderBy(false)
		getAllStaff(initialParams)
	}

	const handleSearch = (e: any) => {
		getAllStaff(params);
	}

	const handleSortChange = (key: any) => {
		if (field === key) {
			setOrderBy(!orderBy)
		} else {
			setOrderBy(true)
			setField(key)
		}
		sorting(allStaff, key, orderBy);
	}

	const deletePopup = (staff: any, index: any) => {
		setModalPopup({
			deleteModal: !modalPopup.deleteModal,
			id: staff.id,
			name: staff.firstName + ' ' + staff.lastName,
			index: index
		})
	}

	const closeModal = () => {
		setModalPopup(initialModalPopup)
	}

	const handleDelete = () => {
		let params = {
			businessId: localStorage.getItem('businessId')
		}
		props.deleteStaff(modalPopup.id, params)
		closeModal()
		allStaff.splice(modalPopup.index, 1)
	}

	const getRole = (value: any, index: any) => {
		var roleName = [];
		if (value.roles) {
			if (((_.findIndex(value.roles, function (role) {
				return (role == 'admin');
			})) + 1)) {
				roleName.push('admin');
			}
			if (((_.findIndex(value.roles, function (role) {
				return (role == 'stylist');
			})) + 1)) {
				if (value.profileCategoryId) {
					if (_.isArray(value.profileCategoryId) && value.profileCategoryId.length) {
						_.each(value.profileCategoryId, function (profCatId) {
							var cate = _.find(allCategories, {
								id: profCatId
							});
							if (cate)
								cate.description ? roleName.push(cate.description) : roleName.push(cate.name + ' Stylist');
						});
					} else {
						var cat = _.find(allCategories, {
							id: value.profileCategoryId
						});
						if (cat.id)
							cat.description ? roleName.push(cat.description) : roleName.push(cat.name + ' Stylist');
					}
				}
			}
		}
		if (roleName.length) {
			value.roleName = roleName.join(', ');
		} else {
			value.roleName = 'No Roles';
		}
		return value.roleName
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
												<div className='col-md-3 col-sm-4'>
													<div className='form-group'>
														<label>Search</label>
														<input type='text' name='text' placeholder='Search by name' className='form-control' value={params.text} onChange={handleChange} />
													</div>
												</div>
												<div className='col-md-3 col-sm-4'>
													<div className='form-group'>
														<label>Role</label>
														<select value={params.role} className='form-control' name='role' onChange={handleChange}>
															{roles && roles.length && (
																roles.map((roleObj: any) => {
																	return (
																		<option key={roleObj.text} value={roleObj.value}>{roleObj.text}</option>
																	);
																})
															)}
														</select>
													</div>
												</div>
												<div className='col-md-3 col-sm-4'>
													<div className='form-group'>
														<label>Status</label>
														<select value={params.status} className='form-control' name='status' onChange={handleChange}>
															<option value=''>All</option>
															<option value='active'>Active</option>
															<option value='inactive'>Inactive</option>
														</select>
													</div>
												</div>
												<div className='col-md-3 col-sm-4'>
													<div className='form-group'>
														<div>
															<label>&nbsp;</label>
														</div>
														<button className='btn btn-info' type='button' onClick={e => handleReset(e)}>Reset</button>&nbsp;
														<button className='btn btn-primary' type='button' onClick={e => handleSearch(e)}>Search</button>
													</div>
												</div>
											</div>
										</form>
										<div className='hr-line-dashed'></div>
										<div className='table-responsive'>
											<table className='table table-bordered table-striped table-hover dataTables-example'>
												<thead>
													<tr>
														<th className={field !== 'name' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'} onClick={e => handleSortChange('name')}>Staff</th>
														<th className={field !== 'email' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'} onClick={e => handleSortChange('email')}>Email</th>
														<th className={field !== 'role' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'} onClick={e => handleSortChange('role')}>Role</th>
														<th className={`text-center ${field !== 'createdAt' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'}`} onClick={e => handleSortChange('createdAt')}>Date Added</th>
														<th className={`text-center ${field !== 'status' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'}`} onClick={e => handleSortChange('status')}>Status</th>
														<th className='text-center'>Action</th>
													</tr>
												</thead>
												<tbody>
													{allStaff && allStaff.length ? (
														allStaff.slice((activePage - 1) * perPage, activePage * perPage).map((staff: any, index: any) => {
															return (
																<tr className='gradeX' key={index}>
																	<td>{staff.firstName} {staff.lastName}</td>
																	<td>{staff.email || '-'}</td>
																	<td>{getRole(staff, index)}</td>
																	<td className='text-center'>{moment(staff.createdAt).format('MMM D, y')}</td>
																	<td className='text-center' style={{ 'textTransform': 'capitalize' }}>{staff.status}</td>
																	<td className='text-center'>
																		<Link style={{'cursor': 'pointer', 'color': '#2a6954'}} key={index} to={`/staff/view/${staff.id}`}>
																			<i title='View | Edit' className='far fa-edit'></i>
																		</Link>
																		&nbsp; 
																		<a style={{'cursor': 'pointer', 'color': '#2a6954'}}  onClick={() => deletePopup(staff, index)}>
																			<i title='Delete' className='far fa-trash-alt'></i>
																		</a>
																	</td>
																	{/* <td>
																		<div style={{ 'position': 'relative' }}>
																			<button data-toggle='dropdown' className='btn btn-xs btn-gray dropdown-toggle'
																				type='button'>Action&nbsp;
																				<span className='caret'></span>
																			</button>
																			<ul className='dropdown-menu'>
																				<li>
																					<Link key={index} to={`/staff/view/${staff._id}`}>
																						View/Edit
																					</Link>
																				</li>
																				<li>
																					<a onClick={() => deletePopup(staff, index)}>Delete</a>
																				</li>
																			</ul>
																		</div>
																	</td> */}
																</tr>
															);
														})
													) : (
														<tr>
															<td colSpan={6} className='text-center'>
																No Staffs
															</td>
														</tr>
													)
													}
												</tbody>
											</table>
											{allStaff.length > 10 ?
												<div className='text-right'>
													<Pagination
														activePage={activePage}
														itemsCountPerPage={perPage}
														totalItemsCount={allStaff.length}
														pageRangeDisplayed={5}
														onChange={(page: any) => setActivePage(page)}
													/>
												</div>
												:
												<></>
											}
										</div>
									</div>
								</div>
							</div>
							<DeleteModal
								title='staff'
								modalPopup={modalPopup}
								closeModal={closeModal}
								handleDelete={handleDelete}
							/>
						</div>
					</div>
				</React.Fragment>
			)}
		</React.Fragment>
	)
}

const mapActionsToProps = {
	getAllStaff,
	searchStaff,
	deleteStaff,
	getAllCategory
}

export default connect(null, mapActionsToProps)(Staffs)