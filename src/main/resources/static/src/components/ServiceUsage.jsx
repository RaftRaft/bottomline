import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {hashHistory, Link} from "react-router";
import dateFormat from "dateformat";
import DatePicker from "react-bootstrap-date-picker";
import Pagination from "react-js-pagination";
import * as actionCreators from "../redux/actions/actions";
import {generateServiceUsageSeries, selectGroup, selectService} from "../common/Helper";
import {getServiceUsage} from "../common/api.js";
import Constants from "../common/Constants";
import ServiceUsageChart from "./ServiceUsageChart.jsx";


function mapStateToProps(state, ownProps) {
    return {
        login: state.login,
        group: selectGroup(state.main.group.list, ownProps.params.groupId),
        service: selectService(selectGroup(state.main.group.list, ownProps.params.groupId).serviceList, ownProps.params.serviceId),
        serviceUsage: state.main.serviceUsage
    }
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(actionCreators, dispatch)};
}

class ServiceUsage extends React.Component {

    constructor(props) {
        super(props);
        this.defaultMsg = "Manage service usage";
        this.state = {
            loading: true,
            msg: this.defaultMsg,
            warnMsg: null
        }
        this.serviceUsageElements = this.serviceUsageElements.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.getServiceUsageFromServer = this.getServiceUsageFromServer.bind(this);
        this.toggleChart = this.toggleChart.bind(this);
        this.setChartData = this.setChartData.bind(this);
    }

    toggleChart() {
        this.props.actions.showServiceUsageChart(!this.props.serviceUsage.chart.show);
    }

    getServiceUsageFromServer(page) {
        this.setState({loading: true});
        getServiceUsage(this.props.group.id, this.props.service.id, (page - 1) * Constants.MAX_RESULTS, Constants.MAX_RESULTS,
            new Date(this.props.serviceUsage.filter.date).getTime(), this.props.serviceUsage.filter.itemIdList,
            this.props.login.currentUser.id).then((resolve) => {
            this.props.actions.setServiceUsageList(JSON.parse(resolve.responseText));
            this.props.actions.setServiceUsageTotalItemCount(JSON.parse(resolve.getResponseHeader("count")));
            if (JSON.parse(resolve.responseText).length != 0) {
                this.setState({loading: false, warnMsg: null});
            } else {
                this.setState({loading: false, msg: "No service usage data found"});
            }
        }).catch((err) => {
            if (err.status == Constants.HttpStatus.BAD_REQUEST) {
                this.setState({loading: false, warnMsg: err.responseText});
            }
            else {
                console.error(err);
                this.setState({loading: false, warnMsg: Constants.GENERIC_ERROR_MSG});
            }
        });
    }

    setChartData() {
        this.props.actions.fetchServiceUsageChartData(true);
        getServiceUsage(this.props.group.id, this.props.service.id, 0, 1000,
            new Date(this.props.serviceUsage.filter.date).getTime(), this.props.serviceUsage.filter.itemIdList,
            this.props.login.currentUser.id).then((resolve) => {
            let serviceUsageList = JSON.parse(resolve.responseText);
            this.props.actions.fetchServiceUsageChartData(false);
            this.props.actions.setServiceUsageChartData(generateServiceUsageSeries(serviceUsageList,
                this.props.serviceUsage.filter.showConsumption));
        }).catch((err) => {
            this.props.actions.fetchServiceUsageChartData(false);
            if (err.status == Constants.HttpStatus.BAD_REQUEST) {
                this.setState({loading: false, warnMsg: err.responseText});
            }
            else {
                console.error(err);
                this.setState({loading: false, warnMsg: Constants.GENERIC_ERROR_MSG});
            }
        });
    }

    componentDidMount() {
        this.getServiceUsageFromServer(1);
        this.props.actions.setServiceUsageActivePage(1);
    }

    toggleFilter() {
        this.props.actions.showServiceUsageFilter(!this.props.serviceUsage.filter.show);
    }

    handlePageChange(pageNumber) {
        this.props.actions.setServiceUsageActivePage(pageNumber);
        this.getServiceUsageFromServer(pageNumber);
    }

    serviceUsageElements() {
        return this.props.serviceUsage.list.map((serviceUsage) =>
            <a key={serviceUsage.id} type="button" className="list-group-item bg-green-light" onClick={() => {
                hashHistory.push("main/group/" + this.props.group.id + "/service/" + this.props.service.id + "/usage/edit/" + serviceUsage.id);
            }}>
                <div className="row">
                    <div className="col-xs-9">
                        <small className="pull-left"><strong>{serviceUsage.item.label}</strong></small>
                    </div>
                    <div className="row">
                        <div className="col-xs-3">
                            <small className="pull-right gray-dark">
                                <strong>{dateFormat(serviceUsage.date, "dd/mm/yyyy")}</strong></small>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6">
                        <small className="pull-left gray-dark"> {serviceUsage.desc}</small>
                    </div>
                    <div className="col-xs-6">
                        <span className="pull-right"><small className="gray-dark">amount:</small><strong
                            className="cyan"> {serviceUsage.index}
                            </strong><sup className="gray-dark"><small> {serviceUsage.item.unitOfMeasurement}</small></sup>
                        </span>
                    </div>
                </div>
                {this.props.serviceUsage.filter.showConsumption ?
                    <div className="row">
                        <div className="col-xs-12">
                        <span className="pull-right"><small className="gray-dark">consumption:</small>
                            <strong className="gray-dark"> {serviceUsage.consumption}</strong>
                            <sup className="gray-dark"><small> {serviceUsage.item.unitOfMeasurement}</small></sup>
                        </span>
                        </div>
                    </div> :
                    <div></div>
                }
            </a>
        );
    }

    render() {
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-xs-9">
                                <h4><i className="fa fa-cogs" aria-hidden="true"></i>
                                    &nbsp;{this.props.service.label}</h4>
                            </div>
                            {this.props.service.owner.id == this.props.login.currentUser.id ?
                                <div className="col-xs-3">
                                    <div className="btn-group pull-right">
                                        <Link
                                            to={"main/service/" + this.props.service.id + "/edit"} type="button"
                                            className="btn btn-default" aria-expanded="false">
                                            <i className="fa fa-pencil-square" aria-hidden="true"></i> Edit
                                        </Link>
                                    </div>
                                </div> :
                                <div></div>
                            }
                        </div>
                        <hr/>
                        <div className="row margin-top-05">
                            <div className="col-xs-8">
                                <h4>
                                    <i className="fa fa-line-chart blue-light" aria-hidden="true"></i>
                                    <span className="gray-dark"> Service usage</span>
                                </h4>
                            </div>
                            {this.props.service.owner.id == this.props.login.currentUser.id ?
                                <div className="col-xs-4">
                                    <Link
                                        to={"main/group/" + this.props.group.id + "/service/" + this.props.service.id + "/usage/edit/"}
                                        type="button" className="btn btn-info pull-right" aria-expanded="false">
                                        <i className="fa fa-plus-circle" aria-hidden="true"></i> New
                                    </Link>
                                </div> :
                                <div></div>
                            }
                        </div>
                        {this.state.loading ?
                            <div>
                                <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                                <small className="gray-dark"> Loading data...</small>
                            </div> :
                            <div>
                                <i className="fa fa-info-circle gray-dark" aria-hidden="true"></i>
                                <small className="gray-dark"> {this.state.msg}</small>
                            </div>
                        }
                        {this.state.warnMsg != null ?
                            <div className="alert alert-warning margin-top-2vh" role="alert">
                                <span>{this.state.warnMsg}</span>
                            </div> :
                            <div></div>
                        }
                    </div>
                </div>
                {this.props.serviceUsage.list.length > 0 ?
                    <div id="mobilePanelId" className="panel panel-default">
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-xs-6">
                                    <button type="button" className="btn btn-default btn-block pull-left"
                                            aria-expanded="false"
                                            onClick={() => this.toggleFilter()}>
                                        <i className="fa fa-low-vision blue-light" aria-hidden="true"></i>
                                        {!this.props.serviceUsage.filter.show ?
                                            <span> Show filters</span> :
                                            <span className="gray-dark"> Hide filters</span>
                                        }
                                    </button>
                                </div>
                                <div className="col-xs-6">
                                    <div className="btn-group pull-right">
                                        <button
                                            onClick={() => this.toggleChart()} type="button"
                                            className="btn btn-default" aria-expanded="false">
                                            <i className="fa fa-pie-chart green" aria-hidden="true"></i>
                                            {!this.props.serviceUsage.chart.show ?
                                                <span> Show Chart</span> :
                                                <span className="gray-dark"> Hide Chart</span>
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {this.props.serviceUsage.filter.show ?
                                <Filter service={this.props.service} serviceUsage={this.props.serviceUsage}
                                        actions={this.props.actions}
                                        getServiceUsageFromServer={this.getServiceUsageFromServer}
                                        setChartData={this.setChartData}/> :
                                <div></div>
                            }
                            {this.props.serviceUsage.chart.show ?
                                <ServiceUsageChart groupId={this.props.group.id} serviceId={this.props.service.id}/> :
                                <div></div>
                            }
                            <div id="groupListId" className="list-group margin-top-1">
                                {!this.state.loading ?
                                    this.serviceUsageElements() :
                                    <div></div>
                                }
                            </div>
                            <div className="row text-align-center">
                                {this.props.serviceUsage.totalItemsCount > Constants.MAX_RESULTS && !this.state.loading ?
                                    <Pagination activePage={this.props.serviceUsage.activePage}
                                                itemsCountPerPage={Constants.MAX_RESULTS}
                                                totalItemsCount={this.props.serviceUsage.totalItemsCount}
                                                pageRangeDisplayed={5}
                                                onChange={this.handlePageChange}/> :
                                    <div></div>
                                }
                            </div>
                        </div>
                    </div> :
                    <div id="mobilePanelId" className="panel panel-default">
                        <div id="groupListPanelBodyId" className="panel-body">
                            <div className="text-align-center margin-top-2vh margin-bottom-2em">
                                <small className="gray-dark"><strong>Service has no usage data</strong></small>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.itemElements = this.itemElements.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleItemCheck = this.handleItemCheck.bind(this);
        this.isItemInFilter = this.isItemInFilter.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.handleConsumptionCheck = this.handleConsumptionCheck.bind(this);
    }

    handleConsumptionCheck(e) {
        this.props.actions.setServiceUsageConsumptionFilter(e.target.checked);
    }

    handleDateChange(value) {
        this.props.actions.setServiceUsageDateFilter(value);
    }

    handleItemCheck(e, itemId) {
        if (e.target.checked) {
            this.props.actions.addItemToServiceUsageFilter(itemId);
        } else {
            this.props.actions.removeItemFromServiceUsageFilter(itemId);
        }
    }

    isItemInFilter(item) {
        for (let i = 0; i < this.props.serviceUsage.filter.itemIdList.length; i++) {
            if (this.props.serviceUsage.filter.itemIdList[i] == item.id) {
                return true;
            }
        }
        return false;
    }

    itemElements() {
        return this.props.service.itemList.map((item) =>
            <div key={item.id} className="col-xs-6 col-md-4">
                <div className="checkbox">
                    <label><input type="checkbox" value="" onChange={(e) => this.handleItemCheck(e, item.id)}
                                  checked={this.isItemInFilter(item)}/>
                        <small className="gray-dark">&nbsp;{item.label}</small>
                    </label>
                </div>
            </div>
        )
    }

    applyFilter() {
        this.props.actions.setServiceUsageActivePage(1);
        this.props.getServiceUsageFromServer(1);
        if (this.props.serviceUsage.chart.show) {
            this.props.setChartData();
        }
    }

    render() {
        return (
            <div className="panel panel-default margin-top-1">
                <div className="panel-body">
                    <div className="row">
                        <div className="col-xs-12">
                            <small className="pull-left gray-dark"><strong>Measurement items:</strong></small>
                        </div>
                        {this.props.service.itemList.length > 0 ?
                            this.itemElements() :
                            <div className="col-xs-12">
                                <small className="gray-dark pull-left">(none)</small>
                            </div>
                        }
                        <div className="col-xs-12">
                            <div className="input-group">
                                <label>
                                    <small className="gray-dark">Show registrations since</small>
                                </label>
                                <DatePicker id="example-datepicker" value={this.props.serviceUsage.filter.date}
                                            onChange={this.handleDateChange} dateFormat={"DD/MM/YYYY"}
                                            className="input-group-sm"/>
                            </div>
                        </div>
                        <div className="col-xs-12">
                            <div className="checkbox pull-left">
                                <label><input type="checkbox" value="" onChange={(e) => this.handleConsumptionCheck(e)}
                                              checked={this.props.serviceUsage.filter.showConsumption}/>
                                    <small className="gray-dark"><strong>&nbsp;Show consumption</strong></small>
                                </label>
                            </div>
                        </div>
                        <div className="col-xs-12">
                            <button type="button" className="btn btn-default pull-right" aria-expanded="false"
                                    onClick={() => this.applyFilter()}>
                                <i className="fa fa-check blue-light" aria-hidden="true"></i>
                                <small> Apply</small>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceUsage);