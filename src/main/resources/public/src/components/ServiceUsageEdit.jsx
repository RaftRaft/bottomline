import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import DatePicker from "react-bootstrap-date-picker";
import {Link} from "react-router";
import * as actionCreators from "../redux/actions/actions";
import {selectGroup, selectService, selectServiceUsage} from "../common/Helper";
import {addServiceUsage} from "../common/api.js";
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
        this.state = {
            loading: false,
            msg: "Add service usage",
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
        console.log(new Date(date).getTime());
        this.handleIndexChange = this.handleIndexChange.bind(this);
        this.handleConsumptionChange = this.handleConsumptionChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.measurementItemElements = this.measurementItemElements.bind(this);
        this.submit = this.submit.bind(this);
        this.renderDate = this.renderDate.bind(this);
        console.debug("Service usage edit construct");
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
                selectedItem: item
            }
        );
    }

    measurementItemElements() {
        return this.props.service.itemList.map((item) =>
            <li key={item.id}>
                <a onClick={() => this.selectItem(item)}>
                    <i className="fa fa-tachometer" aria-hidden="true"></i>&nbsp;{item.label}
                </a>
                <div id="customDividerId" role="separator" className="divider"></div>
            </li>
        );
    }

    submit() {
        if (this.state.selectedItem == null) {
            this.setState({msg: "Please select a measurement item"});
            return;
        }
        this.setState({loading: true});
        addServiceUsage(JSON.stringify(this.state.formData.usage), this.props.group.id, this.props.service.id,
            this.state.selectedItem.id, this.props.login.currentUser.id).then((resolve) => {
            // let service = JSON.parse(resolve.responseText);
            this.setState({
                loading: false,
                msg: "Registration added"
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
                            <div className="btn-group">
                                <button type="button" className="btn btn-default dropdown-toggle wrap-text"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {this.state.selectedItem == null ?
                                        <span>Select a measurement item&nbsp;
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
                                               placeholder=""
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
                                        <i className="fa fa-check" aria-hidden="true"></i>
                                        <span> Done</span>
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


export default connect(mapStateToProps, mapDispatchToProps)(ServiceUsageEdit);