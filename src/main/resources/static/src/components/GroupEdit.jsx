import React from "react";
import {connect} from "react-redux";
import {hashHistory, Link} from "react-router";
import {bindActionCreators} from "redux";
import * as actionCreators from "../redux/actions/actions";
import {removeGroup, updateGroup} from "../common/api.js";
import {selectGroup} from "../common/Helper";
import Constants from "../common/Constants";

function mapStateToProps(state, ownProps) {
    return {
        login: state.login,
        group: selectGroup(state.main.group.list, ownProps.params.groupId)
    }
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(actionCreators, dispatch)};
}

class GroupEdit extends React.Component {

    constructor(props) {
        super(props);
        this.defaultMsg = "Configure your group details";
        this.state = {
            loading: false,
            msg: this.defaultMsg,
            warnMsg: null,
            groupToBeRemoved: null
        }
        this.formData = {
            group: Object.assign({}, this.props.group)
        }
        this.handleLabelChange = this.handleLabelChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.removeGroupConfirmation = this.removeGroupConfirmation.bind(this);
        this.renderRemoveGroupConfirmationButton = this.renderRemoveGroupConfirmationButton.bind(this);
        this.removeGroup = this.removeGroup.bind(this);
        this.submit = this.submit.bind(this);
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

    removeGroupConfirmation() {
        this.setState(
            {
                msg: "Permanently remove group '" + this.props.group.label + "' ?",
                groupToBeRemoved: this.props.group
            }
        )
    }

    removeGroup() {
        this.setState({loading: true, groupToBeRemoved: null});
        removeGroup(this.props.group.id, this.props.login.currentUser.id).then((resolve) => {
            this.setState({
                loading: false
            });
            hashHistory.push("main/group");
            this.props.actions.removeGroup(this.props.group.id);
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

    submit() {
        this.setState({loading: true, groupToBeRemoved: null});
        updateGroup(JSON.stringify(this.formData.group), this.props.login.currentUser.id).then((resolve) => {
            this.setState({
                loading: false,
                msg: "Group updated",
                warnMsg: null
            });
            this.props.actions.editGroup(this.formData.group);
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

    renderRemoveGroupConfirmationButton() {
        if (this.state.groupToBeRemoved != null) {
            return (
                <button type="button" className="btn btn-danger btn-xs margin-right-2vh pull-right margin-top-05"
                        aria-expanded="false" onClick={() => this.removeGroup()}>
                    <i className="fa fa-check" aria-hidden="true"></i>
                    <span> Yes</span>
                </button>
            )
        }
    }

    render() {
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-xs-7">
                                <h4>
                                    <i className="fa fa-wrench blue-light" aria-hidden="true"></i>
                                    <span> Group Edit</span>
                                </h4>
                            </div>
                            <div className="col-xs-5">
                                <div className="btn-group pull-right">
                                    <button to="" type="button"
                                            className="btn btn-default" aria-expanded="false"
                                            onClick={() => this.removeGroupConfirmation()}>
                                        <i className="fa fa-trash red-gray" aria-hidden="true"></i> Delete group
                                    </button>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div>
                            <i className="fa fa-cubes gray-dark" aria-hidden="true"></i>
                            <small className="gray-dark"><strong> {this.props.group.label}</strong></small>
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
                                    {this.renderRemoveGroupConfirmationButton()}
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
                        <form>
                            <div className="input-group col-xs-8 col-lg-4">
                                <label>Group label
                                    <sup> <i className="fa fa-star red" aria-hidden="true"></i></sup>
                                </label>
                                <input type="text" className="form-control" maxLength="50"
                                       placeholder="Happy tree friends" onChange={this.handleLabelChange}
                                       aria-describedby="basic-addon1" defaultValue={this.props.group.label}/>
                            </div>
                            <div className="input-group col-xs-12 col-lg-6 margin-top-05">
                                <label>Description</label>
                                <textarea className="form-control" maxLength="256" rows="3" placeholder="Some desc"
                                          onChange={this.handleDescChange}
                                          defaultValue={this.props.group.desc}></textarea>
                            </div>
                            <div className="row margin-top-2vh">
                                <div className="col-xs-6">
                                    <Link to={"main/group/content/" + this.props.group.id} type="button"
                                          className="btn btn-default pull-left"
                                          aria-expanded="false">
                                        <i className="fa fa-chevron-left" aria-hidden="true"></i> Back
                                    </Link>
                                </div>
                                <div className="col-xs-6">
                                    <button type="button" className="btn btn-info pull-right"
                                            aria-expanded="false" onClick={() => this.submit()}>
                                        <i className="fa fa-check" aria-hidden="true"></i> Done
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

export default connect(mapStateToProps, mapDispatchToProps)(GroupEdit);