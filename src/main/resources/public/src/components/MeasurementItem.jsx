import React from "react";
import {connect} from "react-redux";
import {hashHistory, Link} from "react-router";
import {bindActionCreators} from "redux";
import * as actionCreators from "../redux/actions/actions";
import {addItem} from "../common/api.js";
import {selectGroup, selectService} from "../common/Helper";


function mapStateToProps(state, ownProps) {
    return {
        login: state.login,
        service: selectService(selectGroup(state.main.group.list, ownProps.params.groupId).serviceList, ownProps.params.serviceId)
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(actionCreators, dispatch)};
}


class MeasurementItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            msg: "Add measurement items"
        }
        this.formData = {
            item: {
                label: null,
                unitOfMeasurement: null
            }
        }
        this.handleLabelChange = this.handleLabelChange.bind(this);
        this.handleMuChange = this.handleMuChange.bind(this);
        this.measurementItems = this.measurementItems.bind(this);

        this.submit = this.submit.bind(this);
        console.debug("Group add construct");
    }

    handleLabelChange(event) {
        this.formData.item = Object.assign({}, this.formData.item, {
            label: event.target.value
        })
    }

    handleMuChange(event) {
        this.formData.item = Object.assign({}, this.formData.item, {
            unitOfMeasurement: event.target.value
        })
    }

    measurementItems() {
        return this.props.service.itemList.map((item, index) =>
            <Link to={"main/group/content/"} type="button" className="list-group-item" key={index}>
                <div><i className="fa fa-tachometer" aria-hidden="true"></i><b> {item.label}</b></div>
                <div>
                    <small className="gray-dark"><i className="fa fa-compress" aria-hidden="true"></i><strong> Unit of
                        measurement: </strong>{item.unitOfMeasurement}</small>
                </div>
            </Link>
        );
    }

    submit() {
        console.debug("Form: " + JSON.stringify(this.formData.item));
        this.setState({loading: true});
        addItem(JSON.stringify(this.formData.item), this.props.service.id, this.props.login.currentUser.id).then((resolve) => {
            console.debug(resolve);
            let item = JSON.parse(resolve.responseText);
            this.setState({
                loading: false,
                msg: "Measurement item added."
            });
            this.props.actions.addItem(item, this.props.service.id);
            // hashHistory.push("main/item/content/" + persistedGroup.id);
        }).catch((err) => {
            console.error(err.statusText);
            this.setState({loading: false, msg: err.responseText});
        });
    }

    render() {
        console.debug("Measurement item add render");
        return (
            <div className="container">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-12"><h5><i className="fa fa-tachometer cyan" aria-hidden="true"></i>
                                <span> Measurement items</span>
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
                        <div id="groupListId" className="list-group">
                            {this.measurementItems()}
                        </div>
                        <form>
                            <div className="input-group col-xs-8 col-lg-4">
                                <label>Measurement item label
                                    <sup> <i className="fa fa-star red" aria-hidden="true"></i></sup>
                                </label>
                                <input type="text" className="form-control" maxLength="50"
                                       placeholder="Happy tree friends" onChange={this.handleLabelChange}
                                       aria-describedby="basic-addon1"/>
                            </div>
                            <label className="margin-top-05">
                                Unit of measurement<sup> <i className="fa fa-star red"
                                                            aria-hidden="true"></i></sup></label>
                            <div className="input-group col-xs-4 col-lg-6">
                                <input type="text" className="form-control" maxLength="10"
                                       placeholder="Eg: m³, $" onChange={this.handleMuChange}
                                       aria-describedby="basic-addon1"/>
                            </div>
                            <div className="row margin-top-2vh">
                                <div className="col-xs-6">
                                </div>
                                <div className="col-xs-6">
                                    <button type="button" className="btn btn-warning pull-right"
                                            aria-expanded="false" onClick={() => this.submit()}>
                                        <i className="fa fa-check-circle" aria-hidden="true"></i>
                                        <span> Add</span>
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