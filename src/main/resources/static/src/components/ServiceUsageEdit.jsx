import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import DatePicker from "react-bootstrap-date-picker";
import {hashHistory, Link} from "react-router";
import * as actionCreators from "../redux/actions/actions";
import {selectGroup, selectService, selectServiceUsage} from "../common/Helper";
import {addServiceUsage, removeServiceUsage, updateServiceUsage} from "../common/api.js";
import Constants from "../common/Constants";
import dateFormat from "dateformat";

function mapStateToProps(state, ownProps) {
    return {
        login: state.login,
        group: selectGroup(state.main.group.list, ownProps.params.groupId),
        service: selectService(state.main.service.list, ownProps.params.serviceId),
        serviceUsageToEdit: selectServiceUsage(state.main.serviceUsage.list, ownProps.params.usageId)
    }
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(actionCreators, dispatch)};
}

class ServiceUsageEdit extends React.Component {

    constructor(props) {
        super(props);
        var date = this.props.serviceUsageToEdit != null ? dateFormat(this.props.serviceUsageToEdit.date, "isoDateTime") : new Date().toISOString();
        this.defaultMsg = "Configure service usage"
        this.state = {
            loading: false,
            msg: this.defaultMsg,
            warnMsg: null,
            serviceUsageToBeRemoved: null,
            selectedItem: this.props.serviceUsageToEdit != null ? this.props.serviceUsageToEdit.item : null,
            selectedDate: date,
            formData: {
                usage: {
                    index: this.props.serviceUsageToEdit != null ? this.props.serviceUsageToEdit.index : "",
                    consumption: this.props.serviceUsageToEdit != null ? this.props.serviceUsageToEdit.consumption : "",
                    desc: this.props.serviceUsageToEdit != null ? this.props.serviceUsageToEdit.desc : "",
                    date: this.props.serviceUsageToEdit != null ? new Date(this.props.serviceUsageToEdit.date).getTime() : new Date(date).getTime()
                }
            }
        }
        this.handleIndexChange = this.handleIndexChange.bind(this);
        this.handleConsumptionChange = this.handleConsumptionChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.measurementItemElements = this.measurementItemElements.bind(this);
        this.renderRemoveServiceUsageConfirmationButton = this.renderRemoveServiceUsageConfirmationButton.bind(this);
        this.submit = this.submit.bind(this);
        this.removeServiceUsageFromServer = this.removeServiceUsageFromServer.bind(this);
        this.renderDate = this.renderDate.bind(this);
    }

    componentDidMount() {
        if (this.props.service.itemList.length == 0) {
            this.setState(
                {
                    warnMsg: "Service has no measurement items"
                }
            );
        }
    }

    handleIndexChange(event) {
        if (!isNaN(event.target.value)) {
            this.setState(
                {
                    formData: {
                        usage: Object.assign({}, this.state.formData.usage, {
                            index: event.target.value
                        })
                    }
                }
            )
        }
    }

    handleConsumptionChange(event) {
        if (!isNaN(event.target.value)) {
            this.setState(
                {
                    formData: {
                        usage: Object.assign({}, this.state.formData.usage, {
                            consumption: event.target.value
                        })
                    }
                }
            )
        }
    }

    handleDescChange(event) {
        this.setState(
            {
                formData: {
                    usage: Object.assign({}, this.state.formData.usage, {
                        desc: event.target.value
                    })
                }
            }
        )
    }

    handleDateChange(value) {

        this.setState(
            {
                loading: false,
                selectedDate: value,
                formData: {
                    usage: Object.assign({}, this.state.formData.usage, {
                        date: new Date(value).getTime()
                    })
                }
            });
    }

    selectItem(item) {
        this.setState(
            {
                selectedItem: item,
            }
        );
    }

    measurementItemElements() {
        return this.props.service.itemList.map((item) =>
            <li key={item.id}>
                <a onClick={() => this.selectItem(item)}>
                    <i className="fa fa-tachometer blue-light" aria-hidden="true"></i>&nbsp;{item.label}
                </a>
                <div id="customDividerId" role="separator" className="divider"></div>
            </li>
        );
    }

    submit() {
        if (this.state.selectedItem == null) {
            this.setState({warnMsg: "Please select a measurement item"});
            return;
        }
        this.setState({loading: true, serviceUsageToBeRemoved: null});
        if (this.props.serviceUsageToEdit == null) {
            addServiceUsage(JSON.stringify(this.state.formData.usage), this.props.group.id, this.props.service.id,
                this.state.selectedItem.id, this.props.login.currentUser.id).then((resolve) => {
                let date = new Date().toISOString();
                this.setState({
                    loading: false,
                    msg: "Registration added",
                    warnMsg: null,
                    selectedDate: date,
                    formData: {
                        usage: {
                            index: "",
                            consumption: "",
                            desc: "",
                            date: new Date(date).getTime()
                        }
                    }
                });
            }).catch((err) => {
                if (err.status == Constants.HttpStatus.BAD_REQUEST) {
                    this.setState({loading: false, warnMsg: err.responseText, msg: this.defaultMsg});
                }
                else {
                    console.error(err);
                    this.setState({loading: false, warnMsg: Constants.GENERIC_ERROR_MSG, msg: this.defaultMsg});
                }
            });
        } else {
            updateServiceUsage(JSON.stringify(this.state.formData.usage), this.state.selectedItem.id,
                this.props.serviceUsageToEdit.id, this.props.login.currentUser.id).then((resolve) => {
                let serviceUsage = JSON.parse(resolve.responseText);
                this.setState({
                    loading: false,
                    msg: "Registration updated",
                    warnMsg: null
                });
            }).catch((err) => {
                if (err.status == Constants.HttpStatus.BAD_REQUEST) {
                    this.setState({loading: false, warnMsg: err.responseText, msg: this.defaultMsg});
                }
                else {
                    console.error(err);
                    this.setState({loading: false, warnMsg: Constants.GENERIC_ERROR_MSG, msg: this.defaultMsg});
                }
            });
        }
    }

    removeServiceUsageConfirmation() {
        this.setState(
            {
                msg: "Remove current registration ?",
                serviceUsageToBeRemoved: this.props.serviceUsageToEdit,
                warnMsg: null
            }
        )
    }

    removeServiceUsageFromServer() {
        this.setState({loading: true, serviceUsageToBeRemoved: null});
        removeServiceUsage(this.props.serviceUsageToEdit.id, this.props.login.currentUser.id).then((resolve) => {
            this.setState({
                loading: false,
                msg: "Registration removed.",
                warnMsg: null
            });
            hashHistory.push("main/group/" + this.props.group.id + "/service/" + this.props.service.id + "/usage");
        }).catch((err) => {
            if (err.status == Constants.HttpStatus.BAD_REQUEST) {
                this.setState({loading: false, warnMsg: err.responseText, msg: this.defaultMsg});
            }
            else {
                console.error(err);
                this.setState({loading: false, warnMsg: Constants.GENERIC_ERROR_MSG, msg: this.defaultMsg});
            }
        });
    }

    renderRemoveServiceUsageConfirmationButton() {
        if (this.state.serviceUsageToBeRemoved != null) {
            return (
                <button type="button" className="btn btn-danger btn-xs margin-right-2vh margin-top-2vh pull-right"
                        aria-expanded="false" onClick={() => this.removeServiceUsageFromServer()}>
                    <i className="fa fa-check" aria-hidden="true"></i>
                    <span> Yes</span>
                </button>
            )
        }
    }

    renderDate() {
        return (
            <div className="input-group col-xs-6 col-lg-2 margin-top-1">
                <label>Date</label><sup> <i className="fa fa-star red" aria-hidden="true"></i></sup>
                <DatePicker id="example-datepicker" value={this.state.selectedDate}
                            onChange={this.handleDateChange} dateFormat={"DD/MM/YYYY"}/>
            </div>
        )
    }

    render() {
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-xs-9">
                                <h4>
                                    <i className="fa fa-wrench blue-light" aria-hidden="true"></i>
                                    <span> Service usage</span>
                                </h4>
                            </div>
                            {this.props.serviceUsageToEdit != null ?
                                <div className="col-xs-3">
                                    <div className="btn-group pull-right">
                                        <button type="button" onClick={() => this.removeServiceUsageConfirmation()}
                                                className="btn btn-danger" aria-expanded="false">
                                            <i className="fa fa-trash" aria-hidden="true"></i> Delete
                                        </button>
                                    </div>
                                </div> :
                                <div></div>
                            }
                        </div>
                        <hr/>
                        <div>
                            <i className="fa fa-cubes gray-dark" aria-hidden="true"></i>
                            <small className="gray-dark">&nbsp;Group: <strong>{this.props.group.label}</strong></small>
                        </div>
                        <div>
                            <i className="fa fa-cogs gray-dark" aria-hidden="true"></i>
                            <small className="gray-dark">&nbsp;&nbsp;Service:
                                <strong>{this.props.service.label}</strong></small>
                        </div>
                        {this.state.loading ?
                            <div>
                                <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                                <small className="gray-dark">&nbsp;&nbsp;Loading data...</small>
                            </div> :
                            <div>
                                <i className="fa fa-info-circle gray-dark" aria-hidden="true"></i>
                                <small className="gray-dark">&nbsp;&nbsp;{this.state.msg}</small>
                                <div className="row">
                                    {this.renderRemoveServiceUsageConfirmationButton()}
                                </div>
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
                {this.props.service.itemList.length > 0 ?
                    <div id="mobilePanelId" className="panel panel-default">
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-xs-9">
                                    {this.props.serviceUsageToEdit == null ?
                                        <h4>Add new service usage</h4> :
                                        <h4>Edit service usage</h4>
                                    }
                                </div>
                            </div>
                            <hr/>
                            <form>
                                <div className="btn-group">
                                    <button type="button" className="btn btn-default dropdown-toggle wrap-text"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {this.state.selectedItem == null ?
                                            <span className="gray-dark">Select a measurement item&nbsp;
                                        </span> :
                                            <span className="margin-top-05 margin-bottom-2em">
                                            <i className="fa fa-tachometer cyan" aria-hidden="true"></i>
                                                &nbsp;{this.state.selectedItem.label}&nbsp;
                                        </span>
                                        }
                                        &nbsp;<span className="caret"></span>
                                    </button>
                                    <ul className="dropdown-menu" role="menu">
                                        {this.measurementItemElements()}
                                    </ul>
                                </div>
                                {this.renderDate()}
                                <div className="row">
                                    <div className="col-xs-6 col-lg-3">
                                        <div className="input-group col-xs-12 col-lg-12 margin-top-05">
                                            <label>Amount
                                                <sup> <i className="fa fa-star red" aria-hidden="true"></i></sup>
                                            </label>
                                            {this.state.selectedItem != null ?
                                                <sup className="gray-dark">&nbsp;
                                                    ({this.state.selectedItem.unitOfMeasurement})&nbsp;</sup> :
                                                <span></span>
                                            }
                                            <input type="tel" className="form-control" maxLength="20"
                                                   placeholder="0" value={this.state.formData.usage.index}
                                                   onChange={this.handleIndexChange}
                                                   aria-describedby=" basic-addon1"/>
                                        </div>
                                    </div>
                                    <div className="col-xs-6 col-lg-3">
                                        <div className="input-group col-xs-12 col-lg-12 margin-top-05">
                                            <label>Consumption<sup className="simple-text">
                                                <small> (Optional)</small>
                                            </sup></label>
                                            <input type="tel" className="form-control" maxLength="20"
                                                   placeholder="auto calculated"
                                                   value={this.state.formData.usage.consumption}
                                                   onChange={this.handleConsumptionChange}
                                                   aria-describedby=" basic-addon1"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group col-xs-12 col-lg-6 margin-top-05">
                                    <label>Description<sup className="simple-text">
                                        <small> (Optional)</small>
                                    </sup></label>
                                    <textarea className=" form-control" maxLength="256" rows="2"
                                              placeholder="Service usage description"
                                              value={this.state.formData.usage.desc}
                                              onChange={this.handleDescChange}></textarea>
                                </div>
                                <div className="row margin-top-2vh">
                                    <div className="col-xs-6">
                                        <button type="button" className="btn btn-default"
                                                aria-expanded="false" onClick={() => hashHistory.goBack()}>
                                            <i className="fa fa-chevron-left" aria-hidden="true"></i>
                                            <span> Back</span>
                                        </button>
                                    </div>
                                    <div className="col-xs-6">
                                        <button type="button" className="btn btn-info pull-right"
                                                aria-expanded="false" onClick={() => this.submit()}>
                                            <i className="fa fa-check" aria-hidden="true"></i>
                                            <span> Apply</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div> :
                    <div id="mobilePanelId" className="panel panel-default">
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-xs-12 text-align-center">
                                    <div className="btn-group">
                                        <Link
                                            to={"main/service/" + this.props.service.id + "/mi"}
                                            type="button" className="btn btn-info" aria-expanded="false">
                                            <i className="fa fa-tachometer" aria-hidden="true"></i> Configure service
                                            measurement items
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ServiceUsageEdit);