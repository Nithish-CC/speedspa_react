import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { searchProductSales } from '../../redux/actions/reportActions';
import { sorting, commafy, buildFilter } from '../../utils/common';
import PageHeader from '../core/PageHeader';
import moment from 'moment';
import _ from 'lodash';
import exportFromJSON from 'export-from-json';

const ProductSales = (props: any) => {
	const [errors, setErrors] = useState({} as Error);
	const [title] = useState('Product Sales');
	const [orderBy, setOrderBy] = useState(false);
	const [field, setField] = useState('productName');
	const [params, setParams] = useState({
		begin_time: moment(new Date()).format('YYYY-MM-DD'),
		end_time: moment(new Date()).format('YYYY-MM-DD'),
		businessId: localStorage.businessId,
	});
	const [brand, setBrand] = useState('');
	const [searchResults, setSearchResults] = useState([]);

	// From Reducer
	const UI = useSelector((state: any) => state.UI);
	const user = useSelector((state: any) => state.user);
	const report = useSelector((state: any) => state.report);
	let productSalesReport = report.reportProductSales;

	useEffect(() => {
		handleSearch();
		if (UI.errors) {
			setErrors(UI.errors);
		}
	}, []);

	useEffect(() => {
		filterData();
	}, [productSalesReport]);

	const handleSearch = () => {
		props.searchProductSales(params);
	};

	const handleChange = (event: any) => {
		setParams({
			...params,
			[event.target.name]: event.target.value,
		});
	};

	const filterData = () => {
		if (brand) {
			const newFliterJob: any = productSalesReport[0].data.filter(
				(data: any) => {
					return Object.values(data)
						.join(' ')
						.toLocaleLowerCase()
						.includes(brand.toLocaleLowerCase());
				}
			);
			setSearchResults(newFliterJob);
		} else if (productSalesReport && productSalesReport.length) {
			setSearchResults(productSalesReport[0].data);
		}
	};

	const dataFilter: any = () => {
		let status: any = productSalesReport[0].data
			.map((value: any) => {
				return value.brand;
			})
			.filter(
				(v: any, i: any, currentStatus: any) => currentStatus.indexOf(v) === i
			);
		return status;
	};

	const handleSortChange = (key: any) => {
		if (field === key) {
			setOrderBy(!orderBy);
		} else {
			setOrderBy(true);
			setField(key);
		}
		sorting(productSalesReport[0].data, key, orderBy);
	};

	const addInventoryQuatity = (searchResults: any) => {
		let sumOfAddition = 0;
		searchResults.forEach((element: any) => {
			sumOfAddition += element.inventoryQuatity
		});
		return sumOfAddition;
	};
	const addInventoryValue = (searchResults: any) => {
		let sumOfAddition = 0;
		searchResults.forEach((element: any) => {
			sumOfAddition += element.inverntoryValue
		});
		return sumOfAddition;
	};

	const addSoldStockQuatity = (searchResults: any) => {
		let sumOfAddition = 0;
		searchResults.forEach((element: any) => {
			sumOfAddition += element.quantitySold
		});
		return sumOfAddition;
	};
	const addSoldStockValue = (searchResults: any) => {
		let sumOfAddition = 0;
		searchResults.forEach((element: any) => {
			sumOfAddition += element.soldValue
		});
		return sumOfAddition;
	};

	const printContent = (e: any) => {
		const printContent: any = document.getElementById('productSalesPrintDiv');
		const WindowPrt: any = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
		WindowPrt.document.write(printContent.innerHTML);
		WindowPrt.document.close();
		WindowPrt.focus();
		WindowPrt.print();
		WindowPrt.close();
	}

	const ExportToExcel = (e: any) => {
		if (searchResults && searchResults.length) {
			let jsonData: any = []
			searchResults.forEach((report: any) => {
				jsonData.push({
					'Product Name': _.capitalize(report.productName),
					'Brand': _.capitalize(report.brand),
					'Price': '$' + (report.price ? report.price : 0),
					'Inventory Quantity': report.inventoryQuatity ? report.inventoryQuatity : 0,
					'Inventory Values': '$' + (report.inverntoryValue ? report.inverntoryValue : 0),
					'Quantity Sold': report.quantitySold ? report.quantitySold : 0,
					'Sold Value': '$' + (report.soldValue ? report.soldValue : 0),
				});
			});
			var sortedJsonData = _.sortBy(jsonData, ['Product Name'])
			sortedJsonData.push({
				'Product Name': 'Summary',
				'Brand': '',
				'Price': '',
				'Inventory Quantity': addInventoryQuatity(searchResults),
				'Inventory Values': '$' + addInventoryValue(searchResults),
				'Quantity Sold': addSoldStockQuatity(searchResults),
				'Sold Value': '$' + addSoldStockValue(searchResults)
			});
			exportFromJSON({ data: sortedJsonData, fileName: 'Product Sales', exportType: exportFromJSON.types.csv })
		}
	}

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
															value={params.end_time}
															onChange={handleChange}
															required
														/>
													</div>
												</div>
												<div className='col-sm-3'>
													<div className='form-group'>
														<label>Brand</label>
														<select
															className='form-control'
															onChange={(e) => setBrand(e.target.value)}
															name='brand'>
															<option value=''>All</option>
															{productSalesReport &&
																productSalesReport[0] &&
																productSalesReport[0].data &&
																productSalesReport[0].data.length &&
																dataFilter(productSalesReport[0].data).map(
																	(val: any) => {
																		return <option value={val}>{val}</option>;
																	}
																)}
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
																onClick={(e) => handleSearch()}>
																Search
															</button>
														</div>
													</div>
												</div>
											</div>
										</form>

										<div className='hr-line-dashed'></div>
										<div className='row text-center'>
											{!UI.buttonLoading &&
												productSalesReport && productSalesReport[0] &&
												productSalesReport[0].data &&
												productSalesReport[0].data.length ? (
												<>
													<div className='col-sm-6'>
														<div className='panel panel-default'>
															<div className='panel-heading'>
																<h3 className='panel-title'>Sold Stock</h3>
															</div>
															<div className='panel-body'>
																<b>Quantity: </b>
																{addSoldStockQuatity(searchResults)}
																<br />
																<b>Values: </b>$
																{commafy(
																	(
																		Math.round(
																			addSoldStockValue(searchResults) *
																			100
																		) / 100
																	).toFixed(2)
																)}
															</div>
														</div>
													</div>
													<div className='col-sm-6'>
														<div className='panel panel-default'>
															<div className='panel-heading'>
																<h3 className='panel-title'>Total Inventory</h3>
															</div>
															<div className='panel-body'>
																<b>Quantity:</b>
																{addInventoryQuatity(searchResults)}

																<br />
																<b>Values:</b> $
																{commafy(
																	(
																		Math.round(
																			addInventoryValue(searchResults) * 100) / 100
																	).toFixed(2)
																)}
															</div>
														</div>
													</div>
												</>
											) : (
												<React.Fragment></React.Fragment>
											)}
										</div>

										<div className='hr-line-dashed'></div>
										<div className='row'>
											<div className='col-sm-12 text-right' ng-if='vm.filteredReports.length'>
												<button className='btn btn-sm btn-default'
													style={{ 'marginBottom': '10px', 'fontWeight': '600', 'background': '#EFEFEF', 'borderColor': '#dddddd' }}
													onClick={e => printContent(e)} name='productSalesPrintDiv' id='printBtn'>Print <i className='fa fa-print'></i>
												</button>&nbsp;
												<button className='btn btn-sm btn-default'
													style={{ 'marginBottom': '10px', 'fontWeight': '600', 'background': '#EFEFEF', 'borderColor': '#dddddd' }}
													onClick={e => ExportToExcel(e)}>Export to Excel <i className='fa fa-download'></i></button>
											</div>
											<div className='col-sm-12 table-responsive' id='productSalesPrintDiv'>
												<table className='table table-striped table-bordered table-condensed align-middle dataTables-example'>
													<thead>
														{!UI.buttonLoading &&
															searchResults &&
															searchResults.length > 0 && (
																<tr>
																	<th
																		colSpan={4}
																		className='text-left text-uppercase'
																	>
																		{title}
																	</th>
																	<th colSpan={3} className='text-center'>
																		{moment(params.begin_time).format('LL')} -{' '}
																		{moment(params.end_time).format('LL')}
																	</th>
																</tr>
															)}
														<tr className='align-middle ignore'>
															<th colSpan={3}></th>
															<th colSpan={2} className='text-center'>
																Current Stock Inventory
															</th>
															<th colSpan={2} className='text-center'>
																Total SOLD
															</th>
														</tr>
														<tr key='header'>
															<th
																className={
																	field != 'productName'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) => handleSortChange('productName')}
															>
																Product Name
															</th>
															<th
																style={{ textAlign: 'center' }}
																className={
																	field != 'brand'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) => handleSortChange('brand')}
															>
																Brand
															</th>
															<th
																style={{ textAlign: 'center' }}
																className={
																	field != 'price'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) => handleSortChange('price')}
															>
																Price
															</th>
															<th
																style={{ textAlign: 'center' }}
																className={
																	field != 'inventoryQuatity'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) =>
																	handleSortChange('inventoryQuatity')
																}
															>
																Inventory Quantity
															</th>
															<th
																style={{ textAlign: 'center' }}
																className={
																	field != 'inverntoryValue'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) =>
																	handleSortChange('inverntoryValue')
																}
															>
																Inventory Values
															</th>
															<th
																style={{ textAlign: 'center' }}
																className={
																	field != 'quantitySold'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) =>
																	handleSortChange('quantitySold')
																}
															>
																Quantity Sold
															</th>
															<th
																style={{ textAlign: 'center' }}
																className={
																	field != 'soldValue'
																		? 'sorting'
																		: orderBy
																			? 'sorting_asc'
																			: 'sorting_desc'
																}
																onClick={(e) => handleSortChange('soldValue')}
															>
																Sold Value
															</th>
														</tr>
													</thead>
													<tbody>
														{!UI.buttonLoading &&
															searchResults &&
															searchResults.length ? (
															<React.Fragment>
																{searchResults.map((value: any) => {
																	return (
																		<tr className='gradeX'>
																			<td>
																				{value.productName}
																			</td>
																			<td className='text-center'>
																				{value.brand}
																			</td>
																			<td className='text-center'>
																				$
																				{commafy(
																					(
																						Math.round(value.price * 100) / 100
																					).toFixed(2)
																				)}
																			</td>
																			<td className='text-center'>
																				{value.inventoryQuatity}
																			</td>
																			<td className='text-center'>
																				$
																				{commafy(
																					(
																						Math.round(
																							value.inverntoryValue * 100
																						) / 100
																					).toFixed(2)
																				)}
																			</td>
																			<td className='text-center'>
																				{value.quantitySold}
																			</td>
																			<td className='text-center'>
																				$
																				{commafy(
																					(
																						Math.round(value.soldValue * 100) /
																						100
																					).toFixed(2)
																				)}
																			</td>
																		</tr>
																	);
																})}
																<tr>
																	<th colSpan={3}>
																		Summary:
																		<small>
																			<i>
																				(Gift/Packages quantity and its values
																				are EXCLUDED in total inventory dollar
																				count)
																			</i>
																		</small>
																	</th>
																	<th className='text-center'>
																		{
																			addInventoryQuatity(searchResults)
																		}
																	</th>
																	<th className='text-center'>
																		$
																		{commafy(
																			(
																				Math.round(
																					addInventoryValue(searchResults) * 100) / 100
																			).toFixed(2)
																		)}
																	</th>
																	<th className='text-center'>
																		{addSoldStockQuatity(searchResults)}
																	</th>
																	<th className='text-center'>
																		$
																		{commafy(
																			(
																				Math.round(
																					addSoldStockQuatity(searchResults) *
																					100
																				) / 100
																			).toFixed(2)
																		)}
																	</th>
																</tr>
															</React.Fragment>
														) : (
															<tr>
																<td colSpan={7} className='text-center'>
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
	searchProductSales,
};

export default connect(null, mapActionsToProps)(ProductSales);
