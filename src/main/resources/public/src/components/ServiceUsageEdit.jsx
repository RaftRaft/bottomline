import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Link} from "react-router";
import {selectGroup, selectService} from "../common/Helper";

function mapStateToProps(state, ownProps) {
    return {
        group: selectGroup(state.main.group.list, ownProps.params.groupId),
        service: selectService(state.main.service.list, ownProps.params.serviceId)
    }
}

class ServiceUsageEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            msg: "Test",
            selectedItem: null,
            formData: {
                usage: {
                    value: 0,
                    consumption: "",
                    desc: "",
                    date: ""
                }
            }
        }
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.measurementItemElements = this.measurementItemElements.bind(this);
        console.debug("Service usage edit construct");
    }

    handleValueChange(event) {
        if (!isNaN(event.target.value)) {
            this.setState(
                {
                    formData: {
                        usage: Object.assign({}, this.state.formData.usage, {
                            value: event.target.value
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

    measurementItemElements() {
        return this.props.service.itemList.map((item) =>
            <li key={item.id}><a href="#">{item.label}</a></li>
        );
    }

    render() {
        console.debug("Service usage edit render");
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-6">
                                <h5><i className="fa fa-cogs cyan" aria-hidden="true"></i>
                                    <span> <strong>Service usage edit</strong></span>
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
                                <h4>Add new service usage</h4>
                            </div>
                            <div className="col-xs-3">
                            </div>
                        </div>
                        <hr/>
                        <form>
                            <div className="btn-group">
                                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false">Select a measurement item <span className="caret"></span>
                                </button>
                                <sup>&nbsp;&nbsp;<i className="fa fa-star red" aria-hidden="true"></i></sup>
                                <ul className="dropdown-menu">
                                    {this.measurementItemElements()}
                                </ul>
                            </div>
                            <div className="input-group col-xs-8 col-lg-4 margin-top-05">
                                <label>Amount
                                    <sup> <i className="fa fa-star red" aria-hidden="true"></i></sup>
                                </label>
                                <input type="tel" className="form-control" maxLength="20"
                                       placeholder=" Happy tree friends" value={this.state.formData.usage.value}
                                       onChange={this.handleValueChange}
                                       aria-describedby=" basic-addon1"/>
                            </div>
                            <div className="input-group col-xs-8 col-lg-4 margin-top-05">
                                <label>Consumption</label>
                                <input type="tel" className="form-control" maxLength="20"
                                       placeholder=" Happy tree friends" value={this.state.formData.usage.consumption}
                                       onChange={this.handleValueChange}
                                       aria-describedby=" basic-addon1"/>
                            </div>
                            <div className=" input-group col-xs-12 col-lg-6 margin-top-05">
                                <label>Description</label>
                                <textarea className=" form-control" maxLength="256" rows="2" placeholder="Some desc"
                                          value={this.state.formData.usage.desc}
                                          onChange={this.handleDescChange}></textarea>
                            </div>
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

export default connect(mapStateToProps)(ServiceUsageEdit);