import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { searchServiceCompleted } from '../../redux/actions/reportActions';
import { getRootServiceCategory } from '../../redux/actions/serviceActions';
import { sorting, commafy, buildFilter } from '../../utils/common';
import PageHeader from '../core/PageHeader';
import moment from 'moment';

const ServicesCompleted = (props: any) => {
	const [errors, setErrors] = useState({} as Error);
	const [title] = useState('Services Completed');
	const [orderBy, setOrderBy] = useState(false);
	const [field, setField] = useState('serviceName');
	const [params, setParams] = useState({
		begin_time: moment(new Date()).format('YYYY-MM-DD'),
		end_time: moment(new Date()).format('YYYY-MM-DD'),
		rootCategoryId: ''
	});

	// From Reducer
	const UI = useSelector((state: any) => state.UI);
	const user = useSelector((state: any) => state.user);
	const reportService = useSelector((state: any) => state.report);
	const service = useSelector((state: any) => state.service);
	const serviceCompletedData = reportService.reportServiceCompleted[0];
	const allService = service.getRootServiceCategory;

	useEffect(() => {
		getRootServiceCategory();
		handleSearch();
		if (UI.errors) {
			setErrors(UI.errors);
		}
	}, []);

	const getRootServiceCategory = () => {
		const params = {
			businessId: localStorage.businessId,
		}
		props.getRootServiceCategory(params)
	}

	const handleChange = (event: any) => {
		setParams({
			...params,
			[event.target.name]: event.target.value,
		});
	};

	const handleSearch = () => {
		var filter: any = {};
		if (params.rootCategoryId) {
			filter.rootCategoryId = params.rootCategoryId;
		}
		var data = Object.assign({}, { 'filter': filter });
		var query = buildFilter(data);
		query.begin_time = new Date(params.begin_time)
		query.end_time = new Date(params.end_time)
		query.businessId = localStorage.businessId
		props.searchServiceCompleted(query);
	};

	const handleSortChange = (key: any) => {
		if (field === key) {
			setOrderBy(!orderBy);
		} else {
			setOrderBy(true);
			setField(key);
		}
		sorting(serviceCompletedData.data, key, orderBy);
	};

	return (
		<React.Fragment>
			{user.authenticated && !UI.loading && (
				<React.Fragment>
					<PageHeader title={title} />
					<div className='row'>
						<div className='col-lg-12'>
							<div className='wrapper wrapper-content animated fadeInRight'>
								<div className='ibox float-e-margins m-b-none'>
									<div className='ibox-content'>
										<form role='form'>
											<div className='row'>
												<div className='col-sm-3'>
													<div className='form-group'>
														<label>Start Date</label>
														<input
															type='date'
															className='form-control'
															name='begin_time'
															value={params.begin_time}
															onChange={handleChange}
															required
														/>
													</div>
												</div>
												<div className='col-sm-3'>
													<div className='form-group'>
														<label>End Date</label>
														<input
															type='date'
															className='form-control'
															name='end_time'
															value={params.begin_time}
															onChange={handleChange}
															required
														/>
													</div>
												</div>
												<div className='col-sm-4'>
													<div className='form-group'>
														<label>Category</label>
														<select
															className='form-control'
															onChange={handleChange}
															name='rootCategoryId'
														>
															<option value=''>All</option>
															{allService &&
																allService.length &&
																allService.map((value: any) => {
																	return (
																		<option value={value.id}>
																			{value.name}
																		</option>
																	);
																})}
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
										<div className='row'>
											<div className='col-sm-12 table-responsive'>
												<table className='table table-striped table-bordered table-condensed align-middle dataTables-example'>
													<thead>
														{!UI.buttonLoading &&
															serviceCompletedData &&
															serviceCompletedData.data &&
															serviceCompletedData.data.length > 0 && (
																<React.Fragment>
																	<tr>
																		<th
																			colSpan={4}
																			className='text-left text-uppercase'
																		>
																			{title}
																		</th>
																		<th colSpan={2} className='text-center'>
																			{moment(params.begin_time).format('LL')} -
																			{moment(params.end_time).format('LL')}
																		</th>
																	</tr>
																	<tr className='ignore font-weight-bold'>
																		<th>Summary</th>
																		<th colSpan={2}></th>
																		<th className='text-center'>
																			{
																				serviceCompletedData.summaryOfServiceAmountCompleted
																			}
																		</th>
																		<th className='text-center'>
																			$
																			{commafy(
																				(
																					Math.round(
																						serviceCompletedData.summaryOfTotalGrossServiceRevenue *
																						100
																					) / 100
																				).toFixed(2)
																			)}
																		</th>
																		<th> </th>
																	</tr>
																</React.Fragment>
															)}
														<tr key='header'>
															<th
																className={
																	field !== 'serviceName'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) => handleSortChange('serviceName')}
															>
																Service
															</th>
															<th
																style={{ textAlign: 'center' }}
																className={
																	field !== 'rootCategoryName'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) =>
																	handleSortChange('rootCategoryName')
																}
															>
																Category
															</th>
															<th
																style={{ textAlign: 'center' }}
																className={
																	field !== 'displayRange'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) =>
																	handleSortChange('displayRange')
																}
															>
																Display Range
															</th>
															<th
																style={{ textAlign: 'center' }}
																className={
																	field !== 'serviceAmountCompleted'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) =>
																	handleSortChange('serviceAmountCompleted')
																}
															>
																Number Completed
															</th>
															<th
																style={{ textAlign: 'center' }}
																className={
																	field !== 'totalGrossServiceRevenue'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) =>
																	handleSortChange('totalGrossServiceRevenue')
																}
															>
																Total Gross Service Revenue
															</th>
															<th
																style={{ textAlign: 'center' }}
																className='text-center ignore'
															>
																Details
															</th>
														</tr>
													</thead>
													<tbody>
														{!UI.buttonLoading &&
															serviceCompletedData &&
															serviceCompletedData.data &&
															serviceCompletedData.data.length > 0 ? (
															<React.Fragment>
																{serviceCompletedData.data.map((value: any) => {
																	return (
																		<tr className='gradeX'>
																			<td>{value.serviceName}</td>
																			<td className='text-center'>
																				{value.rootCategoryName}
																			</td>
																			<td className='text-center'>
																				{value.displayRange}
																			</td>
																			<td className='text-center'>
																				{value.serviceAmountCompleted}
																			</td>
																			<td className='text-center'>
																				$
																				{commafy(
																					(
																						Math.round(
																							value.totalGrossServiceRevenue *
																							100
																						) / 100
																					).toFixed(2)
																				)}
																			</td>
																			<td>
																				{value.details &&
																					value.details.length &&
																					value.details.map(
																						(detailsValue: any, index: any) => {
																							return (
																								<React.Fragment>
																									{detailsValue.staffName} :{' '}
																									{detailsValue.total}{' '}
																									{value.details.length - 1 ===
																										index
																										? ''
																										: ','}
																								</React.Fragment>
																							);
																						}
																					)}
																			</td>
																		</tr>
																	);
																})}
																<tr className='ignore font-weight-bold'>
																	<th>Summary</th>
																	<th colSpan={2}></th>
																	<th className='text-center'>
																		{
																			serviceCompletedData.summaryOfServiceAmountCompleted
																		}
																	</th>
																	<th className='text-center'>
																		$
																		{commafy(
																			(
																				Math.round(
																					serviceCompletedData.summaryOfTotalGrossServiceRevenue *
																					100
																				) / 100
																			).toFixed(2)
																		)}
																	</th>
																	<th> </th>
																</tr>
															</React.Fragment>
														) : (
															<tr>
																<td colSpan={6} className='text-center'>
																	{!UI.buttonLoading ? 
                                                                        'No Reports' 
                                                                        :
                                                                        <div>
                                                                            <p className='fa fa-spinner fa-spin'></p> <br /> Please Wait , Loading... 
                                                                        </div>
                                                                    }
																</td>
															</tr>
														)}
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</React.Fragment>
			)}
		</React.Fragment>
	);
};

const mapActionsToProps = {
	searchServiceCompleted,
	getRootServiceCategory
};

export default connect(null, mapActionsToProps)(ServicesCompleted);
