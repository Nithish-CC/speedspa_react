import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { searchEstimatedPayroll } from '../../redux/actions/reportActions';
import { getAllClients } from '../../redux/actions/clientActions';
import { sorting, commafy, buildFilter } from '../../utils/common';
import PageHeader from '../core/PageHeader';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalHeader from 'react-bootstrap/ModalHeader';

const EstimatedPayroll = (props: any) => {
	const [errors, setErrors] = useState({} as Error);
	const [title] = useState('Estimated Payroll');
	const [orderBy, setOrderBy] = useState(false);
	const [field, setField] = useState('staffName');
	const [params, setParams] = useState({
		begin_time: moment(new Date()).format('YYYY-MM-DD'),
		end_time: moment(new Date()).format('YYYY-MM-DD'),
		resourceId: '',
	});

	const [modalPopup, setModalPopup] = useState({
		deleteModal: false,
		name: [],
		index: '',
	});

	const [initialModalPopup] = useState({ ...modalPopup });

	// From Reducer
	const UI = useSelector((state: any) => state.UI);
	const user = useSelector((state: any) => state.user);
	const report = useSelector((state: any) => state.report);
	const allClients = user.allClients;
	const estimatedPay = report.reportEstimatedRoll[0];

	useEffect(() => {
		getAllClients();
		handleSearch();
		if (UI.errors) {
			setErrors(UI.errors);
		}
	}, []);

	const percentageNum: number = 100;

	const getAllClients = () => {
		var data: any = {
			filter: {
				roles: 'stylist',
			},
		};
		data.filter.status = {
			$in: ['active'],
		};
		var query = buildFilter(data);
		query.businessId = localStorage.businessId;
		props.getAllClients(query);
	};

	const handleChange = (event: any) => {
		setParams({
			...params,
			[event.target.name]: event.target.value,
		});
	};

	const handleSearch = () => {
		var filter: any = {};
		if (params.resourceId) {
			filter.resourceId = params.resourceId;
		}
		var data = Object.assign({}, { filter: filter });
		var query = buildFilter(data);
		query.begin_time = params.begin_time;
		query.end_time = params.end_time;
		query.businessId = localStorage.businessId;
		props.searchEstimatedPayroll(query);
	};

	const handleModalPopup = (value: any, index: any) => {
		setModalPopup({
			deleteModal: !modalPopup.deleteModal,
			name: value,
			index: index,
		});
	};

	const closeModal = () => {
		setModalPopup(initialModalPopup);
	};

	const handleSortChange = (key: any) => {
		if (field === key) {
			setOrderBy(!orderBy);
		} else {
			setOrderBy(true);
			setField(key);
		}
		sorting(estimatedPay.data, key, orderBy);
	};

	const printContent = (e: any) => {
		const printContent: any = document.getElementById('specificEstimatedPayrollPrintDiv');
		const WindowPrt: any = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
		WindowPrt.document.write(printContent.innerHTML);
		WindowPrt.document.close();
		WindowPrt.focus();
		WindowPrt.print();
		WindowPrt.close();
	}

	const ModalWithGrid = (props: any) => {
		const { modalPopup, closeModal } = props;
		return (
			<Modal size='lg' show={modalPopup.deleteModal} animation={false}>
				<ModalHeader>
					<button type='button' className='close' onClick={() => closeModal()}>
						<span aria-hidden='true'>×</span>
					</button>
				</ModalHeader>
				<ModalBody>
					<h3 className='text-center'>
						<button className='btn btn-sm btn-default'
							style={{ 'marginBottom': '10px', 'fontWeight': '600', 'background': '#EFEFEF', 'borderColor': '#dddddd' }}
							onClick={e => printContent(e)} name='productSalesPrintDiv' id='printBtn'>Print <i className='fa fa-print'></i>
						</button>
					</h3>
					<div
						className='container-fluid'
						id='specificEstimatedPayrollPrintDiv'
					>
						<div className='row table-responsive'>
							<div className='col-sm-12'>
								<table className='table table-condensed table-striped table-bordered align-middle'>
									<thead>
										<tr>
											<th
												style={{ width: '70%' }}
												className='text-left text-uppercase'
											>
												Estimated Payroll
											</th>
											<th style={{ width: '30%' }} className='text-center'>
												{moment(params.begin_time).format('LL')} - &nbsp;
												{moment(params.end_time).format('LL')}
											</th>
										</tr>
									</thead>
								</table>
								<table className='table table-condensed table-striped table-bordered align-middle'>
									<thead>
										<tr>
											<th colSpan={9} className='text-center text-uppercase'>
												{modalPopup.name.staffName}
											</th>
										</tr>
										<tr>
											<th className='text-center'>Service Revenue</th>
											<th className='text-center'>Service Payout</th>
											<th className='text-center'>Tip Revenue</th>
											<th className='text-center'>Tip Payout</th>
											<th className='text-center'>Product Sales</th>
											<th className='text-center'>Product Payout</th>
											<th className='text-center'>Payout Cash</th>
											<th className='text-center'>Payout Check</th>
											<th className='text-center'>Total Hours</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td className='text-center'>
												$
												{commafy(
													(
														Math.round(modalPopup.name.serviceRevenue * 100) /
														100
													).toFixed(2)
												)}
											</td>
											<td className='text-center'>
												$
												{commafy(
													(
														Math.round(modalPopup.name.servicePayout * 100) /
														100
													).toFixed(2)
												)}
											</td>
											<td className='text-center'>
												$
												{commafy(
													(
														Math.round(modalPopup.name.tipRevenue * 100) / 100
													).toFixed(2)
												)}
											</td>
											<td className='text-center'>
												$
												{commafy(
													(
														Math.round(modalPopup.name.tipPayout * 100) / 100
													).toFixed(2)
												)}
											</td>
											<td className='text-center'>
												$
												{commafy(
													(
														Math.round(modalPopup.name.productRevenue * 100) /
														100
													).toFixed(2)
												)}
											</td>
											<td className='text-center'>
												$
												{commafy(
													(
														Math.round(modalPopup.name.productPayout * 100) /
														100
													).toFixed(2)
												)}
											</td>
											<td className='text-center'>
												<b>
													{' '}
													$
													{commafy(
														(
															Math.round(modalPopup.name.payoutCash * 100) / 100
														).toFixed(2)
													)}
												</b>
											</td>
											<td className='text-center'>
												<b>
													{' '}
													$
													{commafy(
														(
															Math.round(modalPopup.name.payoutCheck * 100) /
															100
														).toFixed(2)
													)}
												</b>
											</td>
											<td className='text-center'>
												$
												{commafy(
													(
														Math.round(modalPopup.name.totalHours * 100) / 100
													).toFixed(2)
												)}{' '}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div className='row table-responsive'>
							<div className='col-sm-4'>
								<p>
									<b>Staff Pay % in the Sale</b>
								</p>
								<table className='table table-condensed table-striped table-bordered align-middle'>
									<thead>
										<tr>
											<th>Name</th>
											<th className='text-center'>Percentage</th>
										</tr>
									</thead>
									<tbody>
										{modalPopup.name.data &&
											modalPopup.name.data.length &&
											modalPopup.name.data[0].staffPctOfServiceSales.map(
												(value: any) => {
													return (
														<tr>
															<td className='capitalize'>{value.name}</td>
															<td className='text-center'>
																{value.percentage}%
															</td>
														</tr>
													);
												}
											)}
										<tr>
											<td>Tips</td>
											<td className='text-center'>
												{modalPopup.name.data &&
													modalPopup.name.data.length &&
													modalPopup.name.data[0].staff.pctOfTips}
												%
											</td>
										</tr>
										<tr>
											<td>Products</td>
											<td className='text-center'>
												{modalPopup.name.data &&
													modalPopup.name.data.length &&
													modalPopup.name.data[0].staff.pctOfProductSales}
												%
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div className='col-sm-4'>
								<p>
									<b>Revenue & Payout Details</b>
								</p>
								<table className='table table-condensed table-striped table-bordered align-middle'>
									<thead>
										<tr>
											<th>Type</th>
											<th className='text-center'>Revenue</th>
											<th className='text-center'>Payout</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Services</td>
											<td className='text-center'>
												$
												{commafy(
													(
														Math.round(modalPopup.name.serviceRevenue * 100) /
														100
													).toFixed(2)
												)}
											</td>
											<td className='text-center'>
												$
												{commafy(
													(
														Math.round(modalPopup.name.servicePayout * 100) /
														100
													).toFixed(2)
												)}
											</td>
										</tr>
										<tr>
											<td>Tips</td>
											<td className='text-center'>
												$
												{commafy(
													(
														Math.round(modalPopup.name.tipRevenue * 100) / 100
													).toFixed(2)
												)}
											</td>
											<td className='text-center'>
												$
												{commafy(
													(
														Math.round(modalPopup.name.tipPayout * 100) / 100
													).toFixed(2)
												)}
											</td>
										</tr>
										<tr>
											<td>Products</td>
											<td className='text-center'>
												$
												{commafy(
													(
														Math.round(modalPopup.name.productRevenue * 100) /
														100
													).toFixed(2)
												)}
											</td>
											<td className='text-center'>
												$
												{commafy(
													(
														Math.round(modalPopup.name.productPayout * 100) /
														100
													).toFixed(2)
												)}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div className='col-sm-4'>
								<p>
									<b>Payout Details</b>
								</p>
								<table className='table table-condensed table-striped table-bordered align-middle'>
									<thead>
										<tr>
											<th>Type</th>
											<th className='text-center'>Amount</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>{`check (${modalPopup.name.productPayoutPercentage} %)`}</td>
											<td className='text-center'>
												<strong>
													{' '}
													$
													{commafy(
														(
															Math.round(modalPopup.name.payoutCheck * 100) /
															100
														).toFixed(2)
													)}
												</strong>
											</td>
										</tr>
										<tr>
											<td>{`cash (${percentageNum - modalPopup.name.productPayoutPercentage
												} %)`}</td>
											<td className='text-center'>
												<strong>
													{' '}
													$
													{commafy(
														(
															Math.round(modalPopup.name.payoutCash * 100) / 100
														).toFixed(2)
													)}
												</strong>
											</td>
										</tr>
										<tr>
											<td>Total</td>
											<td className='text-center'>
												<strong>
													{' '}
													$
													{commafy(
														(
															Math.round(modalPopup.name.totalAmount * 100) /
															100
														).toFixed(2)
													)}
												</strong>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div className='row table-responsive'>
							<div className='col-sm-12'>
								<p>
									<b>Services/Products Details</b>
								</p>
								<table className='table table-striped table-bordered align-middle'>
									<thead style={{ minHeight: '100px' }}>
										<tr>
											<th className='text-center'>Customer</th>
											<th className='text-center'>Services/Products</th>
											<th className='text-center'>Price</th>
											<th className='text-center'>Tip</th>
											<th className='text-center'>Tax</th>
											<th className='text-center'>Total</th>
										</tr>
									</thead>
									<tbody>
										{modalPopup.name.data && modalPopup.name.data.length ? (
											modalPopup.name.data.map((value: any) => {
												return (
													<tr className='gradeX'>
														<td className='text-capitalize'>
															<strong>{value.clientName}</strong>
															<br />
															<small>
																<i>
																	{' '}
																	{moment(value.appTimeStart).format(
																		'LL LT'
																	)} | {value.type}
																</i>
															</small>
														</td>
														<td className='text-center text-capitalize'>
															{value.itemNames}
														</td>
														<td className='text-center'>
															$
															{commafy(
																(Math.round(value.amount * 100) / 100).toFixed(
																	2
																)
															)}
														</td>
														<td className='text-center'>
															$
															{commafy(
																(Math.round(value.tip * 100) / 100).toFixed(2)
															)}
														</td>
														<td className='text-center'>
															$
															{commafy(
																(Math.round(value.tax * 100) / 100).toFixed(2)
															)}
														</td>
														<td className='text-center'>
															$
															{commafy(
																(Math.round(value.total * 100) / 100).toFixed(2)
															)}
														</td>
													</tr>
												);
											})
										) : (
											<tr>
												<td colSpan={9} align='center'>
													No Reports
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</ModalBody>
			</Modal>
		);
	};

	return (
		<React.Fragment>
			{user.authenticated && !UI.loading && (
				<React.Fragment>
					<ModalWithGrid modalPopup={modalPopup} closeModal={closeModal} />
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
															value={params.end_time}
															onChange={handleChange}
															required
														/>
														<div>
															<span className='text-danger'></span>
														</div>
													</div>
												</div>
												<div className='col-sm-4'>
													<div className='form-group'>
														<label>Staff</label>
														<select
															className='form-control'
															onChange={handleChange}
															name='resourceId'
														>
															<option value=''>All</option>
															{allClients &&
																allClients.length &&
																allClients.map((value: any) => {
																	return (
																		<option value={value.id}>
																			{value.deleted
																				? `${value.name} [D]`
																				: value.name}
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
														{estimatedPay &&
															estimatedPay.data &&
															estimatedPay.data.length > 0 && (
																<tr>
																	<th
																		colSpan={6}
																		className='text-left text-uppercase'
																	>
																		Estimated Payroll
																	</th>
																	<th colSpan={5} className='text-center'>
																		{moment(params.begin_time).format('LL')} -
																		&nbsp;
																		{moment(params.end_time).format('LL')}
																	</th>
																</tr>
															)}
														<tr key='header'>
															<th
																align='center'
																className={
																	field != 'staffName'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) => handleSortChange('staffName')}
															>
																Name
															</th>
															<th
																className={
																	field != 'serviceRevenue'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) =>
																	handleSortChange('serviceRevenue')
																}
															>
																Service Revenue
															</th>
															<th
																style={{ textAlign: 'center' }}
																className={
																	field != 'servicePayout'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) =>
																	handleSortChange('servicePayout')
																}
															>
																Service Payout
															</th>
															<th
																style={{ textAlign: 'center' }}
																className={
																	field != 'tipRevenue'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) => handleSortChange('tipRevenue')}
															>
																Tip Revenue
															</th>
															<th
																style={{ textAlign: 'center' }}
																className={
																	field != 'tipPayout'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) => handleSortChange('tipPayout')}
															>
																Tip Payout
															</th>
															<th
																style={{ textAlign: 'center' }}
																className={
																	field != 'productRevenue'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) =>
																	handleSortChange('productRevenue')
																}
															>
																Product Sales
															</th>
															<th
																style={{ textAlign: 'center' }}
																className={
																	field != 'productPayout'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) =>
																	handleSortChange('productPayout')
																}
															>
																Product Payout
															</th>
															<th
																style={{ textAlign: 'center' }}
																className={
																	field != 'payoutCash'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) => handleSortChange('payoutCash')}
															>
																Payout Cash
															</th>
															<th
																style={{ textAlign: 'center' }}
																className={
																	field != 'payoutCheck'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) => handleSortChange('payoutCheck')}
															>
																Payout Check
															</th>
															<th
																style={{ textAlign: 'center' }}
																className={
																	field != 'totalHours'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) => handleSortChange('totalHours')}
															>
																Total Hours
															</th>
															<th
																style={{ textAlign: 'center' }}
																className='text-center ignore'
															>
																Sales Details
															</th>
														</tr>
													</thead>
													<tbody>
														{!UI.buttonLoading &&
															estimatedPay &&
															estimatedPay.data &&
															estimatedPay.data.length ? (
															<React.Fragment>
																{estimatedPay.data.map(
																	(eachPayRoll: any, index: any) => {
																		return (
																			<tr className='gradeX' key={index}>
																				<th>{eachPayRoll.staffName}</th>
																				<td className='text-center'>
																					$
																					{commafy(
																						(
																							Math.round(
																								eachPayRoll.serviceRevenue * 100
																							) / 100
																						).toFixed(2)
																					)}
																				</td>
																				<td className='text-center'>
																					$
																					{commafy(
																						(
																							Math.round(
																								eachPayRoll.servicePayout * 100
																							) / 100
																						).toFixed(2)
																					)}
																				</td>
																				<td className='text-center'>
																					$
																					{commafy(
																						(
																							Math.round(
																								eachPayRoll.tipRevenue * 100
																							) / 100
																						).toFixed(2)
																					)}
																				</td>
																				<td className='text-center'>
																					$
																					{commafy(
																						(
																							Math.round(
																								eachPayRoll.tipPayout * 100
																							) / 100
																						).toFixed(2)
																					)}
																				</td>
																				<td className='text-center'>
																					$
																					{commafy(
																						(
																							Math.round(
																								eachPayRoll.productRevenue * 100
																							) / 100
																						).toFixed(2)
																					)}
																				</td>
																				<td className='text-center'>
																					$
																					{commafy(
																						(
																							Math.round(
																								eachPayRoll.productPayout * 100
																							) / 100
																						).toFixed(2)
																					)}
																				</td>
																				<th className='text-center'>
																					$
																					{commafy(
																						(
																							Math.round(
																								eachPayRoll.payoutCash * 100
																							) / 100
																						).toFixed(2)
																					)}
																				</th>
																				<th className='text-center'>
																					$
																					{commafy(
																						(
																							Math.round(
																								eachPayRoll.payoutCheck * 100
																							) / 100
																						).toFixed(2)
																					)}
																				</th>
																				<td className='text-center'>
																					{eachPayRoll.totalHours}
																				</td>
																				<td className='text-center'>
																					{eachPayRoll.serviceRevenue > 0 && eachPayRoll.servicePayout > 0 && eachPayRoll.tipRevenue > 0 && eachPayRoll.tipPayout > 0  && eachPayRoll.productRevenue>0 && eachPayRoll.productPayout>0 && eachPayRoll.payoutCash > 0 && eachPayRoll.payoutCheck > 0  && <a
																						href=''
																						data-toggle='modal'
																						data-target='.bs-example-modal-lg'
																						onClick={() =>
																							handleModalPopup(
																								eachPayRoll,
																								index
																							)
																						}
																					>
																						<i className='glyphicon glyphicon-eye-open'></i>{' '}
																						Show
																					</a>}
																				</td>
																			</tr>
																		);
																	}
																)}
																<tr className='ignore font-weight-bold'>
																	<th>Summary</th>
																	<th className='text-center'>
																		$
																		{commafy(
																			(
																				Math.round(
																					estimatedPay.totalServiceRevenue * 100
																				) / 100
																			).toFixed(2)
																		)}
																	</th>
																	<th className='text-center'>
																		$
																		{commafy(
																			(
																				Math.round(
																					estimatedPay.totalTipRevenue * 100
																				) / 100
																			).toFixed(2)
																		)}
																	</th>
																	<th className='text-center'>
																		$
																		{commafy(
																			(
																				Math.round(
																					estimatedPay.totalTipPayout * 100
																				) / 100
																			).toFixed(2)
																		)}
																	</th>
																	<th className='text-center'>
																		$
																		{commafy(
																			(
																				Math.round(
																					estimatedPay.totalTipPayout * 100
																				) / 100
																			).toFixed(2)
																		)}
																	</th>
																	<th className='text-center'>
																		$
																		{commafy(
																			(
																				Math.round(
																					estimatedPay.totalProductRevenue * 100
																				) / 100
																			).toFixed(2)
																		)}
																	</th>
																	<th className='text-center'>
																		$
																		{commafy(
																			(
																				Math.round(
																					estimatedPay.totalProductPayout * 100
																				) / 100
																			).toFixed(2)
																		)}
																	</th>
																	<th className='text-center'>
																		$
																		{commafy(
																			(
																				Math.round(
																					estimatedPay.totalPayoutCash * 100
																				) / 100
																			).toFixed(2)
																		)}
																	</th>
																	<th className='text-center'>
																		$
																		{commafy(
																			(
																				Math.round(
																					estimatedPay.totalPayoutCheck * 100
																				) / 100
																			).toFixed(2)
																		)}
																	</th>
																	<th colSpan={2}></th>
																</tr>
															</React.Fragment>
														) : (
															<tr>
																<td colSpan={11} className='text-center'>
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
	getAllClients,
	searchEstimatedPayroll,
};

export default connect(null, mapActionsToProps)(EstimatedPayroll);
