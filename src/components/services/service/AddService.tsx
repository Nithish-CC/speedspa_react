import { useState } from 'react'
import { connect, useSelector } from 'react-redux'
import PageHeader from '../../core/PageHeader'

const Service = () => {
    const [buttons] = useState([
        {
            title: 'Add Service',
            url: 'services/add-new/'
        }
    ])

    const UI = useSelector((state: any) => state.UI)
    const user = useSelector((state: any) => state.user)

    return (
        <>
            {user.authenticated && !UI.loading ?
                <>
                    <PageHeader title="Add New Service" buttons={buttons} />
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="wrapper wrapper-content animated fadeInRight">
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item active">
                                        <a className="nav-link active show" id="service-info" data-toggle="tab" href="#service-info" role="tab" aria-controls="service-info" aria-selected="false">Service Info</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="staff-cost" data-toggle="tab" href="#staff-cost" role="tab" aria-controls="staff-cost" aria-selected="true">Staff Based Cost & Durations</a>
                                    </li>
                                </ul>
                                <div className="tab-content" id="myTabContent">
                                    <div className="tab-pane active" id="service-info" role="tabpanel" aria-labelledby="service-info">
                                        <div className="ibox float-e-margins m-b-none">
                                            <div className="ibox-content no-border">
                                                <div className="m-t-md">
                                                    <form name="serviceEdit" className="form-horizontal" notify-changes-unsaved wassaved="vm.dataWasSaved">
                                                        <div className="row" data-ng-show="vm.errors.length">
                                                            <div className="col-md-8">
                                                                <div className="text-danger m-t-md m-b-md">{'{'}{'{'}vm.errors{'}'}{'}'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-8">
                                                                <div className="form-group">
                                                                    <label className="col-sm-3 control-label">Name</label>
                                                                    <div className="col-sm-9">
                                                                        <input type="text" className="form-control" data-ng-model="vm.service.name" required />
                                                                    </div>
                                                                </div>
                                                                <div className="form-group" data-ng-repeat="time in vm.service.duration">
                                                                    <label className="col-sm-3 control-label">
                                                                        <span style={{ textTransform: 'capitalize' }}>{'{'}{'{'}time.type{'}'}{'}'}</span> Time</label>
                                                                    <div className="col-sm-9">
                                                                        <input type="number" className="form-control" data-ng-model="time.time" data-ng-min={0} />
                                                                        <span className="help-block m-b-none">
                                                                            <span data-ng-if="$index==2">After {'{'}{'{'}vm.service.duration[$index-1].type{'}'}{'}'} time. </span>
                                                                            <span data-ng-if="$index>0">Not required. </span>All time are in minutes.</span>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label className="col-sm-3 control-label">Price (min 0.2)</label>
                                                                    <div className="col-sm-9">
                                                                        <input type="number" className="form-control" data-ng-model="vm.service.price" data-ng-min={0} required />
                                                                    </div>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label className="col-sm-3 control-label">Display Price</label>
                                                                    <div className="col-sm-9">
                                                                        <input type="text" className="form-control" data-ng-model="vm.service.displayPrice" />
                                                                    </div>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label className="col-sm-3 control-label">Priority (0 is the lowest)</label>
                                                                    <div className="col-sm-9">
                                                                        <input type="number" className="form-control" data-ng-model="vm.service.priority" data-ng-min={0} required />
                                                                    </div>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label className="col-sm-3 control-label">Sort order (min 0)</label>
                                                                    <div className="col-sm-9">
                                                                        <input type="number" className="form-control" data-ng-model="vm.service.order" data-ng-min={0} required />
                                                                    </div>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label className="col-sm-3 control-label">Top level service</label>
                                                                    <div className="col-sm-9">
                                                                        <div className="m-t-xs">
                                                                            <input type="checkbox" className="m-t-sm" data-ng-model="vm.service.topLevel" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label className="col-sm-3 control-label">AddOns are required</label>
                                                                    <div className="col-sm-9">
                                                                        <div className="m-t-xs">
                                                                            <input type="checkbox" data-ng-model="vm.service.requiredAddOns" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label className="col-sm-3 control-label">Description</label>
                                                                    <div className="col-sm-9">
                                                                        <textarea className="form-control txtbig" placeholder="Write description here" data-ng-model="vm.service.description" defaultValue={""} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="hr-line-dashed" />
                                                        <div className="row">
                                                            <div className="col-md-8">
                                                                <div className="form-group">
                                                                    <label className="col-sm-3 control-label">Category</label>
                                                                    <div className="col-sm-9">
                                                                        <select data-ng-model="vm.service.categoryId" data-ng-options="category.id as category.name for category in vm.plainCategories" className="form-control" required>
                                                                            <option value>Category</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label className="col-md-2 control-label">Linked Services</label>
                                                                    <div className="col-md-10">
                                                                        <div className="m-t-sm" data-ng-repeat="linkedService in vm.linkedServices">
                                                                            <div className="row">
                                                                                <div className="col-sm-5 col-xs-4">
                                                                                    <select data-ng-model="linkedService.type" className="form-control">
                                                                                        <option value="addOns">Select Add On Option</option>
                                                                                        <option value="during">Select Processing Time Option</option>
                                                                                    </select>
                                                                                </div>
                                                                                <div className="col-sm-5 col-xs-5">
                                                                                    <select data-ng-model="linkedService.serviceId" data-ng-options="service.id as service.name for service in vm.services" className="form-control">
                                                                                        <option value>-- Select Service --</option>
                                                                                    </select>
                                                                                </div>
                                                                                <div className="col-sm-2 col-xs-3">
                                                                                    <button data-ng-hide="$first" className="btn btn-sm btn-danger" type="button" data-ng-click="vm.deleteLinkedService($index)">
                                                                                        <i className="fa fa-minus" aria-hidden="true" />
                                                                                    </button>
                                                                                    <button className="btn btn-sm btn-primary" type="button" data-ng-click="vm.addLinkedService($index)">
                                                                                        <i className="fa fa-plus" aria-hidden="true" />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row m-t-sm" data-ng-show="linkedService.type == 'addOns'" data-ng-repeat="linkedServiceOnOption in linkedService.servicesIds">
                                                                                <label className="col-sm-4 col-xs-3 col-xs-push-1 control-label">
                                                                                    <span data-ng-show="$first">Add On:</span>
                                                                                </label>
                                                                                <div className="col-sm-5 col-xs-5 col-xs-push-1">
                                                                                    <select data-ng-model="linkedServiceOnOption.serviceId" className="form-control">
                                                                                        <option value>-- Select Service --</option>
                                                                                        <option data-ng-value="service.id" data-ng-repeat="service in vm.services">{'{'}{'{'}service.name{'}'}{'}'}</option>
                                                                                    </select>
                                                                                </div>
                                                                                <div className="col-sm-2 col-xs-3 col-xs-push-1">
                                                                                    <button data-ng-hide="$first" className="btn btn-xs btn-danger" type="button" data-ng-click="vm.deleteLinkedOnOptionService($index,linkedService.servicesIds)">
                                                                                        <i className="fa fa-minus" aria-hidden="true" />
                                                                                    </button>
                                                                                    <button className="btn btn-xs btn-primary" type="button" data-ng-click="vm.addLinkedOnOptionService($index,linkedService.servicesIds)">
                                                                                        <i className="fa fa-plus" aria-hidden="true" />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="hr-line-dashed" />
                                                        <div className="row">
                                                            <div className="col-md-8">
                                                                <div className="form-group">
                                                                    <div className="col-sm-9 col-sm-offset-3">
                                                                        <button className="btn btn-white" type="button" data-ng-click="vm.cancel()">Cancel</button>
                                                                        <button className="btn btn-primary" type="button" data-ng-click="vm.save()" data-ng-disabled="serviceEdit.$invalid || vm.saving">Save Changes
                                                                            <i className="fa fa-spinner fa-spin" data-ng-show="vm.saving" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-content" id="myTabContent">
                                    <div className="tab-pane active" id="staff-cost" role="tabpanel" aria-labelledby="staff-cost">
                                        <div className="ibox float-e-margins m-b-none">
                                            <div className="ibox-content no-border">
                                                <div className="m-t-md">
                                                    <form name="variationForm" notify-changes-unsaved wassaved="vm.variationWasSaved">
                                                        <div className="row">
                                                            <div className="col-sm-12">
                                                                <h4 data-ng-if="!vm.variation.edit">Add Cost and Durations</h4>
                                                                <h4 data-ng-if="vm.variation.edit">Update Cost and Durations</h4>
                                                                <br />
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <div className="form-group" data-ng-if="!vm.variation.edit">
                                                                    <label>Staff</label>
                                                                    <select data-ng-model="vm.variation.resourceId" data-ng-options="stylist.id as stylist.name for stylist in vm.serviceCategoriesStaffs" className="form-control" name="account" required>
                                                                        <option value style={{ textTransform: 'capitalize' }}>Select {'{'}{'{'} vm.serviceCategories.description {'}'}{'}'}</option>
                                                                    </select>
                                                                </div>
                                                                <div className="form-group" data-ng-if="vm.variation.edit">
                                                                    <label>Staff</label>
                                                                    <select data-ng-model="vm.variation.resourceId" data-ng-options="stylist.id as stylist.name for stylist in vm.serviceCategoriesStaffs" className="form-control" name="account" disabled required>
                                                                        <option value style={{ textTransform: 'capitalize' }}>Select {'{'}{'{'} vm.serviceCategories.description {'}'}{'}'}</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-2">
                                                                <div className="form-group">
                                                                    <label>Price (min 0.2)</label>
                                                                    <input type="number" className="form-control" data-ng-model="vm.variation.price" data-ng-min={0} placeholder="Price" required />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-2">
                                                                <div className="form-group">
                                                                    <label>Active Time</label>
                                                                    <input type="number" className="form-control" data-ng-model="vm.variation.activetime" data-ng-min={0} placeholder="Time" required />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-2">
                                                                <div className="form-group">
                                                                    <label>Processing Time</label>
                                                                    <input type="number" className="form-control" data-ng-model="vm.variation.processingtime" data-ng-min={0} placeholder="Time" />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-2">
                                                                <div className="form-group">
                                                                    <label>Post Active Time</label>
                                                                    <input type="number" className="form-control" data-ng-model="vm.variation.afterprocessingtime" data-ng-min={0} placeholder="Time" />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-12 text-right">
                                                                <div className="form-group" data-ng-if="!vm.variation.edit">
                                                                    <div><label>&nbsp;</label></div>
                                                                    <button className="btn btn-info" type="button" data-ng-click="vm.variationReset()">Reset</button>
                                                                    <button className="btn btn-primary" type="button" data-ng-click="vm.addVariation()" data-ng-disabled="variationForm.$invalid || vm.savingVariation">Add
                                                                        <i className="fa fa-spinner fa-spin" data-ng-show="vm.savingVariation" />
                                                                    </button>
                                                                </div>
                                                                <div className="form-group" data-ng-if="vm.variation.edit">
                                                                    <div><label>&nbsp;</label></div>
                                                                    <button className="btn btn-info" type="button" data-ng-click="vm.variationReset()">Cancel</button>
                                                                    <button className="btn btn-success" type="button" data-ng-click="vm.updateVariation()" data-ng-disabled="variationForm.$invalid || vm.savingVariation">Update
                                                                        <i className="fa fa-spinner fa-spin" data-ng-show="vm.savingVariation" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                    <div className="hr-line-dashed" />
                                                    <div className="row">
                                                        <div className="col-sm-12">
                                                            <h4>Cost and Durations List</h4>
                                                            <br />
                                                            <table className="table table-striped table-hover dataTables-example">
                                                                <thead>
                                                                    <tr>
                                                                        <th data-ng-class="{
                                                  'sorting_desc': vm.orderby.desc,
                                                  'sorting_asc': !vm.orderby.desc,
                                                  'sorting': vm.orderby.field != 'resourceName'
                                                  }" data-ng-click="vm.order('resourceName')">Staff Name</th>
                                                                        <th data-ng-class="{
                                                  'sorting_desc': vm.orderby.desc,
                                                  'sorting_asc': !vm.orderby.desc,
                                                  'sorting': vm.orderby.field != 'serviceName'
                                                  }" data-ng-click="vm.order('serviceName')">Service Name</th>
                                                                        <th data-ng-class="{
                                                  'sorting_desc': vm.orderby.desc,
                                                  'sorting_asc': !vm.orderby.desc,
                                                  'sorting': vm.orderby.field != 'price'
                                                  }" data-ng-click="vm.order('price')">Price</th>
                                                                        <th data-ng-class="{
                                                  'sorting_desc': vm.orderby.desc,
                                                  'sorting_asc': !vm.orderby.desc,
                                                  'sorting': vm.orderby.field != 'variation.duration[0].time'
                                                  }" data-ng-click="vm.order('variation.duration[0].time')">Active Time (mins)</th>
                                                                        <th data-ng-class="{
                                                  'sorting_desc': vm.orderby.desc,
                                                  'sorting_asc': !vm.orderby.desc,
                                                  'sorting': vm.orderby.field != 'variation.duration[1].time'
                                                  }" data-ng-click="vm.order('variation.duration[1].time')">Processing Time (mins)</th>
                                                                        <th data-ng-class="{
                                                  'sorting_desc': vm.orderby.desc,
                                                  'sorting_asc': !vm.orderby.desc,
                                                  'sorting': vm.orderby.field != 'variation.duration[2].time'
                                                  }" data-ng-click="vm.order('variation.duration[2].time')">Post Active Time (mins)</th>
                                                                        <th width={100}>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr className="gradeX" ng-repeat="variation in vm.service.variations" data-ng-if="!vm.variationLoading">
                                                                        <td>{'{'}{'{'}variation.resourceName{'}'}{'}'}</td>
                                                                        <td>{'{'}{'{'}variation.serviceName{'}'}{'}'}</td>
                                                                        <td className="center">{'{'}{'{'} (variation.price/100) | currency: $ {'}'}{'}'}</td>
                                                                        <td>{'{'}{'{'}variation.duration[0].time{'}'}{'}'}</td>
                                                                        <td>{'{'}{'{'}variation.duration[1].time{'}'}{'}'}</td>
                                                                        <td>{'{'}{'{'}variation.duration[2].time{'}'}{'}'}</td>
                                                                        <td className="center">
                                                                            <a data-ng-click="vm.editVariation(variation);">Edit</a> | <a data-ng-click="vm.removeVariation(variation);">Delete</a>
                                                                        </td>
                                                                    </tr>
                                                                    <tr data-ng-if="(vm.service.variations.length <= 0 || vm.service.variations == undefined && !vm.variationLoading)">
                                                                        <td colSpan={7} align="center">
                                                                            No data.
                                                                        </td>
                                                                    </tr>
                                                                    <tr data-ng-if="vm.variationLoading">
                                                                        <td colSpan={7} align="center">
                                                                            Loading...
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
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
                </>
                : <></>
            }
        </>
    )
}

const mapActionsToProps = {
    // getAllStaff,
    // searchStaff,
    // deleteStaff
}

export default connect(null, mapActionsToProps)(Service)