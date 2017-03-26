import React from "react";
import {connect} from "react-redux";
import {hashHistory, Link} from "react-router";
import {bindActionCreators} from "redux";
import * as actionCreators from "../redux/actions/actions";
import {addService, getServices} from "../common/api.js";
import {selectGroup} from "../common/Helper";
import Constants from "../common/Constants";

function mapStateToProps(state, ownProps) {
    return {
        login: state.login,
        group: selectGroup(state.main.group.list, ownProps.params.groupId)
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(actionCreators, dispatch)};
}

class ServiceAdd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            msg: "A service can be a house water consumption",
            addedService: null,
            userServiceList: null,
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
        console.debug("Service add construct");
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
                }
            }
        )
        this.setState({msg: "Service selected"})
    }

    componentDidMount() {
        getServices(this.props.login.currentUser.id).then((resolve) => {
            console.debug(resolve);
            let serviceList = JSON.parse(resolve.responseText);
            this.setState({
                userServiceList: serviceList
            });
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

    serviceElements() {
        return this.state.userServiceList.map((service) =>
            <li key={service.id}>
                <a onClick={() => this.handleSelect(service)}>
                    <div><strong>{service.label}</strong></div>
                    <div>
                        <small className="gray-dark">{service.desc}</small>
                    </div>
                </a>
                <div role="separator" className="divider"></div>
            </li>
        );
    }

    submit() {
        console.debug("Form: " + JSON.stringify(this.state.formData.service));
        this.setState({loading: true});
        addService(JSON.stringify(this.state.formData.service), this.props.group.id, this.props.login.currentUser.id).then((resolve) => {
            console.debug(resolve);
            let service = JSON.parse(resolve.responseText);
            this.setState({
                loading: false,
                addedService: service,
                msg: "Service created. Now, configure some measurement items"
            });
            this.props.actions.addService(service, this.props.group.id);
            hashHistory.push("main/group/" + this.props.group.id + "/service/" + service.id + "/mu/add");
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

    render() {
        console.debug("Service add render");
        return (
            <div className="container">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-12"><h5><i className="fa fa-plus-circle"
                                                              aria-hidden="true"></i>
                                <span> Add service for group <strong>{this.props.group.label}</strong></span>
                            </h5>
                            </div>
                        </div>
                    </div>
                    <div className="panel-body">
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
                        <form>
                            <div className="input-group col-xs-8 col-lg-4">
                                <label>Service name
                                    <sup> <i className="fa fa-star red" aria-hidden="true"></i></sup>
                                </label>
                                <input type="text" className="form-control" maxLength="50"
                                       placeholder="Happy tree friends" value={this.state.formData.service.label}
                                       onChange={this.handleLabelChange}
                                       aria-describedby="basic-addon1"/>
                            </div>
                            <div className="input-group col-xs-12 col-lg-6 margin-top-05">
                                <label>Description</label>
                                <textarea className="form-control" maxLength="256" rows="3" placeholder="Some desc"
                                          value={this.state.formData.service.desc}
                                          onChange={this.handleDescChange}></textarea>
                            </div>
                            {this.state.userServiceList != null && this.state.userServiceList.length != 0 ?
                                <div>
                                    <div className="margin-top-05">
                                        <label>Or, add an existing service</label>
                                    </div>
                                    <div className="btn-group dropup">
                                        <button type="button" className="btn btn-default">Your services</button>
                                        <button type="button" className="btn btn-default dropdown-toggle"
                                                data-toggle="dropdown"
                                                aria-haspopup="true" aria-expanded="false">
                                            <span className="caret"></span>
                                            <span className="sr-only">Your services</span>
                                        </button>
                                        <ul className="dropdown-menu" role="menu">
                                            {this.serviceElements()}
                                        </ul>
                                    </div>
                                </div>
                                :
                                <div></div>
                            }
                            <div className="row margin-top-2vh">
                                <div className="col-xs-6">
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