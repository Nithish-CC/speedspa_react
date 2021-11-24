import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { sorting, buildFilter } from "./../../utils/common";
import {getAllStaff} from "../../redux/actions/staffActions"
import {addSchedule} from "../../redux/actions/scheduleActions";
import _ from "lodash";
import PageHeader from "../core/PageHeader";
import { ColorCode } from "./../../utils/ColorCodeList";
import { StateList } from "./../../utils/StateList";
import { Formik } from "formik";
import * as yup from "yup";
import { Form, Col, Row, FormControl, FormGroup, FormLabel, Button } from "react-bootstrap";
import TimePicker from "react-time-picker-input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const StaffSchedule = (props: any) => {
	const [errors, setErrors] = useState({} as Error);
	const [title, setTitle] = useState("New Staff");
	const history = useHistory();
	const user = useSelector((state: any) => state.user);
	const [validationShape, setValidationShape] = useState({});
	const UI = useSelector((state: any) => state.UI);
	const staff = user.allStaff;
	const view = window.location.href.includes("view");
	const urlParams = useParams();
    const [todaysDate,setTodaysDate]=useState(new Date());
    const [startTime,setStartTime] = useState("10:00");
    const [endTime,setEndTime] = useState("10:00");
	const id = urlParams.id;
	const bussinessId = localStorage.getItem("businessId");
	const staffSchedule = {
		businessId: bussinessId,
		frequency: [],
		period: "",
		repeatingEndDate: "",
		repeatingEndTime: "",
		repeatingStartDate: "",
		repeatingStartTime: "",
		resourceId: "",
	};
	const [occuranceValues, setOccuranceValues] = useState({ montly: false, weekly: true, daily: false });
	const [monthlyDates, setMontlyDates] = useState<any[]>([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [repeat,setRepeat] = useState("weekly");
    const [frequency, setFrequency] = useState<any[]>([]);
	//useEffect

    console.log(moment(startDate).format("YYYY-MM-DD"))
    console.log(moment(endDate).format("YYYY-MM-DD"))
    console.log(startTime >= endTime)
    let verifyDateTime = (moment(startDate).format("YYYY-MM-DD") == moment(endDate).format("YYYY-MM-DD") ? startTime <= endTime : true)
    console.log(verifyDateTime)
	//intial call
	useEffect(() => {
		getAllStaff();
	}, []);

	const getAllStaff = () => {
		var requestRoles = ["admin", "stylist"];
		var data: any = {
			filter: {
				roles: {
					$in: requestRoles,
				},
			},
		};
		data.filter.status = {
			$in: ["active", "inactive"],
		};
		var query = buildFilter(data);
		query.text = "";
		query.businessId = localStorage.businessId;
		props.getAllStaff(query);
	};

	const handleSubmit = (values:any) => {
        if(verifyDateTime && values.resourceId!="" && frequency && frequency.length>0)
        {
        staffSchedule.resourceId=values.resourceId;
        staffSchedule.frequency=frequency.sort();
        staffSchedule.period=repeat;
        staffSchedule.repeatingEndDate=moment(endDate).format("YYYY-MM-DD");
        staffSchedule.repeatingStartDate=moment(startDate).format("YYYY-MM-DD");
        staffSchedule.repeatingEndTime=moment(endTime, "hh:mm").format('LT');
        staffSchedule.repeatingStartTime=moment(startTime, "hh:mm").format('LT');
        props.addSchedule(staffSchedule);
        }
        else
        {
            alert("check data")
        }
    };

	//To Find The Occurence
	const findOccurence = (e: any) => {
		console.log(e);
        setRepeat(e);
		if (e == "monthly") {
			monthDates();
            setFrequency([])
			setOccuranceValues({ montly: true, weekly: false, daily: false });
		} else if (e == "weekly") {
			console.log(e);
            setFrequency([])
			setOccuranceValues({ montly: false, weekly: true, daily: false });
		} else if (e == "daily") {
			console.log(e);
            setFrequency([])
			setOccuranceValues({ montly: false, weekly: false, daily: true });
		}
	};

	//Number of Dates 1 to 31
	const monthDates = () => {
		let tempArr: any[] = [];
		for (let i = 1; i <= 31; i++) {
			tempArr.push(i);
		}
		setMontlyDates(tempArr);
	};

	//weekly repeat
	const weeklyRepeat = (e: any) => {
		console.log(e);
		if (e.target.checked) {
			setFrequency([...frequency, Number(e.target.value)]);
		} else if (e.target.checked == false) {
			let indexVal = frequency.indexOf(Number(e.target.value));
			frequency.splice(indexVal, 1);
		}
	};
	console.log(frequency);

	//Monthly repeat
	const monthlyRepeat = (e: any) => {
		console.log(e);
		if (e.target.checked) {
			setFrequency([...frequency, Number(e.target.value)]);
		} else if (e.target.checked == false) {
			let indexVal = frequency.indexOf(Number(e.target.value));
			frequency.splice(indexVal, 1);
		}
	};
	console.log(frequency);

    //Daily Repeat
    const dailyRepeat = (e:any)=>{
        console.log(e);
        setFrequency([Number(e.target.value)])
    }
    
	return (
		<React.Fragment>
			{user.authenticated && !UI.loading ? (
				<React.Fragment>
					<PageHeader title={title} />
					<div className="row">
						<div className="col-lg-12">
							<div className="wrapper wrapper-content animated fadeInRight">
								<div className="ibox float-e-margins">
									<div className="ibox-content">
										<Formik
											initialValues={{ ...staffSchedule }}
											//validationSchema={basicFormSchema}
											onSubmit={handleSubmit}
											enableReinitialize={true}>
											{({
												values,
												errors,
												touched,
												handleChange,
												handleBlur,
												handleSubmit,
												isSubmitting,
											}) => {
												return (
													<Form
														name="Staff"
														className="form-horizontal"
														noValidate
														autoComplete="off"
														onSubmit={handleSubmit}>
														<React.Fragment>
															<div className="text-danger m-t-md m-b-md"></div>
															<FormGroup>
																<Col sm="12">
																	<FormLabel className="control-label">
																		Staff
																	</FormLabel>
																	<FormControl
																		as="select"
																		name="resourceId"
																		value={values.resourceId}
																		onChange={handleChange}
																		onBlur={handleBlur}>
																		<option value="">--Select Staff--</option>
																		<optgroup label="Staff">
																			{staff.map((staff: any) => {
																				return (
																					<React.Fragment>
																						{staff.roles.includes(
																							"stylist"
																						) && (
																							<option value={staff.id}>
																								{staff.firstName +
																									" " +
																									staff.lastName}
																							</option>
																						)}
																					</React.Fragment>
																				);
																			})}
																		</optgroup>
																		<optgroup label="Admin/Support">
																			{staff.map((staff: any) => {
																				return (
																					<React.Fragment>
																						{staff.roles.includes(
																							"admin",
																							"support"
																						) && (
																							<option value={staff.id}>
																								{staff.firstName +
																									" " +
																									staff.lastName}
																							</option>
																						)}
																					</React.Fragment>
																				);
																			})}
																		</optgroup>
																	</FormControl>
																</Col>
															</FormGroup>
                                                            
															<FormGroup>
																<Col sm="12">
																	<FormLabel className="control-label">
																		Occurence
																	</FormLabel>
																	<FormControl
																		as="select"
																		name="period"
                                                                        value={repeat}
																		onChange={(e) => findOccurence(e.target.value)}
																		onBlur={handleBlur}>
																		<option value="monthly">Monthly</option>
																		<option value="weekly" selected>Weekly</option>
																		<option value="daily">Daily</option>
																	</FormControl>
																</Col>
															</FormGroup>
															{occuranceValues.montly && (
																<FormGroup>
																	<Col sm="12">
																		<FormLabel className="control-label">
																			Repeats on:&emsp;
																		</FormLabel>
																		{monthlyDates &&
																			monthlyDates.length &&
																			monthlyDates.map((date: any) => {
																				return (
																					<React.Fragment>
																						<span>
																							<input
																								type="checkbox"
																								name="repeats"
																								value={date}
                                                                                                onClick={(e)=>{monthlyRepeat(e)}}
																							/>
																							&nbsp;
																							<strong>{date}</strong>
																						</span>
																						&emsp;
																					</React.Fragment>
																				);
																			})}
																	</Col>
																</FormGroup>
															)}
															{occuranceValues.weekly && (
																<FormGroup>
																	<Col sm="12">
																		<FormLabel className="control-label">
																			Repeats on:&emsp;
																		</FormLabel>
																		<span>
																			<input type="checkbox" name="repeats" value="1" onClick={(e)=>{weeklyRepeat(e)}}/>
																			&nbsp;<strong>Sun</strong>
																		</span>
																		&emsp;
																		<span>
																			<input type="checkbox" name="repeats" value="2" onClick={(e)=>{weeklyRepeat(e)}}/>
																			&nbsp;<strong>Mon</strong>
																		</span>
																		&emsp;
																		<span>
																			<input type="checkbox" name="repeats" value="3" onClick={(e)=>{weeklyRepeat(e)}}/>
																			&nbsp;<strong>Tue</strong>
																		</span>
																		&emsp;
																		<span>
																			<input type="checkbox" name="repeats" value="4" onClick={(e)=>{weeklyRepeat(e)}}/>
																			&nbsp;<strong>Wed</strong>
																		</span>
																		&emsp;
                                                                        <span>
																			<input type="checkbox" name="repeats" value="5" onClick={(e)=>{weeklyRepeat(e)}}/>
																			&nbsp;<strong>Thu</strong>
																		</span>
																		&emsp;
																		<span>
																			<input type="checkbox" name="repeats" value="6" onClick={(e)=>{weeklyRepeat(e)}}/>
																			&nbsp;<strong>Fri</strong>
																		</span>
																		&emsp;
																		<span>
																			<input type="checkbox" name="repeats" value="7" onClick={(e)=>{weeklyRepeat(e)}}/>
																			&nbsp;<strong>Sat</strong>
																		</span>
																		&emsp;
																	</Col>
																</FormGroup>
															)}
															{occuranceValues.daily && (
																<FormGroup>
																	<Col sm="12">
																		<FormLabel className="control-label">
																			Repeats every:&emsp;
																		</FormLabel>
																		<FormControl
																			as="select"
																			name="occurancedate"
																		    onChange={(e)=>{dailyRepeat(e)}}>
																			{monthlyDates &&
																				monthlyDates.length &&
																				monthlyDates.map((date: any) => {
																					return (
																						<option value={date}>
																							{date}
																						</option>
																					);
																				})}
																		</FormControl>
																	</Col>
																</FormGroup>
															)}
															<FormGroup>
																<Col sm="6">
																	<FormLabel className="control-label">
																		Start Date
																	</FormLabel>
																	
																	<DatePicker
																		selected={startDate}
																		showPopperArrow={false}
																		className="form-control"
																		style={{
																			width: "100%",
																			border: "1px solid white",
																		}}
                                                                        minDate={todaysDate}
																		onChange={(date: any) => setStartDate(date)}
																		dateFormat="EEE MMMM d, yyyy"
																	/>
																	
																</Col>
																<Col sm="6">
																	<FormLabel className="control-label">
																		End Date
																	</FormLabel>
																	
																	<DatePicker
																		selected={endDate}
																		showPopperArrow={false}
																		className="form-control"
																		style={{
																			width: "100%",
																			border: "1px solid white",
																		}}
                                                                        minDate={startDate}
																		onChange={(date: any) => setEndDate(date)}
																		dateFormat="EEE MMMM d, yyyy"
																	/>
																</Col>
															</FormGroup>
															<FormGroup>
																<div className="col-lg-2">
																	<label className="control-label">Start Time</label>
																	<div
																		hour-step="1"
																		minute-step="10"
																		show-meridian="ismeridian">
																		<TimePicker
																			eachInputDropdown
																			onChange={(newValue: any) =>
																				setStartTime(newValue)
																			}
																			value={startTime}
																		/>
																	</div>
																</div>
																<div className="col-lg-2">
																	<label className="control-label">End Time</label>
																	<div
																		hour-step="1"
																		minute-step="10"
																		show-meridian="ismeridian">
																		<TimePicker
																			eachInputDropdown
																			onChange={(newValue: any) =>
																				setEndTime(newValue)
																			}
																			value={endTime}
																		/>
																	</div>
																</div>
															</FormGroup>

															<div className="hr-line-dashed" />
															<Row>
																<Col md="8">
																	<FormGroup>
																		<Col sm="8">
																			<Button
																				variant="white"
																				type="button"
																				onClick={()=>{history.push('/staff-schedule')}}
																			>
																				Cancel
																			</Button>
																			&nbsp;
																			<Button variant="primary" type="submit">
																				Save Changes
																				{UI.buttonLoading && (
																					<i className="fa fa-spinner fa-spin"></i>
																				)}
																			</Button>
																		</Col>
																	</FormGroup>
																</Col>
															</Row>
														</React.Fragment>
													</Form>
												);
											}}
										</Formik>
									</div>
								</div>
							</div>
						</div>
					</div>
				</React.Fragment>
			) : (
				<React.Fragment></React.Fragment>
			)}
		</React.Fragment>
	);
};

const mapActionsToProps = {
    getAllStaff,addSchedule
};

export default connect(null, mapActionsToProps)(StaffSchedule);
