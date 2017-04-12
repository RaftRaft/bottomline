import React from "react";
import {connect} from "react-redux";
import {hashHistory, Link} from "react-router";
import {bindActionCreators} from "redux";
import * as actionCreators from "../redux/actions/actions";
import {addItem, removeItem, updateItem} from "../common/api.js";
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

class MeasurementItem extends React.Component {

    constructor(props) {
        super(props);
        this.defaultMsg = "Configure service measurement items"
        this.state = {
            loading: false,
            msg: this.defaultMsg,
            warnMsg: null,
            itemToRemove: null,
            itemToEdit: null,
            formData: {
                item: {
                    label: "",
                    unitOfMeasurement: ""
                }
            }
        }
        this.handleLabelChange = this.handleLabelChange.bind(this);
        this.handleMuChange = this.handleMuChange.bind(this);
        this.measurementItems = this.measurementItems.bind(this);
        this.removeItemConfirmation = this.removeItemConfirmation.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.setItemToEdit = this.setItemToEdit.bind(this);
        this.renderRemoveItemConfirmationButton = this.renderRemoveItemConfirmationButton.bind(this);
        this.submit = this.submit.bind(this);
        console.debug("Measurement item construct");
    }

    handleLabelChange(event) {
        this.setState(
            {
                formData: {
                    item: Object.assign({}, this.state.formData.item, {
                        label: event.target.value
                    })
                }
            }
        )
    }

    handleMuChange(event) {
        this.setState(
            {
                formData: {
                    item: Object.assign({}, this.state.formData.item, {
                        unitOfMeasurement: event.target.value
                    })
                }
            }
        )
    }

    measurementItems() {
        return this.props.service.itemList.map((item) =>
            <a type="button" className="list-group-item bg-green-light" key={item.id}>
                <div className="row">
                    <div className="col-xs-10" onClick={() => this.setItemToEdit(item)}>
                        <div><i className="fa fa-tachometer" aria-hidden="true"></i><b> {item.label}</b></div>
                        <div>
                            <small className="gray-dark"><i className="fa fa-compress" aria-hidden="true"></i><strong>
                                &nbsp;&nbsp;Unit of measure: </strong>{item.unitOfMeasurement}</small>
                        </div>
                    </div>
                    <div className="col-xs-2">
                        <button type="button" className="btn btn-default btn-xs pull-right"
                                aria-expanded="false" onClick={() => this.removeItemConfirmation(item)}>
                            <i className="fa fa-times red-gray" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </a>
        );
    }

    setItemToEdit(item) {
        this.setState(
            {
                itemToEdit: item,
                itemToRemove: null,
                msg: this.defaultMsg,
                formData: {
                    item: Object.assign({}, item, {
                        label: (item != null) ? item.label : "",
                        unitOfMeasurement: (item != null) ? item.unitOfMeasurement : ""
                    })
                }
            }
        )
    }

    removeItemConfirmation(item) {
        this.setState(
            {
                msg: "Remove item '" + item.label + "' ?",
                warnMsg: null,
                itemToRemove: item
            }
        )
    }

    submit() {
        console.debug("Form: " + JSON.stringify(this.state.formData.item));
        this.setState({loading: true, itemToRemove: null, msg: this.defaultMsg});
        if (this.state.itemToEdit == null) {
            //Add new item
            addItem(JSON.stringify(this.state.formData.item), this.props.service.id, this.props.login.currentUser.id).then((resolve) => {
                console.debug(resolve);
                let item = JSON.parse(resolve.responseText);
                this.setState({
                    loading: false,
                    warnMsg: null,
                    msg: "Measurement item added."
                });
                this.props.actions.addItem(item, this.props.service.id);
            }).catch((err) => {
                if (err.status == Constants.HttpStatus.BAD_REQUEST) {
                    this.setState({loading: false, warnMsg: err.responseText});
                }
                else {
                    console.error(err);
                    this.setState({loading: false, warnMsg: Constants.GENERIC_ERROR_MSG});
                }
            });
        } else {
            //Update item
            updateItem(JSON.stringify(this.state.formData.item), this.props.login.currentUser.id).then((resolve) => {
                console.debug(resolve);
                this.setState({
                    loading: false,
                    msg: "Measurement item updated.",
                    warnMsg: null,
                });
                this.props.actions.editItem(this.state.formData.item);
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
    }

    removeItem() {
        let item = this.state.itemToRemove;
        this.setState({loading: true, itemToRemove: null});
        this.setItemToEdit(null);
        removeItem(item.id, this.props.login.currentUser.id).then((resolve) => {
            console.debug(resolve);
            this.setState({
                loading: false,
                msg: "Measurement item removed."
            });
            this.props.actions.removeItem(item.id);
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

    renderRemoveItemConfirmationButton() {
        if (this.state.itemToRemove != null) {
            return (
                <button type="button" className="btn btn-danger btn-xs margin-right-2vh pull-right"
                        aria-expanded="false" onClick={() => this.removeItem()}>
                    <i className="fa fa-check" aria-hidden="true"></i>
                    <span> Yes</span>
                </button>
            )
        }
    }

    render() {
        console.debug("Measurement item render");
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-xs-12">
                                <h4>
                                    <i className="fa fa-tachometer blue-light" aria-hidden="true"></i>
                                    <span> Measurement items</span>
                                </h4>
                            </div>
                        </div>
                        <hr/>
                        <div>
                            <i className="fa fa-cogs gray-dark" aria-hidden="true"></i>
                            <small className="gray-dark"> Service:<strong> {this.props.service.label}</strong></small>
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
                                    {this.renderRemoveItemConfirmationButton()}
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
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-body">
                        <div id="groupListId" className="list-group">
                            {this.measurementItems()}
                        </div>
                        <div className="row">
                            <div className="col-xs-6">
                                {this.state.itemToEdit == null ?
                                    <h4>Add new Item</h4> :
                                    <h4>Edit Item</h4>
                                }
                            </div>
                            <div className="col-xs-6">
                                {this.state.itemToEdit != null ?
                                    <button type="button" className="btn btn-success pull-right"
                                            aria-expanded="false" onClick={() => this.setItemToEdit(null)}>
                                        <i className="fa fa-check-circle" aria-hidden="true"></i>
                                        <span> Add new</span>
                                    </button> :
                                    <div></div>
                                }
                            </div>
                        </div>
                        <hr/>
                        <form>
                            <div className="input-group col-xs-8 col-lg-4">
                                <label>Measurement item label
                                    <sup> <i className="fa fa-star red" aria-hidden="true"></i></sup>
                                </label>
                                <input type="text" className="form-control" maxLength="50"
                                       placeholder="Happy tree friends" onChange={this.handleLabelChange}
                                       aria-describedby="basic-addon1" value={this.state.formData.item.label}/>
                            </div>
                            <label className="margin-top-05">
                                Unit of measurement<sup> <i className="fa fa-star red"
                                                            aria-hidden="true"></i></sup></label>
                            <div className="input-group col-xs-4 col-lg-6">
                                <input type="text" className="form-control" maxLength="10"
                                       placeholder="Eg: m³, $" onChange={this.handleMuChange}
                                       aria-describedby="basic-addon1"
                                       value={this.state.formData.item.unitOfMeasurement}/>
                            </div>
                            <div className="row margin-top-2vh">
                                <div className="col-xs-6">
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
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MeasurementItem);