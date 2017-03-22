import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {addService} from "../common/api.js";
import {selectService, selectGroup} from "../common/Helper";

function mapStateToProps(state, ownProps) {
    return {
        login: state.login,
        service: selectService(selectGroup(state.main.group.list, ownProps.params.index).serviceList, ownProps.params.serviceId)
    }
}

class MeasurementItemAdd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            msg: "You are almost done"
        }
        this.formData = {
            measurementItem: {
                label: null,
                mu: null
            }
        }
        this.handleLabelChange = this.handleLabelChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.submit = this.submit.bind(this);
        console.debug("MeasurementItem add construct");
    }

    handleLabelChange(event) {
        this.formData.measurementItem = Object.assign({}, this.formData.measurementItem, {
            label: event.target.value
        })
    }

    handleDescChange(event) {
        this.formData.measurementItem = Object.assign({}, this.formData.measurementItem, {
            mu: event.target.value
        })
    }

    submit() {
        console.debug("Form: " + JSON.stringify(this.formData.measurementItem));
        this.setState({loading: true});
        addService(JSON.stringify(this.formData.service), this.props.group.id, this.props.login.currentUser.id).then((resolve) => {
            console.debug(resolve);
            this.setState({
                loading: false,
                msg: "Service added"
            });
        }).catch((err) => {
            console.error(err.statusText);
            this.setState({loading: false, msg: err.responseText});
        });
    }

    render() {
        console.debug("MeasurementItem add render");
        return (
            <div className="container">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-12"><h5><i className="fa fa-plus-circle"
                                                              aria-hidden="true"></i>
                                <span> Measurement item setup for service <strong>{this.props.service.label}</strong></span>
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
                                       placeholder="Happy tree friends" onChange={this.handleLabelChange}
                                       aria-describedby="basic-addon1"/>
                            </div>
                            <div className="input-group col-xs-12 col-lg-6 margin-top-05">
                                <label>Description</label>
                                <textarea className="form-control" maxLength="256" rows="3" placeholder="Some desc"
                                          onChange={this.handleDescChange}></textarea>
                            </div>
                            <div className="row margin-top-2vh">
                                <div className="col-xs-6">
                                    <Link to="main/group" type="button" className="btn btn-default pull-left"
                                          aria-expanded="false">
                                        <i className="fa fa-chevron-left" aria-hidden="true"></i> Groups
                                    </Link>
                                </div>
                                <div className="col-xs-6">
                                    <button type="button" className="btn btn-info pull-right"
                                            aria-expanded="false" onClick={() => this.submit()}>
                                        <span>Next </span><i className="fa fa-chevron-right" aria-hidden="true"></i>
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

export default connect(mapStateToProps)(MeasurementItemAdd);