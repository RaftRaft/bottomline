import React from "react";
import {connect} from "react-redux";
import {Link, hashHistory} from "react-router";
import {bindActionCreators} from "redux";
import * as actionCreators from "../redux/actions/actions";
import {addGroup} from "../common/api.js";

function mapStateToProps(state) {
    return {login: state.login};
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(actionCreators, dispatch)};
}


class MeasurementItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            msg: "A group can be a house"
        }
        this.formData = {
            group: {
                label: null,
                desc: null
            }
        }
        this.handleLabelChange = this.handleLabelChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.submit = this.submit.bind(this);
        console.debug("Group add construct");
    }

    handleLabelChange(event) {
        this.formData.group = Object.assign({}, this.formData.group, {
            label: event.target.value
        })
    }

    handleDescChange(event) {
        this.formData.group = Object.assign({}, this.formData.group, {
            desc: event.target.value
        })
    }

    submit() {
        console.debug("Form: " + JSON.stringify(this.formData.group));
        this.setState({loading: true});
        addGroup(JSON.stringify(this.formData.group), this.props.login.currentUser.id).then((resolve) => {
            console.debug(resolve);
            let persistedGroup = JSON.parse(resolve.responseText);
            this.setState({
                loading: false
            });
            this.props.actions.addGroup(persistedGroup);
            hashHistory.push("main/group/content/" + persistedGroup.id);
        }).catch((err) => {
            console.error(err.statusText);
            this.setState({loading: false, msg: err.responseText});
        });
    }

    render() {
        console.debug("Group add render");
        return (
            <div className="container">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-12"><h5><i className="fa fa-tachometer" aria-hidden="true"></i>
                                <span> Configure measurement items for service</span>
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
                                       placeholder="Eg: m³, $" onChange={this.handleLabelChange}
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