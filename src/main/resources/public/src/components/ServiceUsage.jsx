import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Link} from "react-router";
import * as actionCreators from "../redux/actions/actions";
import {selectGroup, selectService} from "../common/Helper";
import {getServiceUsage} from "../common/api.js";
import Constants from "../common/Constants";
import dateFormat from "dateformat";
import DatePicker from "react-bootstrap-date-picker";
import Pagination from "react-js-pagination";


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
        this.state = {
            loading: true,
            msg: "Service usage list"
        }
        this.serviceUsageElements = this.serviceUsageElements.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.getServiceUsageFromServer = this.getServiceUsageFromServer.bind(this);
        console.debug("Service usage construct");
    }

    getServiceUsageFromServer(page) {
        this.setState({loading: true});
        getServiceUsage(this.props.group.id, this.props.service.id, (page - 1) * Constants.MAX_RESULTS, Constants.MAX_RESULTS,
            new Date(this.props.serviceUsage.filter.date).getTime(), this.props.serviceUsage.filter.itemIdList,
            this.props.login.currentUser.id).then((resolve) => {
            this.props.actions.setServiceUsageList(JSON.parse(resolve.responseText));
            this.props.actions.setServiceUsageTotalItemCount(JSON.parse(resolve.getResponseHeader("count")));
            if (JSON.parse(resolve.responseText).length != 0) {
                this.setState({loading: false});
            } else {
                this.setState({loading: false, msg: "You have no service usage. Please, add one"});
            }
        }).catch((err) => {
            if (err.status == Constants.HttpStatus.BAD_REQUEST) {
                this.setState({loading: false, msg: err.responseText});
            }
            else {
                console.error(err);
                this.setState({loading: false, msg: Constants.GENERIC_ERROR_MSG});
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
            <a key={serviceUsage.id} type="button" className="list-group-item bg-light" onClick={() => {
                hashHistory.push("main/service/" + serviceUsage.id + "/edit")
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
                    <div className="col-xs-7">
                        <small className="pull-left gray-dark"> {serviceUsage.desc}</small>
                    </div>
                    <div className="col-xs-5">
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
        console.debug("Service usage render");
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-6">
                                <h5><i className="fa fa-cogs cyan" aria-hidden="true"></i>
                                    <span> <strong>Service usage</strong></span>
                                </h5>
                            </div>
                            <div className="col-xs-6">
                                <div className="btn-group pull-right">
                                    <Link
                                        to={"main/service/" + this.props.service.id + "/edit"} type="button"
                                        className="btn btn-default" aria-expanded="false">
                                        <i className="fa fa-pencil-square" aria-hidden="true"></i> Service Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-xs-9">
                                <h4><i className="fa fa-area-chart cyan"
                                       aria-hidden="true"></i> {this.props.service.label}
                                </h4>
                            </div>
                            <div className="col-xs-3">
                                <Link
                                    to={"main/group/" + this.props.group.id + "/service/" + this.props.service.id + "/usage/edit/"}
                                    type="button" className="btn btn-info pull-right" aria-expanded="false"> New
                                </Link>
                            </div>
                        </div>
                        <hr/>
                        {this.state.loading ?
                            <div className="alert alert-info" role="alert">
                                <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                                <span> Loading</span>
                            </div>
                            :
                            <div>
                                <div className="alert alert-info" role="alert">
                                    <i className="fa fa-info-circle" aria-hidden="true"></i>
                                    <span> {this.state.msg}</span>
                                </div>
                            </div>
                        }
                        <div className="row">
                            <div className="col-xs-12 col-md-4 col-md-offset-4">
                                <button type="button" className="btn btn-default btn-block gray-dark"
                                        aria-expanded="false"
                                        onClick={() => this.toggleFilter()}>
                                    {!this.props.serviceUsage.filter.show ?
                                        <span> Show filters</span> :
                                        <span> Hide filters</span>
                                    }
                                </button>
                            </div>
                        </div>
                        {this.props.serviceUsage.filter.show ?
                            <Filter service={this.props.service} serviceUsage={this.props.serviceUsage}
                                    actions={this.props.actions}
                                    getServiceUsageFromServer={this.getServiceUsageFromServer}/> :
                            <div></div>
                        }
                        <div id="groupListId" className="list-group margin-top-1">
                            {this.serviceUsageElements()}
                        </div>
                        <div className="row text-align-center">
                            {this.props.serviceUsage.totalItemsCount > Constants.MAX_RESULTS ?
                                <Pagination activePage={this.props.serviceUsage.activePage} itemsCountPerPage={Constants.MAX_RESULTS}
                                            totalItemsCount={this.props.serviceUsage.totalItemsCount} pageRangeDisplayed={5}
                                            onChange={this.handlePageChange}/> :
                                <div></div>
                            }
                        </div>
                    </div>
                </div>
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
        this.props.getServiceUsageFromServer(1);
        this.props.actions.setServiceUsageActivePage(1);
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
                            <button type="button" className="btn btn-success pull-right" aria-expanded="false"
                                    onClick={() => this.applyFilter()}>
                                <i className="fa fa-check" aria-hidden="true"></i> Apply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceUsage);