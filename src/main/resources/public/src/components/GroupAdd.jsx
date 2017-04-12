import React from "react";
import {connect} from "react-redux";
import {hashHistory, Link} from "react-router";
import {bindActionCreators} from "redux";
import * as actionCreators from "../redux/actions/actions";
import {addGroup} from "../common/api.js";
import Constants from "../common/Constants";

function mapStateToProps(state) {
    return {login: state.login};
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(actionCreators, dispatch)};
}


class GroupAdd extends React.Component {

    constructor(props) {
        super(props);
        this.genericMsg = "Add a new group";
        this.state = {
            loading: false,
            msg: this.genericMsg,
            warnMsg: null
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
        console.debug("Group add render");
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-xs-6">
                                <h4>
                                    <i className="fa fa-cubes blue-light" aria-hidden="true"></i>
                                    <span> New Group</span>
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
                                <i className="fa fa-info-circle green" aria-hidden="true"></i>
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
                <div className="panel panel-default">
                    <div className="panel-body">
                        <form>
                            <div className="input-group col-xs-8 col-lg-4">
                                <label>Label
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

export default connect(mapStateToProps, mapDispatchToProps)(GroupAdd);