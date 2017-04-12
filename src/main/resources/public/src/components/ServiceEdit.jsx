import React from "react";
import {connect} from "react-redux";
import {hashHistory, Link} from "react-router";
import {bindActionCreators} from "redux";
import * as actionCreators from "../redux/actions/actions";
import {removeService, updateService} from "../common/api.js";
import {selectService} from "../common/Helper";
import Constants from "../common/Constants";

function mapStateToProps(state, ownProps) {
    return {
        login: state.login,
        service: selectService(state.main.service.list, ownProps.params.serviceId)
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(actionCreators, dispatch)};
}

class ServiceEdit extends React.Component {

    constructor(props) {
        super(props);
        this.defaultMsg = "Configure your service details"
        this.state = {
            loading: false,
            msg: this.defaultMsg,
            warnMsg: null,
            serviceToBeRemoved: null
        }
        this.formData = {
            service: Object.assign({}, this.props.service)
        }
        this.handleLabelChange = this.handleLabelChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.submit = this.submit.bind(this);
        this.removeServiceConfirmation = this.removeServiceConfirmation.bind(this);
        this.renderRemoveServiceConfirmationButton = this.renderRemoveServiceConfirmationButton.bind(this);
        this.removeService = this.removeService.bind(this);
        console.debug("Service edit construct");
    }

    handleLabelChange(event) {
        this.formData.service = Object.assign({}, this.formData.service, {
            label: event.target.value
        })
    }

    handleDescChange(event) {
        this.formData.service = Object.assign({}, this.formData.service, {
            desc: event.target.value
        })
    }

    removeServiceConfirmation() {
        this.setState(
            {
                msg: "Permanently remove service '" + this.props.service.label + "' ?",
                warnMsg: null,
                serviceToBeRemoved: this.props.service
            }
        )
    }

    submit() {
        console.debug("Form: " + JSON.stringify(this.formData.service));
        this.setState({loading: true, serviceToBeRemoved: null});
        updateService(JSON.stringify(this.formData.service), this.props.login.currentUser.id).then((resolve) => {
            console.debug(resolve);
            this.setState({
                loading: false,
                msg: resolve.responseText,
                warnMsg: null,
            });
            this.props.actions.editService(this.formData.service);
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

    removeService() {
        this.setState({loading: true, serviceToBeRemoved: null});
        removeService(this.props.service.id, this.props.login.currentUser.id).then((resolve) => {
            console.debug(resolve);
            this.setState({
                loading: false,
                msg: "Service removed."
            });
            hashHistory.push("main/service/list");
            this.props.actions.removeService(this.props.service.id);
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

    renderRemoveServiceConfirmationButton() {
        if (this.state.serviceToBeRemoved != null) {
            return (
                <button type="button" className="btn btn-danger btn-xs margin-right-2vh margin-top-2vh pull-right"
                        aria-expanded="false" onClick={() => this.removeService()}>
                    <i className="fa fa-check" aria-hidden="true"></i>
                    <span> Yes</span>
                </button>
            )
        }
    }

    render() {
        console.debug("Service edit render");
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-xs-6">
                                <h4>
                                    <i className="fa fa-wrench blue-light" aria-hidden="true"></i>
                                    <span> Service Edit</span>
                                </h4>
                            </div>
                            <div className="col-xs-6">
                                <div className="btn-group pull-right">
                                    <button type="button" onClick={() => this.removeServiceConfirmation()}
                                            className="btn btn-default" aria-expanded="false">
                                        <i className="fa fa-trash red-gray" aria-hidden="true"></i> Delete service
                                    </button>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div>
                            <i className="fa fa-cogs gray-dark" aria-hidden="true"></i>
                            <small className="gray-dark"> Service: <strong> {this.props.service.label}</strong></small>
                        </div>
                        {this.state.loading ?
                            <div>
                                <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                                <small className="gray-dark"> Loading data...</small>
                            </div> :
                            <div>
                                <i className="fa fa-info-circle gray-dark" aria-hidden="true"></i>
                                <small className="gray-dark"> {this.state.msg}</small>
                                <div className="row">
                                    {this.renderRemoveServiceConfirmationButton()}
                                </div>
                            </div>
                        }
                        {this.state.warnMsg != null ?
                            <div className="alert alert-warning margin-top-2vh" role="alert">
                                <span>{this.state.warnMsg}</span>
                            </div> :
                            <div></div>
                        }
                        <div className="row margin-top-2vh">
                            <div className="col-xs-12 text-align-center">
                                <div className="btn-group">
                                    <Link
                                        to={"main/service/" + this.props.service.id + "/mi"}
                                        type="button" className="btn btn-info" aria-expanded="false">
                                        <i className="fa fa-tachometer" aria-hidden="true"></i> Configure measurement
                                        items
                                    </Link>
                                </div>
                            </div>
                        </div>
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
                                       placeholder="Happy tree friends" defaultValue={this.props.service.label}
                                       onChange={this.handleLabelChange}
                                       aria-describedby="basic-addon1"/>
                            </div>
                            <div className="input-group col-xs-12 col-lg-6 margin-top-05">
                                <label>Description</label>
                                <textarea className="form-control" maxLength="256" rows="3" placeholder="Some desc"
                                          defaultValue={this.props.service.desc}
                                          onChange={this.handleDescChange}></textarea>
                            </div>
                            <div className="row margin-top-2vh">
                                <div className="col-xs-6">
                                </div>
                                <div className="col-xs-6">
                                    <button type="button" className="btn btn-info pull-right"
                                            aria-expanded="false" onClick={() => this.submit()}>
                                        <i className="fa fa-check-circle" aria-hidden="true"></i>
                                        <span> Apply</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(ServiceEdit);