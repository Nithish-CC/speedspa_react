
import React, { useEffect, useState, useRef } from "react";
import { connect, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import listPlugin from "@fullcalendar/list";
import { getUserBusinessDetails } from "../../redux/actions/businessActions";
import { timeSlots, schedule } from "../../redux/actions/scheduleActions";
import { getAllStaff } from "../../redux/actions/staffActions";
import { getAllCategory, getAllService } from "../../redux/actions/serviceActions";
import { buildFilter } from "../../utils/common";
import moment from "moment";
import Tooltips from "../core/Tooltips";
import PageHeader from "../core/PageHeader";
import _ from "lodash";
import { Modal,Button } from "react-bootstrap";

const Schedule = (props: any) => {
	const [errors, setErrors] = useState({} as Error);
	const [loading, setLoading] = useState(false);
	const UI = useSelector((state: any) => state.UI);
	const [title] = useState("Schedule");
	const businessId = localStorage.getItem("businessId");
	const resourceId = localStorage.getItem("userId");
	const hostName = localStorage.getItem("businessUrl");
	let history = useHistory();
	const user = useSelector((state: any) => state.user);
	const allCategories = useSelector((state: any) => state.service.categoryDetails);
	const schedule = useSelector((state: any) => state.schedule);
	const scheduleData = schedule.schedules;
	const totalSlots = schedule.totalSlots;
	const allStaff = user.allStaff;
	const [calenderData, setCalenderData] = useState({ title: "", startTime: "", endTime: "",show:false });
	const [initialTooltip] = useState({ ...calenderData })
	const [resourseDataVal, setResourseDataVal] = useState<any[]>([]);
	const [params, setParams] = useState({
		text: "",
		status: "",
		role: "all",
	});
	const [buttons] = useState([
		{
			title: "Add Appointment",
			url: "schedule/add-appointment",
		},
	]);
	//To fetch date on load
	let dates = {
		loaded: {
			start: new Date(moment().startOf("month").subtract(1, "milliseconds")),
			end: new Date(moment().endOf("month").add(1, "milliseconds")),
		},
		toload: {
			start: new Date(moment().startOf("month").subtract(1, "milliseconds")),
			end: new Date(moment().endOf("month").add(1, "milliseconds")),
		},
	};

	useEffect(() => {
		let paramsPass = {
			businessId: businessId,
		};
		getAllStaff(params);
		if (UI.errors) {
			setErrors(UI.errors);
		}
		eventsLoad();
		businessDetails();
		schedules();
		props.getAllService(paramsPass);
		props.getAllCategory(paramsPass);
	}, []);

	const schedules = () => {
		let start = "2021-10-30T23:59:59.999Z";
		let end = "2021-12-01T00:00:00.000Z";
		var data: any = {
			timeStart: {
				$lte: end,
				$gt: start,
			},
		};
		var query = buildFilter(data);
		query.businessId = localStorage.businessId;
		props.timeSlots(query);
		props.schedule(query);
	};

	const businessDetails = () => {
		let params = {
			name: hostName,
			businessId: businessId,
		};
		props.getUserBusinessDetails(params);
	};

	const getAllStaff = (params: any) => {
		var requestRoles = ["admin", "stylist"];
		if (params.role !== "all") {
			requestRoles = [params.role];
		}
		var data: any = {
			filter: {
				roles: {
					$in: requestRoles,
				},
			},
		};
		if (params.status) {
			data.filter.status = {
				$in: [params.status],
			};
		} else {
			data.filter.status = {
				$in: ["active", "inactive"],
			};
		}
		var query = buildFilter(data);
		query.businessId = localStorage.businessId;
		props.getAllStaff(query);
	};

	useEffect(() => {
		allStaffDetail();
	}, [allStaff]);

	const allStaffDetail = () => {
		if (allStaff && allStaff.length) {
			allStaff.forEach((value: any, index: any) => {
				getRole(value, index);
			});
		}
	};

	const getRole = (value: any, index: any) => {
		var roleName = [];
		if (value.roles) {
			if (
				_.findIndex(value.roles, function (role) {
					return role == "admin";
				}) + 1
			) {
				roleName.push("admin");
				value.building = "admin";
				value.title = value.name;
				value.eventColor = value.color;
			}
			if (
				_.findIndex(value.roles, function (role) {
					return role == "stylist";
				}) + 1
			) {
				if (value.profileCategoryId) {
					if (_.isArray(value.profileCategoryId) && value.profileCategoryId.length) {
						_.each(value.profileCategoryId, function (profCatId) {
							var cate = _.find(allCategories, {
								id: profCatId,
							});
							if (cate)
								cate.description
									? roleName.push(cate.description)
									: roleName.push(cate.name + " Stylist");
							value.building = "Stylist";
							value.title = value.name;
							value.eventColor = value.color;
						});
					} else {
						var cat = _.find(allCategories, {
							id: value.profileCategoryId,
						});
						if (cat.id)
							cat.description ? roleName.push(cat.description) : roleName.push(cat.name + " Stylist");
						value.building = "Stylist";
						value.title = value.name;
						value.eventColor = value.color;
					}
				}
			}
		}
		let uniques = Array.from(new Set(roleName));
		if (uniques.length) {
			value.uniques = uniques.join(", ");
		} else {
			value.uniques = "No Roles";
		}

		setResourseDataVal((resourseDataVal: any) => [...resourseDataVal, value]);
	};

	const eventsLoad = () => {
		var intervalEnd = new Date();
		intervalEnd.setTime(intervalEnd.getTime() + intervalEnd.getTimezoneOffset() * 60 * 1000);
		intervalEnd = new Date(moment(intervalEnd).startOf("day").subtract(1, "milliseconds"));
		console.log(intervalEnd);
		var intervalStart = new Date();
		intervalStart.setTime(intervalStart.getTime() + intervalStart.getTimezoneOffset() * 60 * 1000);

		if (dates.loaded.end >= intervalStart) {
			dates.toload.start = new Date(moment(intervalEnd).startOf("month").subtract(1, "milliseconds"));
			dates.toload.end = new Date(moment(intervalEnd).endOf("month").add(1, "milliseconds"));
			dates.loaded.end = new Date(moment(intervalEnd).endOf("month").add(1, "milliseconds"));
			//timeSlots(dates.toload.start, dates.toload.end);
		}
		if (intervalStart <= dates.loaded.start) {
			console.log("-----");
			dates.toload.start = new Date(moment(dates.loaded.start).startOf("month").subtract(1, "milliseconds"));
			dates.toload.end = new Date(moment(dates.loaded.start).endOf("month").add(1, "milliseconds"));
			dates.loaded.start = new Date(moment(dates.loaded.start).startOf("month").subtract(1, "milliseconds"));
			//timeSlots(dates.toload.start, dates.toload.end);
		}
	};

	function setDateTimeToShow(datetime: any) {
		var datetimeVal = new Date(datetime);
		var dt = new Date(
			datetimeVal.getFullYear(),
			datetimeVal.getMonth(),
			datetimeVal.getDate(),
			datetimeVal.getHours(),
			datetimeVal.getMinutes(),
			datetimeVal.getSeconds()
		);
		dt.setTime(dt.getTime() + dt.getTimezoneOffset() * 60 * 1000);
		return dt;
	}

	const [calenderDates, setCalenderDates] = useState<any[]>([]);
	useEffect(() => {
		if (totalSlots && totalSlots.length) {
			calendarData();
		}
	}, [totalSlots]);

	const handleMouseEnter = (info: AnyObject) => {
		updateTooltip(info);
		console.log(moment(info.event.startStr.substr(11, 5), "hh:mm").format("hh:mm a"));
		console.log(moment(info.event.endStr.substr(11, 5), "hh:mm").format("hh:mm a"));
	};

	
	const updateTooltip = (info: any) => {
		setCalenderData({
			title: info.event.title,
			startTime: moment(info.event.startStr.substr(11, 5), "hh:mm").format("hh:mm a"),
			endTime: moment(info.event.endStr.substr(11, 5), "hh:mm").format("hh:mm a"),
			show:true
		});
	};

	const handleMouseLeave = () => {
		setCalenderData(initialTooltip)
	};

	const handleMouseClick = (info: AnyObject) => {
		console.log(info.event._def.extendedProps.appointmentId);
		history.push(`/schedule/edit-appointment/view/${info.event._def.extendedProps.appointmentId}`)
	};

	const[staffSelected,setStaffSelected]=useState("all")
	useEffect(()=>{
		if (totalSlots && totalSlots.length) {
			calendarData();
		}
	},[staffSelected])
	const calendarData = () => {
		const tempArr: any[] = [];
		console.log(totalSlots);
		console.log(staffSelected)
		const selectedStaff= _.filter(totalSlots, (totalSlots) => totalSlots.resourceId === staffSelected);
		console.log(selectedStaff)
		let	calenderSort:any[]=[]
		if(staffSelected=="all")
		{
			calenderSort=totalSlots;
		}
		else{
			calenderSort=selectedStaff
		}
		calenderSort.forEach((values: any, key: any) => {
			if (resourseDataVal && resourseDataVal.length) {
				const title = _.filter(resourseDataVal, (resourseDataVal) => resourseDataVal.id === values.resourceId);
				values.title = title[0].firstName + " " + title[0].lastName;
				values.description = "description" + key;
				values.backgroundColor = title[0].eventColor;
				values.eventColor = title[0].eventColor;
				values.start = values.timeStart;
				values.end = values.timeEnd;
				values.startDate = values.timeStart;
				values.startTime = values.timeStart;
				values.endTime = values.timeEnd;
				values.allDay = false;
				tempArr.push(values);
			}
			//     resourceId: timeslot.resourceId,
			//     resource: resource ? (resource.firstName + ' ' + resource.lastName) : 'Deleted Staff',
			//     startDate: setDateTimeToShow(timeslot.timeStart),
			//     startDate: setDateTimeToShow(timeslot.timeStart),
			//     endTime: setDateTimeToShow(timeslot.timeEnd),
		});
		console.log(tempArr);
		setCalenderDates(tempArr);
	};
	return (
		<React.Fragment>
			{user.authenticated && !UI.loading ? (
				<div>
					<PageHeader title={title} buttons={buttons} />
					<div className="row">
						<div className="col-lg-12">
							<div className="wrapper wrapper-content animated fadeInRight">
								<div className="row">
									<div className="col-md-12 col-md-push-0">
										{/* <div className='ibox float-e-margins' data-ng-show='vm.editing'>
									<div id='edit-event'></div>
									<div className='ibox-title'>
										<h5>Appointment Details</h5>
										<div className='ibox-tools'>
											<a className='collapse-link' href='#/'>
												<i className='fa fa-chevron-up'></i>
											</a>
										</div>
									</div>
									<div className='ibox-content m-b-sm border-bottom'>
										<form name='scheduleItemEdit' className='form-horizontal'>
											<div className='text-danger m-t-md m-b-md' data-ng-show='vm.errors.length'>
												vm.errors
											</div>
											<div className='text-warning m-t-md m-b-md' data-ng-show='vm.event.deleted==true'>
												<strong>Warning!</strong> Service was deleted from DB!
											</div>
											<div className='form-group'>
												<div className='col-lg-12'>
													<label className='control-label'>Client Name:</label>
												</div>
												<div className='col-lg-12' data-ng-hide="vm.event.clientName=='deleted'">
													vm.event.clientName
												</div>
												<div className='col-lg-12 text-warning' data-ng-show="vm.event.clientName=='deleted'">
													<strong>Warning!</strong> Client was deleted from DB!
												</div>
											</div>
											<div className='form-group'>
												<div className='col-lg-12'>
													<label className='control-label'>Service Category</label>
													<select
														data-ng-model='vm.event.categoryId'
														data-ng-options='category.id as category.name for category in vm.plainCategories'
														className='form-control'
														required
													>
														<option value=''>Category</option>
													</select>
												</div>
											</div>
											<div className='form-group'>
												<div className='col-lg-12'>
													<label className='control-label'>Services</label>
													<select
														name='services'
														data-ng-model='vm.event.serviceId'
														data-ng-options='service.id as service.name for service in vm.services | filter: vm.event.categoryId : categoryId'
														className='form-control'
														required
													></select>
												</div>
											</div>
											<div className='form-group'>
												<div className='col-lg-12'>
													<label className='control-label'>Staff Members</label>
													<select
														data-ng-model='vm.event.resourceId'
														data-ng-options="staff.id as staff.firstName+' '+staff.lastName for staff in vm.staff | filterByIdList : vm.categoryStaffList(vm.event.categoryId) | orderBy:'order'"
														className='form-control'
														required
													></select>
												</div>
											</div>
											<div className='form-group'>
												<div className='col-lg-12'>
													<label className='control-label'>Start Time</label>
													<div className='input-group'>
														<input
															type='text'
															className='form-control'
															uib-datepicker-popup="{{'fullDate'}}"
															ng-model='vm.event.startDate'
															is-open='vm.popupDateTime.opened'
															datepicker-options='vm.popupDateTime.dateOptions'
															close-text='Close'
															required
														/>
														<span className='input-group-btn'>
															<button type='button' className='btn btn-default' ng-click='vm.openDate()'>
																<i className='glyphicon glyphicon-calendar'></i>
															</button>
														</span>
													</div>
													<div
														uib-timepicker
														ng-model='vm.event.startTime'
														hour-step='1'
														minute-step='10'
														show-meridian='ismeridian'
													></div>
												</div>
											</div>
											<div className='form-group'>
												<div className='col-lg-12'>
													<button className='btn btn-white' type='button' data-ng-click='vm.cancel()'>
														Cancel
													</button>
													<button
														// style="display: none"
														className='btn btn-danger'
														type='button'
														item-name="(vm.event.title+' for client '+vm.event.clientName+' on '+vm.shortDateTime(vm.event.start))"
														item-callback='vm.delete'
													>
														Delete
													</button>
													<button
														className='btn btn-primary'
														type='button'
														data-ng-click='vm.save()'
														data-ng-disabled='scheduleItemEdit.$invalid || vm.saving'
													>
														Save Changes <i className='fa fa-spinner fa-spin' data-ng-show='vm.saving'></i>
													</button>
												</div>
											</div>
										</form>
									</div>
								</div> */}
										{/* <div className='ibox float-e-margins' data-ng-show='vm.showingDetails'>
									<div id='show-event'></div>
									<div className='ibox-title'>
										<h5>Event Details</h5>
										<div className='ibox-tools'>
											<a className='collapse-link' href='#/'>
												<i className='fa fa-chevron-up'></i>
											</a>
										</div>
									</div>
									<div className='ibox-content m-b-sm border-bottom clearfix'>
										<div className='text-warning m-t-md m-b-md' data-ng-show='vm.showEvent.deleted==true'>
											<strong>Warning!</strong> Service was deleted from DB!
										</div>
										<div
											className='row'
											// style="margin-top: 10px;"
										>
											<div className='col-lg-12'>
												<label className='control-label'>Client Name:</label>
											</div>
											<div className='col-lg-12' data-ng-hide="vm.showEvent.clientName=='deleted'">
												vm.showEvent.clientName
											</div>
											<div className='col-lg-12 text-warning' data-ng-show="vm.showEvent.clientName=='deleted'">
												<strong>Warning!</strong> Client was deleted from DB!
											</div>
										</div>
										<div
											className='row'
											// style="margin-top: 10px;"
										>
											<div className='col-lg-12'>
												<label className='control-label'>Services Category:</label>
											</div>
											<div className='col-lg-12'>vm.showEvent.categoryName</div>
										</div>
										<div
											className='row'
											// style="margin-top: 10px;"
										>
											<div className='col-lg-12'>
												<label className='control-label'>Service:</label>
											</div>
											<div className='col-lg-12'>vm.showEvent.title</div>
										</div>
										<div
											className='row'
											//style="margin-top: 10px;"
										>
											<div className='col-lg-12'>
												<label className='control-label'>Staff:</label>
											</div>
											<div className='col-lg-12'>vm.showEvent.resourceName</div>
										</div>
										<div
											className='row'
											// style="margin-top: 10px;"
										>
											<div className='col-lg-12'>
												<label className='control-label'>Date/Time:</label>
											</div>
											<div className='col-lg-12'>
												vm.showEvent.startDate | date: 'EEEE, LLLL d, yyyy' vm.showEvent.startTime | date: 'hh:mm a'
											</div>
										</div>
										<div
											className='row'
											// style="margin-top: 10px;"
										>
											<div className='col-lg-12'>
												<button className='btn btn-white' type='button' data-ng-click='vm.cancelDetails()'>
													OK
												</button>
											</div>
										</div>
									</div>
								</div> */}
									</div>
								</div>
								<div className="row">
									<div className="col-md-9 col-md-push-3">
										<div className="ibox-content m-b-sm border-bottom">
											<div
												className="text-center p-lg"
												id="ScheduleCalendarWrapper"
												style={{ padding: "10px" }}>
												<FullCalendar
													plugins={[
														dayGridPlugin,
														timeGridPlugin,
														resourceTimeGridPlugin,
														listPlugin,
														resourceTimelinePlugin,
													]}
													timeZone="UTC"
													initialView="resourceTimelineDay"
													schedulerLicenseKey="0116820732-fcs-1622120977"
													resourceGroupField="building"
													resources={resourseDataVal}
													buttonText={{
														today: "Today",
														month: "Month",
														week: "Week",
														day: "Day",
														list: "List",
														resourceTimeline: "Group",
													}}
													headerToolbar={{
														right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek,resourceTimeline",
														center: "title",
														left: "today,prev,next",
													}}
													eventMouseEnter={handleMouseEnter}
													eventMouseLeave={handleMouseLeave}
													eventClick={handleMouseClick}
													events={calenderDates && calenderDates.length ? calenderDates : []}
												/>
												<Tooltips
													title={calenderData.title}
													startTime={calenderData.startTime}
													endTime={calenderData.endTime}
													show={calenderData.show}
												/>
											</div>
										</div>
									</div>
									<div className="col-md-3 col-md-pull-9" ng-if="vm.staff.length > 1">
										<div className="ibox float-e-margins">
											<div className="ibox-title">
												<h5>Staff Members</h5>
												<div className="ibox-tools">
													<a className="collapse-link" href="#/">
														<i className="fa fa-chevron-up"></i>
													</a>
												</div>
											</div>
											<div
												className="ibox-content m-b-sm border-bottom"
												style={{ maxHeight: "525px", overflow: "scroll" }}>
												<div className="row">
													<div className="col-md-12">
														<Button
															className="btn btn-white m-t-xs m-b-xs"
															style={{
																backgroundColor: "white",
																color: "black",
																width: "100%",
																maxWidth: "400px",
															}}
															onClick={(e: any) => setStaffSelected("all")}>
															Show ALL{" "}
															{loading && <i className="fa fa-spinner fa-spin"></i>}
														</Button>
													</div>
													<div className="col-md-12 text-truncate">
														{allStaff &&
															allStaff.length &&
															allStaff.map((values: any, index: any) => {
																return (
																	values.roles.includes("stylist") && (
																		<Button
																			className="btn btn-primary m-t-xs m-b-xs text-truncate"
																			style={{
																				width: "100%",
																				maxWidth: "400px",
																				backgroundColor: `${values.color}`,
																			}}
																			onClick={(e: any) =>
																				setStaffSelected(e.target.value)
																			}
																			value={values.id}>
																			{/* {getRole(values,index)} */}
																			{values.name}
																		</Button>
																	)
																);
															})}
													</div>
												</div>
											</div>
										</div>

										<div className="ibox float-e-margins">
											<div className="ibox-title">
												<h5>Admin/Support Members</h5>
												<div className="ibox-tools">
													<a className="collapse-link" href="#/">
														<i className="fa fa-chevron-up"></i>
													</a>
												</div>
											</div>
											<div
												className="ibox-content m-b-sm border-bottom"
												style={{ maxHeight: "525px", overflow: "scroll" }}>
												<div className="row">
													<div className="col-md-12">
														<Button
															className="btn btn-white m-t-xs m-b-xs"
															style={{
																backgroundColor: "white",
																color: "black",
																width: "100%",
																maxWidth: "400px",
															}}
															onClick={(e: any) => setStaffSelected("all")}>
															Show ALL{" "}
															{loading && <i className="fa fa-spinner fa-spin"></i>}
														</Button>
													</div>
													<div className="col-md-12 text-truncate">
														{allStaff &&
															allStaff.length &&
															allStaff.map((values: any) => {
																return (
																	values.roles.includes("admin", "business") && (
																		<Button
																			className="btn btn-primary m-t-xs m-b-xs text-truncate"
																			style={{
																				width: "100%",
																				maxWidth: "400px",
																				backgroundColor: `${values.color}`,
																			}}
																			onClick={(e: any) =>
																				setStaffSelected(e.target.value)
																			}
																			value={values.id}>
																			{values.name}
																		</Button>
																	)
																);
															})}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<></>
			)}
		</React.Fragment>
	);
};

const mapStateToProps = (state: any) => ({});

const mapActionsToProps = { getAllStaff, getAllCategory, timeSlots, getUserBusinessDetails, getAllService, schedule };

export default connect(mapStateToProps, mapActionsToProps)(Schedule);
