import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../core/PageHeader";
import { useHistory, useParams } from "react-router-dom";
import { buildFilter, commafy } from "../../../utils/common";
import { getAllStaff } from "../../../redux/actions/staffActions";
import { getAllClients } from "../../../redux/actions/clientActions";
import { Formik } from "formik";
import SelectSearch from "react-select-search";
import {
	getAllProducts,
	addProductOrder,
	getProductOrderView,
	updateProductOrder,
	addProductUpdateStaffOrder,
} from "../../../redux/actions/productAction";
import { getPaymentCC, makePaymentCC, refundPayment } from "../../../redux/actions/userActions";
import "../../../scss/selectsearch.css";
import moment from "moment";
import { Form, Col, Row, FormControl, FormGroup, FormLabel, Button } from "react-bootstrap";
import _ from "lodash"; 

const ProductOrder = (props: any) => {
	const [errors, setErrors] = useState({} as Error);
	const [title, setTitle] = useState("New Order");
	const UI = useSelector((state: any) => state.UI);
	const user = useSelector((state: any) => state.user);
	const product = useSelector((state: any) => state.product);
	const productDetails = product.productDetails;
	const ProductOrderView = product.ProductOrderView;
	const view = window.location.href.includes("view");
	const history = useHistory();
	const urlParams = useParams();
	const allStaff = user.allStaff;
	const allClient = user.allClients;
	const payWithCC = user.paywithCC.data;
	const id = urlParams.id;
	const bussinessId = localStorage.getItem("businessId");
	const userDetails = localStorage.getItem("userDetails");
	const [payWithCc, setPayWithCc] = useState(false);
	const [saveStaff, setSaveStaff] = useState(false);
	const [saveData, setSaveData] = useState(false);
	const [refundData, setRefundData] = useState(false);
	const [notesData, setNotesData] = useState("");
	const [addProductOrderData, setAddProductOrderData] = useState<any[]>([]);
	const [staffMsg, setStaffMsg] = useState("pass");
	const [customer, setCustomer] = useState<any[]>([]);
	const searchInput = useRef();
	const [options, setOptions] = useState<any[]>([]);
	const [products, setProducts] = useState<any[]>([]);
	const [buttonsave,setButtonSave] = useState("tosave");
	const [buttonCC,setButtonCC] = useState("tosave");
	const [buttonEmv,setButtonEmv] = useState("tosave");
	const [addProductData, setAddProductData] = useState<any[]>([]);
	const [addProductView, setAddProductView] = useState("add");
	const [changeStaff, setchangeStaff] = useState({ name: "", value: "" });
	const [currentProductPrice, setCurrentProductPrice] = useState(0);
	const [changeQuantity, setChangeQuantity] = useState(0);
	const [changePrice, setChangePrice] = useState(0);
	const orderValuesData = {
		businessId: "",
		clientId: "",
		createdBy: {},
		items: [],
		resourceId: "",
		shipping: { name: "chair" },
		status: "created",
		type: "products",
	};
	const [productOrder, setproductOrder] = useState({ ...orderValuesData });
	const [localUser, setLocalUser] = useState({
		name: "1",
		id: "1",
		email: "1",
		firstName: "1",
		lastName: "1",
	});
	
    // To set which user has ordered
	useEffect(() => setLocalUser(JSON.parse(localStorage.userDetails)), [userDetails]);

	useEffect(() => {
		if (view) {
			setTitle("Product Order");
			let params = {
				businessId: bussinessId,
			};
			props.getProductOrderView(id, params);
		}
		if (view == false) {
			setproductOrder(orderValuesData);
		}
	}, [view]);

	useEffect(() => {
		if (view == true) {
			setproductOrder(ProductOrderView);
		}
		if (ProductOrderView && ProductOrderView.items && ProductOrderView.items.length) {
			changeinallPrice(ProductOrderView);
		}
		if (view && ProductOrderView && ProductOrderView.items && ProductOrderView.items.length) {
			let params = {
				mxCustomerId: ProductOrderView.mxCustomerId,
				businessId: bussinessId,
			};
			let clientId = ProductOrderView.clientId;
			props.getPaymentCC(clientId, params);
		}
	}, [ProductOrderView]);

	useEffect(() => {
		if (view && ProductOrderView && ProductOrderView.items && ProductOrderView.items.length && allStaff.length) {
			const findStaff = (products: any) => {
				const newFirstFliterJob: any = allStaff.filter((data: any) => {
					return Object.values(data).join(" ").toLocaleLowerCase().includes(products);
				});
				let staffValue = {
					name: newFirstFliterJob[0].name,
					value: newFirstFliterJob[0].id,
				};
				setchangeStaff(staffValue);
			};
			findStaff(ProductOrderView.resourceId);
		}
	}, [ProductOrderView, allStaff]);

	useEffect(() => {
		getAllStaff();
		getAllClient();
		let businessId = {
			businessId: localStorage.businessId,
		};
		props.getAllProducts(businessId);
		if (UI.errors) {
			setErrors(UI.errors);
		}
	}, []);

	useEffect(() => {
		optionsData(allStaff);
	}, [allStaff]);

	useEffect(() => {
		optionsClientData(allClient);
	}, [allClient]);

	useEffect(() => {
		optionsProductData(productDetails);
	}, [productDetails]);
    
	useEffect(() => {
		setChangePrice(
			addProductOrderData && addProductOrderData.length && addProductOrderData[0].quantity >= changeQuantity
				? (Number(changeQuantity) * currentProductPrice.price) / 100
				: 0
		);
	}, [changeQuantity, addProductOrderData]);
	
	const getAllStaff = () => {
		var data: any = {
			filter: {
				roles: {
					$in: {
						0: "stylist",
					},
				},
			},
		};
		data.filter.status = {
			$in: ["active"],
		};
		var query = buildFilter(data);
		query.businessId = localStorage.businessId;
		props.getAllStaff(query);
	};

	const getAllClient = () => {
		var data: any = {
			filter: {
				roles: {
					$in: {
						0: "client",
					},
				},
				status: {
					$in: {
						0: "active",
						1: "inactive",
					},
				},
			},
		};
		var query = buildFilter(data);
		query.businessId = localStorage.businessId;
		props.getAllClients(query);
	};

	const changeinallPrice = (ProductOrderView: any) => {
		let tempArr: any[] = [];
		ProductOrderView.items.forEach((element: any) => {
			let mul = element.amount * element.quantity;
			element.amount = mul;
			tempArr.push(element);
		});
		setAddProductData(tempArr);
	};

	const optionsData = (allStaff: any) => {
		let tempArr: any[] = [];
		allStaff.forEach((element: any) => {
			tempArr.push({
				name: element.name,
				value: element.id,
			});
		});
		setOptions(tempArr);
	};

	const handleStaffFilter = (items: any) => {
		return (searchValue: any) => {
			if (searchValue.length === 0) {
				return options;
			}

			const newItems = items.filter((item: any) => {
				return item.name.toLowerCase().includes(searchValue.toLowerCase());
			});
			return newItems;
		};
	};

	const optionsClientData = (allClient: any) => {
		let tempArr: any[] = [];
		allClient.forEach((element: any) => {
			tempArr.push({
				name: element.name,
				value: element.id,
			});
		});
		setCustomer(tempArr);
	};

	const handleCustomerFilter = (items: any) => {
		return (searchValue: any) => {
			if (searchValue.length === 0) {
				return customer;
			}
			const newItems = items.filter((item: any) => {
				return item.name.toLowerCase().includes(searchValue.toLowerCase());
			});
			return newItems;
		};
	};

	//Get the use entered product data
	const optionsProductData = (productDetails: any) => {
		let tempArr: any[] = [];
		if (productDetails && productDetails.data && productDetails.data.length) {
			productDetails.data.forEach((element: any) => {
				tempArr.push({
					name: element.name,
					value: element.id,
				});
			});
		}
		setProducts(tempArr);
	};

	const handleProductFilter = (items: any) => {
		return (searchValue: any) => {
			if (searchValue.length === 0) {
				return products;
			}
			const newItems = items.filter((item: any) => {
				return item.name.toLowerCase().includes(searchValue.toLowerCase());
			});
			return newItems;
		};
	};

	//Adds all product data
	const addProductOrder = (products: any) => {
		const newFirstFliterJob: any = productDetails.data.filter((data: any) => {
			return Object.values(data).join(" ").toLocaleLowerCase().includes(products);
		});
		setCurrentProductPrice(newFirstFliterJob[0]);
		setAddProductOrderData(newFirstFliterJob);
	};

	//Gets current choosen product name
	const [changeProductName, setchangeProductName] = useState({
		name: "",
		value: 0,
	});

	const handleChangeFilter = (...args: any) => {
		addProductOrder(args[1].value);
		setchangeProductName(args[1]);
	};

	const [changeCustomer, setchangeCustomer] = useState({ name: "", value: 0 });
	const handleChangeCustomer = (...args: any) => {
		setchangeCustomer(args[1]);
	};

	const handleChangeStaff = (...args: any) => {
		setchangeStaff(args[1]);
	};

	const handleChangeQuantity = (e: any, quantity: any) => {
		if (quantity >= e.target.value && e.target.value > 0) {
			setChangeQuantity(e.target.value);
		}
	};

	//Updates products to table
	const deleteUpdate = (newProductData: any) => {
		let tempArr: any[] = [];
		newProductData.forEach((element: any) => {
			tempArr.push(element);
		});
		setAddProductData(tempArr);
	};

    // Delete product from table
	const filterProductOrder = (index: any) => {
		var newProductData = addProductData;
		newProductData.splice(index, 1);
		deleteUpdate(newProductData);
	};

	// Check for product exsist or not in table
	const handleAddProduct = () => {
		if (addProductData.some((e) => e.parent == changeProductName.value)) {
			alert("Already product exists to this list");
		} else if (changeQuantity === 0 || changeProductName.name === "") {
		} else {
			const tempObj = { quantity: 0, amount: 0, description: "", parent: 0 };
			tempObj.quantity = Number(changeQuantity);
			tempObj.amount = Number(changePrice) * 100;
			tempObj.description = changeProductName.name;
			tempObj.parent = changeProductName.value;
			setAddProductData((addProductData) => [...addProductData, tempObj]);
		}
	};

	const price = (searchResults: any) => {
		let sumOfAddition = 0;
		searchResults.forEach((element: any) => {
			sumOfAddition += element.amount / 100;
		});
		return sumOfAddition;
	};
	const tax = (searchResults: any) => {
		let sumOfAddition = 0;
		sumOfAddition = (9 * searchResults) / 100;
		let tax = sumOfAddition.toFixed(2);
		return tax;
	};
	const total = (price: any, tax: any) => {
		let sumOfAddition = 0;
		sumOfAddition = Number(price) + Number(tax);
		let totalAmount = sumOfAddition.toFixed(2);
		return totalAmount;
	};

	const handleSubmit = (values: any) => {
		let currentDate = new Date().toISOString();
        // update order data 
		if (view && saveData == true) {
			values.businessId = bussinessId;
			values.createdBy = {
				name: localUser.firstName + " " + localUser.lastName,
				id: localUser.id,
				email: localUser.email,
				firstName: localUser.firstName,
				lastName: localUser.lastName,
			};
			values.resourceId = changeStaff.value;
			values.items = addProductData;
			values.shipping = { name: "chair" };
			values.status = "created";
			values.type = "products";
			props.updateProductOrder(id, values, (success: any, id: any) => {
				if (success) {
					let params = {
						businessId: bussinessId,
					};
					props.getProductOrderView(id, params);
				}
			});
		} 
		//make payment
		else if (view && payWithCc && payWithCC[0].token) {
			productOrder.updatedAt = currentDate;
			productOrder.timeStart = currentDate;
			let params = {
				businessId: bussinessId,
				isManualPay: false,
				order: productOrder,
				paidFrom: "web",
				paidBy: {
					name: localUser.firstName + " " + localUser.lastName,
					id: localUser.id,
					email: localUser.email,
					at: currentDate,
				},
				tax: productOrder.tax,
				tip: productOrder.tip,
				total: productOrder.total,
				token: payWithCC[0].token,
			};
			props.makePaymentCC(params, (success: any, id: any) => {
				if (success) {
					let params = {
						businessId: bussinessId,
					};
					props.getProductOrderView(id, params);
				}
			});
		} else if (view && saveStaff) {
			let params = {
				businessId: bussinessId,
				id: id,
				isUpdate: true,
				resourceId: changeStaff.value,
				status: productOrder.status,
				type: productOrder.type,
			};
			props.addProductUpdateStaffOrder(params, (success: any, id: any) => {
				if (success) {
					let params = {
						businessId: bussinessId,
					};
					props.getProductOrderView(id, params);
				}
			});
		} 
		// Refund Amount
		else if (view && refundData) {
			let params = {
				businessId: bussinessId,
				mxPayment: productOrder.mxPayment,
				order: productOrder,
				voidBy: {
					name: localUser.firstName + " " + localUser.lastName,
					id: localUser.id,
					email: localUser.email,
					at: currentDate,
				},
				voidFrom: "web",
				voidNotes: notesData,
			};
			params.order.voidNotes = notesData;
			history.push("/products/orders");
			props.refundPayment(params, history);
		} 
		// Add order
		else if (view == false) {
			if (changeStaff.value != "" && changeCustomer.value != 0 && addProductData && addProductData.length > 0) {
				values.businessId = bussinessId;
				values.createdBy = {
					name: localUser.firstName + " " + localUser.lastName,
					id: localUser.id,
					email: localUser.email,
					firstName: localUser.firstName,
					lastName: localUser.lastName,
				};
				values.clientId = changeCustomer.value;
				values.resourceId = changeStaff.value;
				values.items = addProductData;
				values.shipping = { name: "chair" };
				values.status = "created";
				values.type = "products";
				props.addProductOrder(values, (success: any, id: any) => {
					if (success) {
						const Id = id;
						history.push(`/products/orders/view/${Id}`);
					}
				});
			} else {
				setStaffMsg("error");
			}
		}
	};

	const handleCancel = (e: any) => {
		props.history.push("/products/orders");
	};

	//Table Quantity Change
	const handleTableQuantity = (e: any, index: any, parentId: any) => {
		addProductOrder(parentId);
		const productData = [...addProductData];
		if (
			addProductOrderData &&
			addProductOrderData.length &&
			addProductOrderData[0].quantity >= e.target.value &&
			e.target.value > 0
		) {
			productData[index].quantity = Number(e.target.value);
			productData[index].amount = Number(productData[index].quantity) * addProductOrderData[0].price;
			setAddProductData(productData);
		}
	};

	return (
		<React.Fragment>
			{user.authenticated && !UI.loading && (
				<React.Fragment>
					<PageHeader title={title} />
					<Formik
						initialValues={{ ...productOrder }}
						//validationSchema={basicFormSchema}
						onSubmit={handleSubmit}
						enableReinitialize={true}>
						{({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => {
							return (
								<React.Fragment>
									{view &&
										ProductOrderView &&
										ProductOrderView.items &&
										ProductOrderView.items.length &&
										ProductOrderView.status == "paid" && (
											<Form
												name="productCategory"
												className="form-horizontal"
												noValidate
												autoComplete="off"
												onSubmit={handleSubmit}>
												<div className="row">
													<div className="col-lg-12">
														<div
															className="wrapper wrapper-content animated fadeInRight"
															style={{ paddingBottom: "0px" }}>
															<div className="ibox float-e-margins">
																<div className="ibox-content">
																	<h3>Refund Details</h3>
																	<div className="hr-line-dashed"></div>
																	<div className="row">
																		<div className="col-md-6">
																			{view && (
																				<React.Fragment>
																					<FormGroup>
																						<FormLabel className="col-sm-3 control-label">
																							Customer
																						</FormLabel>
																						<Col sm="9">
																							<input
																								type="text"
																								className="form-control"
																								name="price"
																								value={
																									ProductOrderView &&
																									productOrder.clientName
																								}
																								disabled
																							/>
																						</Col>
																					</FormGroup>
																					<FormGroup>
																						<FormLabel className="col-sm-3 control-label">
																							Amount
																						</FormLabel>
																						<Col sm="9">
																							<input
																								type="text"
																								className="form-control"
																								name="amount"
																								value={
																									ProductOrderView &&
																									productOrder.total /
																										100
																								}
																								disabled
																							/>
																						</Col>
																					</FormGroup>
																					<FormGroup>
																						<FormLabel className="col-sm-3 control-label">
																							Notes
																						</FormLabel>
																						<Col sm="9">
																							<FormControl
																								as="textarea"
																								name="notes"
																								onChange={(e: any) =>
																									setNotesData(
																										e.target.value
																									)
																								}
																								value={notesData}
																							/>
																						</Col>
																					</FormGroup>
																				</React.Fragment>
																			)}
																		</div>
																	</div>
																	<div className="hr-line-dashed" />
																	<Row>
																		<Col md="8">
																			<FormGroup>
																				<Col sm="8">
																					<Button
																						variant="primary"
																						type="submit"
																						onClick={(e) =>
																							setRefundData(true)
																						}>
																						Refund Payment
																						{UI.buttonLoading && (
																							<i className="fa fa-spinner fa-spin"></i>
																						)}
																					</Button>
																				</Col>
																			</FormGroup>
																		</Col>
																	</Row>
																</div>
															</div>
														</div>
													</div>
												</div>
											</Form>
										)}
									{view && payWithCc && (
										<Form
											name="productCategory"
											className="form-horizontal"
											noValidate
											autoComplete="off"
											onSubmit={handleSubmit}>
											<div className="row">
												<div className="col-lg-12">
													<div
														className="wrapper wrapper-content animated fadeInRight"
														style={{ paddingBottom: "0px" }}>
														<div className="ibox float-e-margins">
															<div className="ibox-content">
																<h3>Pay with Credit Card</h3>
																<div className="hr-line-dashed"></div>
																<div className="row">
																	<div className="col-md-6">
																		{view && (
																			<React.Fragment>
																				<FormGroup>
																					<FormLabel className="col-sm-3 control-label">
																						Customer
																					</FormLabel>
																					<Col sm="9">
																						<input
																							type="text"
																							className="form-control"
																							name="price"
																							value={
																								ProductOrderView &&
																								productOrder.clientName
																							}
																							disabled
																						/>
																					</Col>
																				</FormGroup>
																				<FormGroup>
																					<FormLabel className="col-sm-3 control-label">
																						Primary Card
																					</FormLabel>
																					<Col sm="9">
																						<input
																							type="text"
																							className="form-control"
																							name="shipping"
																							value={`${
																								payWithCC &&
																								payWithCC.length &&
																								payWithCC[0].cardType
																							} - XXXX ${
																								payWithCC &&
																								payWithCC.length &&
																								payWithCC[0].last4
																							}`}
																							disabled
																						/>
																					</Col>
																				</FormGroup>

																				<FormGroup>
																					<FormLabel className="col-sm-3 control-label">
																						Amount
																					</FormLabel>
																					<Col sm="9">
																						<input
																							type="text"
																							className="form-control"
																							name="shipping"
																							value={price(
																								addProductData
																							)}
																							disabled
																						/>
																					</Col>
																				</FormGroup>
																				<FormGroup>
																					<FormLabel className="col-sm-3 control-label">
																						Tax
																					</FormLabel>
																					<Col sm="9">
																						<input
																							type="text"
																							className="form-control"
																							name="shipping"
																							value={tax(
																								price(addProductData)
																							)}
																							disabled
																						/>
																					</Col>
																				</FormGroup>
																				<FormGroup>
																					<FormLabel className="col-sm-3 control-label">
																						Total Amount
																					</FormLabel>
																					<Col sm="9">
																						<input
																							type="text"
																							className="form-control"
																							name="shipping"
																							style={{
																								fontWeight: "bold",
																							}}
																							value={total(
																								price(addProductData),
																								tax(
																									price(
																										addProductData
																									)
																								)
																							)}
																							disabled
																						/>
																					</Col>
																				</FormGroup>
																			</React.Fragment>
																		)}
																	</div>
																</div>
																<div className="hr-line-dashed" />
																<Row>
																	<Col md="8">
																		<FormGroup>
																			<Col sm="8">
																				<Button
																					variant="white"
																					type="button"
																					onClick={(e) => handleCancel(e)}>
																					Cancel
																				</Button>
																				&nbsp;
																				<Button
																					variant="primary"
																					type="submit"
																					onClick={(e) => {
																						setSaveData(false);
																						setPayWithCc(true);
																					}}>
																					Make Payment
																					{UI.buttonLoading && (
																						<i className="fa fa-spinner fa-spin"></i>
																					)}
																				</Button>
																			</Col>
																		</FormGroup>
																	</Col>
																</Row>
															</div>
														</div>
													</div>
												</div>
											</div>
										</Form>
									)}

									<Form
										name="productCategory"
										className="form-horizontal"
										noValidate
										autoComplete="off"
										onSubmit={handleSubmit}>
										<div className="row">
											<div className="col-lg-12">
												<div className="wrapper wrapper-content animated fadeInRight">
													<div className="ibox float-e-margins">
														<div className="ibox-content">
															<h3>
																Order Details
																{view && (
																	<div
																		style={{ float: "right" }}
																		className="btn btn-xs btn-primary text-capitalize text-right ng-binding ng-scope btn-success">
																		{view &&
																			ProductOrderView &&
																			ProductOrderView.items &&
																			ProductOrderView.items.length &&
																			ProductOrderView.status}
																	</div>
																)}
															</h3>
															<div className="hr-line-dashed"></div>
															<div className="row">
																<div className="col-md-6">
																	<FormGroup>
																		<FormLabel className="col-sm-3 control-label">
																			staff
																		</FormLabel>
																		<Col sm="9">
																			<SelectSearch
																				ref={searchInput}
																				options={options}
																				filterOptions={handleStaffFilter}
																				value={changeStaff}
																				name="staff"
																				placeholder="Staff"
																				search
																				onChange={handleChangeStaff}
																			/>
																		</Col>
																	</FormGroup>
																	{!view && (
																		<FormGroup>
																			<FormLabel className="col-sm-3 control-label">
																				Customer
																			</FormLabel>
																			<Col sm="9">
																				<SelectSearch
																					ref={searchInput}
																					options={customer}
																					filterOptions={handleCustomerFilter}
																					value=""
																					name="Customer"
																					placeholder="Customer"
																					search
																					onChange={handleChangeCustomer}
																				/>
																			</Col>
																		</FormGroup>
																	)}
																	{view && (
																		<React.Fragment>
																			<FormGroup>
																				<FormLabel className="col-sm-3 control-label">
																					Customer
																				</FormLabel>
																				<Col sm="9">
																					<input
																						type="text"
																						className="form-control"
																						name="price"
																						value={
																							ProductOrderView &&
																							productOrder.clientName
																						}
																						disabled
																					/>
																				</Col>
																			</FormGroup>
																			<FormGroup>
																				<FormLabel className="col-sm-3 control-label">
																					Delivery Method
																				</FormLabel>
																				<Col sm="9">
																					<input
																						type="text"
																						className="form-control"
																						name="shipping"
																						value={
																							ProductOrderView &&
																							ProductOrderView.shipping &&
																							ProductOrderView.shipping
																								.name
																						}
																						disabled
																					/>
																				</Col>
																			</FormGroup>
																			<FormGroup>
																				<FormLabel className="col-sm-3 control-label">
																					Date & Time
																				</FormLabel>
																				<Col sm="9">
																					<input
																						type="text"
																						className="form-control"
																						name="datetime"
																						value={
																							ProductOrderView &&
																							moment(
																								productOrder.createdAt
																							).format("LL LT")
																						}
																						disabled
																					/>
																				</Col>
																			</FormGroup>
																		</React.Fragment>
																	)}
																</div>
																<div className="col-md-6">
																	<div className="table-responsive">
																		<table className="table table-bordered table-striped table-hover dataTables-example">
																			<thead>
																				<tr>
																					<th>Product</th>
																					<th>Quantity</th>
																					<th>Price</th>
																					<th>Action</th>
																				</tr>
																			</thead>
																			<tbody>
																				{addProductData &&
																				addProductData.length ? (
																					addProductData.map(
																						(
																							productvalues: any,
																							index: any
																						) => {
																							return (
																								<tr className="gradeX">
																									<td>
																										<Link
																											to={`/products/view/${productvalues.parent}`}>
																											{
																												productvalues.description
																											}
																										</Link>
																									</td>
																									{view &&
																										ProductOrderView &&
																										ProductOrderView.items &&
																										ProductOrderView
																											.items
																											.length &&
																										ProductOrderView.status !=
																											"created" && (
																											<td className="text-center">
																												{
																													<input
																														type="number"
																														className="form-control"
																														value={
																															productvalues.quantity
																														}
																														required
																														disabled
																													/>
																												}
																											</td>
																										)}
																									{view == false && (
																										<td className="text-center">
																											{
																												<input
																													type="number"
																													className="form-control"
																													value={
																														productvalues.quantity
																													}
																													required
																													name="quantity"
																													onChange={(
																														e
																													) => {
																														handleTableQuantity(
																															e,
																															index,
																															productvalues.parent
																														);
																													}}
																												/>
																											}
																										</td>
																									)}
																									{view &&
																										ProductOrderView &&
																										ProductOrderView.items &&
																										ProductOrderView
																											.items
																											.length &&
																										ProductOrderView.status ==
																											"created" && (
																											<td className="text-center">
																												{
																													<input
																														type="number"
																														className="form-control"
																														value={
																															productvalues.quantity
																														}
																														required
																														name="quantity"
																														onChange={(
																															e
																														) => {
																															handleTableQuantity(
																																e,
																																index,
																																productvalues.parent
																															);
																														}}
																													/>
																												}
																											</td>
																										)}
																									<td className="text-center">
																										{
																											<input
																												type="number"
																												className="form-control"
																												value={
																													productvalues.amount /
																													100
																												}
																												disabled
																												required
																											/>
																										}
																									</td>
																									<td className="text-center">
																										{view &&
																											ProductOrderView &&
																											ProductOrderView.items &&
																											ProductOrderView
																												.items
																												.length &&
																											ProductOrderView.status !=
																												"paid" &&
																											ProductOrderView.status !=
																												"fulfilled" &&
																											ProductOrderView.status !=
																												"returned" &&
																											ProductOrderView.status !=
																												"canceled" &&
																											ProductOrderView.status !=
																												"voided" && (
																												<i
																													className="fa fa-trash"
																													style={{
																														cursor: "pointer",
																													}}
																													onClick={(
																														e
																													) =>
																														filterProductOrder(
																															index
																														)
																													}
																												/>
																											)}
																										{view ==
																											false && (
																											<i
																												className="fa fa-trash"
																												style={{
																													cursor: "pointer",
																												}}
																												onClick={() =>
																													filterProductOrder(
																														index
																													)
																												}
																											/>
																										)}
																									</td>
																								</tr>
																							);
																						}
																					)
																				) : (
																					<React.Fragment></React.Fragment>
																				)}
																				<tr className="gradeX">
																					<td>Sub Total</td>
																					<td className="text-center"></td>
																					<td className="text-center">
																						$
																						{commafy(
																							(
																								Math.round(
																									Number(
																										price(
																											addProductData
																										)
																									) * 100
																								) / 100
																							).toFixed(2)
																						)}
																					</td>
																					<td className="text-right"></td>
																				</tr>
																				<tr className="gradeX">
																					<td>Tax (9%)</td>
																					<td className="text-center"></td>
																					<td className="text-center">
																						$
																						{commafy(
																							(
																								Math.round(
																									Number(
																										tax(
																											price(
																												addProductData
																											)
																										)
																									) * 100
																								) / 100
																							).toFixed(2)
																						)}
																					</td>
																					<td className="text-right"></td>
																				</tr>
																				<tr className="gradeX">
																					<td>
																						<strong>Total</strong>
																					</td>
																					<td className="text-center"></td>
																					<td className="text-center">
																						<strong>
																							$
																							{commafy(
																								(
																									Math.round(
																										Number(
																											total(
																												price(
																													addProductData
																												),
																												tax(
																													price(
																														addProductData
																													)
																												)
																											)
																										) * 100
																									) / 100
																								).toFixed(2)
																							)}
																						</strong>
																					</td>
																					<td className="text-right"></td>
																				</tr>
																			</tbody>
																		</table>
																	</div>
																	<FormGroup>
																		{addProductView == "add" &&
																		view &&
																		ProductOrderView &&
																		ProductOrderView.items &&
																		ProductOrderView.items.length &&
																		ProductOrderView.status == "created" ? (
																			<Col sm={12} className="text-right">
																				<button
																					className="btn btn-white"
																					type="button"
																					onClick={(e) =>
																						setAddProductView("order")
																					}>
																					Add Product
																				</button>
																			</Col>
																		) : (
																			view == false &&
																			addProductView == "add" && (
																				<Col sm={12} className="text-right">
																					<button
																						className="btn btn-white"
																						type="button"
																						onClick={(e) =>
																							setAddProductView("order")
																						}>
																						Add Product
																					</button>
																				</Col>
																			)
																		)}
																		{addProductView == "order" && (
																			<React.Fragment>
																				<Col sm={12} className="text-left">
																					<FormGroup>
																						<Col sm="6">
																							<FormLabel className="control-label">
																								Product
																							</FormLabel>
																							<SelectSearch
																								ref={searchInput}
																								options={products}
																								filterOptions={
																									handleProductFilter
																								}
																								value=""
																								name="Product"
																								placeholder="Product"
																								search
																								onChange={
																									handleChangeFilter
																								}
																								style={{
																									width: "50px",
																								}}
																							/>
																						</Col>
																						<Col sm="3">
																							<FormLabel className="control-label">
																								Quantity
																							</FormLabel>
																							<input
																								type="number"
																								className="form-control"
																								required
																								name="quantity"
																								value={changeQuantity}
																								onChange={(e) => {
																									handleChangeQuantity(
																										e,
																										addProductOrderData[0]
																											.quantity
																									);
																								}}
																							/>
																						</Col>
																						<Col sm="3">
																							<FormLabel className="control-label">
																								Price
																							</FormLabel>
																							<input
																								type="number"
																								className="form-control"
																								name="price"
																								value={changePrice}
																								disabled
																								required
																							/>
																						</Col>
																					</FormGroup>
																				</Col>
																				<Col sm={12}>
																					<FormGroup>
																						<Col
																							sm={12}
																							className="text-right">
																							<button
																								className="btn btn-white"
																								type="button"
																								onClick={(e) => {
																									handleAddProduct();
																									setAddProductView(
																										"add"
																									);
																									setChangeQuantity(
																										0
																									);
																									setChangePrice(0);
																									setAddProductOrderData(
																										[]
																									);
																								}}>
																								Add to order
																							</button>
																							&nbsp;
																							<button
																								className="btn btn-white"
																								type="button"
																								onClick={(e) => {
																									setAddProductView(
																										"add"
																									);
																									setChangeQuantity(
																										0
																									);
																									setChangePrice(0);
																									optionsProductData(
																										productDetails
																									);
																									setAddProductOrderData(
																										[]
																									);
																								}}>
																								Cancel
																							</button>
																						</Col>
																					</FormGroup>
																				</Col>
																			</React.Fragment>
																		)}
																	</FormGroup>
																</div>
															</div>
															<div className="hr-line-dashed" />
															<Row>
																<Col md="8">
																	<FormGroup>
																		<Col sm="8">
																			<Button
																				variant="white"
																				type="button"
																				onClick={(e) => handleCancel(e)}>
																				Cancel
																			</Button>
																			&nbsp;
																			{view == false && (
																				<Button
																					variant="primary"
																					type="submit"
																					onClick={(e) => setSaveData(true)}>
																					Save Changes
																					{UI.buttonLoading && (
																						<i className="fa fa-spinner fa-spin"></i>
																					)}
																				</Button>
																			)}
																			{view &&
																				ProductOrderView &&
																				ProductOrderView.items &&
																				ProductOrderView.items.length &&
																				ProductOrderView.status == "paid" && (
																					<Button
																						variant="primary"
																						type="submit"
																						onClick={(e) =>
																							setSaveStaff(true)
																						}>
																						Save Staff
																						{UI.buttonLoading && (
																							<i className="fa fa-spinner fa-spin"></i>
																						)}
																					</Button>
																				)}
																			<React.Fragment>
																				{view == false ||
																					(view &&
																						ProductOrderView &&
																						ProductOrderView.items &&
																						ProductOrderView.items.length &&
																						ProductOrderView.status ==
																							"created" && (
																							<Button
																								variant="primary"
																								type="submit"
																								onClick={(e) =>{
																									setSaveData(true)
																									setButtonSave("save")}
																								}>
																								Save Changes
																								{UI.buttonLoading && buttonsave == "save" && (
																									<i className="fa fa-spinner fa-spin"></i>
																								)}
																							</Button>
																						))}
																				&nbsp;
																				{view == false ||
																					(((view &&
																						ProductOrderView &&
																						ProductOrderView.items &&
																						ProductOrderView.items.length &&
																						ProductOrderView.status ==
																							"created") ||
																						ProductOrderView.status ==
																							"voided") && (
																						<React.Fragment>
																							<Button
																								variant="success"
																								type="button"
																								onClick={(e) => {
																									setPayWithCc(true);
																									setButtonCC("save")
																								}}>
																								Pay with CC
																								{UI.buttonLoading && buttonCC =="save" && (
																									<i className="fa fa-spinner fa-spin"></i>
																								)}
																							</Button>
																							&nbsp;
																							<Button
																								variant="danger"
																								type="submit">
																								Pay with EMW
																								{UI.buttonLoading && buttonEmv=="save" && (
																									<i className="fa fa-spinner fa-spin"></i>
																								)}
																							</Button>
																						</React.Fragment>
																					))}
																			</React.Fragment>
																		</Col>
																	</FormGroup>
																</Col>
															</Row>
														</div>
													</div>
												</div>
											</div>
										</div>
									</Form>
								</React.Fragment>
							);
						}}
					</Formik>
				</React.Fragment>
			)}
		</React.Fragment>
	);
};

const mapActionsToProps = {
	getAllStaff,
	getAllProducts,
	addProductOrder,
	getProductOrderView,
	getPaymentCC,
	makePaymentCC,
	updateProductOrder,
	addProductUpdateStaffOrder,
	refundPayment,
	getAllClients,
};

export default connect(null, mapActionsToProps)(ProductOrder);
