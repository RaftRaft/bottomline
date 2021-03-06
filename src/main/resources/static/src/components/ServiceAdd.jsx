import React from "react";
import {connect} from "react-redux";
import {hashHistory, Link} from "react-router";
import {bindActionCreators} from "redux";
import * as actionCreators from "../redux/actions/actions";
import {addService, addServiceForGroup} from "../common/api.js";
import {containsService, selectGroup} from "../common/Helper";
import Constants from "../common/Constants";

function mapStateToProps(state, ownProps) {
    return {
        login: state.login,
        group: selectGroup(state.main.group.list, ownProps.params.groupId),
        serviceList: state.main.service.list
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(actionCreators, dispatch)};
}

class ServiceAdd extends React.Component {

    constructor(props) {
        super(props);
        this.initialMsg = (this.props.group != null) ? "Add new service for group " + this.props.group.label : "Add new service";

        this.state = {
            loading: false,
            msg: this.initialMsg,
            warnMsg: null,
            addedService: null,
            formData: {
                service: {
                    label: "",
                    desc: ""
                }
            }
        }
        this.handleLabelChange = this.handleLabelChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.serviceElements = this.serviceElements.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.submit = this.submit.bind(this);
        this.clear = this.clear.bind(this);
        this.addFreeService = this.addFreeService.bind(this);
        this.addServiceForGroup = this.addServiceForGroup.bind(this);
    }

    handleLabelChange(event) {
        this.setState(
            {
                formData: {
                    service: Object.assign({}, this.state.formData.service, {
                        label: event.target.value
                    })
                }
            }
        )
    }

    handleDescChange(event) {
        this.setState(
            {
                formData: {
                    service: Object.assign({}, this.state.formData.service, {
                        desc: event.target.value
                    })
                }
            }
        )
    }

    handleSelect(service) {
        this.setState(
            {
                formData: {
                    service: Object.assign({}, service)
                },
                warnMsg: null,
            }
        )
        this.setState({msg: "Service selected"})
    }

    serviceElements() {
        var availableServices = 0;
        return this.props.serviceList.map((service, index) => {
                if (!containsService(this.props.group.serviceList, service)) {
                    availableServices++;
                    return (
                        <li key={service.id}>
                            <a onClick={() => this.handleSelect(service)}>
                                <div><strong>{service.label}</strong></div>
                                <div>
                                    <small className="gray-dark">{service.desc}</small>
                                </div>
                            </a>
                            <div id="customDividerId" role="separator" className="divider"></div>
                        </li>
                    )
                }
                if (index == this.props.serviceList.length - 1 && availableServices == 0) {
                    return (
                        <li key={service.id}>
                            <a>
                                <div><i className="fa fa-info-circle" aria-hidden="true"></i><strong> All your services are
                                    already assigned to current group</strong></div>
                            </a>
                        </li>
                    )
                }
            }
        )
    }

    submit() {
        if (this.props.group != null) {
            this.addServiceForGroup();
        } else {
            this.addFreeService();
        }
    }

    clear() {
        this.setState(
            {
                msg: this.initialMsg,
                warnMsg: null,
                addedService: null,
                formData: {
                    service: {
                        label: "",
                        desc: ""
                    }
                }
            }
        );
    }

    addFreeService() {
        this.setState({loading: true});
        addService(JSON.stringify(this.state.formData.service), this.props.login.currentUser.id).then((resolve) => {
            let service = JSON.parse(resolve.responseText);
            this.setState({
                loading: false,
                warnMsg: null,
                addedService: service
            });
            this.props.actions.addService(service);
            hashHistory.push("main/service/" + service.id + "/mi");
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

    addServiceForGroup() {
        this.setState({loading: true});
        addServiceForGroup(JSON.stringify(this.state.formData.service), this.props.group.id, this.props.login.currentUser.id).then((resolve) => {
            let service = JSON.parse(resolve.responseText);
            this.setState({
                loading: false,
                warnMsg: null,
                addedService: service
            });
            this.props.actions.addServiceForGroup(service, this.props.group.id);
            if (this.state.formData.service.id == null) {
                this.props.actions.addService(service);
            }
            hashHistory.push("main/service/" + service.id + "/mi");
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

    render() {
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-xs-6">
                                <h4>
                                    <i className="fa fa-cogs blue-light" aria-hidden="true"></i>
                                    <span> New Service</span>
                                </h4>
                            </div>
                        </div>
                        <hr/>
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
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-body">
                        <form>
                            <div className="input-group col-xs-8 col-lg-4">
                                <label>Service name
                                    <sup> <i className="fa fa-star red" aria-hidden="true"></i></sup>
                                </label>
                                <input type="text" className="form-control" maxLength="50"
                                       placeholder="ex: Water consumption" value={this.state.formData.service.label}
                                       onChange={this.handleLabelChange}
                                       disabled={this.state.formData.service.id != null}
                                       aria-describedby="basic-addon1"/>
                            </div>
                            <div className="input-group col-xs-12 col-lg-6 margin-top-05">
                                <label>Description</label>
                                <textarea className="form-control" maxLength="256" rows="3"
                                          placeholder="ex: Keep track of Hot/Cold  water consumption for each month"
                                          value={this.state.formData.service.desc}
                                          onChange={this.handleDescChange}
                                          disabled={this.state.formData.service.id != null}></textarea>
                            </div>
                            {this.props.serviceList != null && this.props.serviceList.length != 0 && this.props.group != null ?
                                <div className="margin-top-2vh">
                                    <div>
                                        <label>Or, add an existing service</label>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-8">
                                            <div className="dropup">
                                                <button className="btn btn-default dropdown-toggle" type="button"
                                                        id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true"
                                                        aria-expanded="false">
                                                    <span>Your services&nbsp;&nbsp;</span>
                                                    <span className="caret"></span>
                                                </button>
                                                <ul className="dropdown-menu" role="menu">
                                                    {this.serviceElements()}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-xs-4">
                                            <button type="button" className="btn btn-default pull-right"
                                                    aria-expanded="false" onClick={() => this.clear()}>
                                                <i className="fa fa-eraser" aria-hidden="true"></i>
                                                <span> Clear</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div></div>
                            }
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
                                        <i className="fa fa-chevron-right" aria-hidden="true"></i>
                                        <span> Next</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceAdd);