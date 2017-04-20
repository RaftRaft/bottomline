import React from "react";
import {connect} from "react-redux";
import {hashHistory, Link} from "react-router";
import {bindActionCreators} from "redux";
import {sendInvitation} from "../common/api.js";
import {selectGroup} from "../common/Helper";
import Constants from "../common/Constants";

function mapStateToProps(state, ownProps) {
    return {
        login: state.login,
        group: selectGroup(state.main.group.list, ownProps.params.groupId)
    }
}

class MemberInvite extends React.Component {

    constructor(props) {
        super(props);
        this.defaultMsg = "Invite user to group"
        this.state = {
            loading: false,
            msg: this.defaultMsg,
            warnMsg: null,
        }
        this.formData = {
            invitation: {
                email: ""
            }
        }
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    handleEmailChange(event) {
        this.formData.invitation = Object.assign({}, this.formData.invitation, {
            email: event.target.value
        })
    }

    submit() {
        this.setState({loading: true});
        sendInvitation(JSON.stringify(this.formData.invitation), this.props.group.id, this.props.login.currentUser.id).then((resolve) => {
            this.setState({
                loading: false,
                msg: "Invitation sent",
                warnMsg: null
            });
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

    render() {
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-xs-12">
                                <h4>
                                    <i className="fa fa-envelope blue-light" aria-hidden="true"></i>
                                    <span> Send member invitation</span>
                                </h4>
                            </div>
                        </div>
                        <hr/>
                        <div>
                            <i className="fa fa-cubes gray-dark" aria-hidden="true"></i>
                            <small className="gray-dark"> Group: <strong> {this.props.group.label}</strong></small>
                        </div>
                        {this.state.loading ?
                            <div>
                                <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                                <small className="gray-dark">&nbsp;&nbsp;Loading data...</small>
                            </div> :
                            <div>
                                <i className="fa fa-info-circle gray-dark" aria-hidden="true"></i>
                                <small className="gray-dark">&nbsp;&nbsp;{this.state.msg}</small>
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
                            <div className="input-group col-xs-9 col-lg-4">
                                <label>
                                    <span> User gmail address</span>
                                    <span> <i className="fa fa-google-plus-official cyan" aria-hidden="true"></i></span>
                                </label>
                                <input type="email" className="form-control" maxLength="50"
                                       placeholder="Enter email of user you want to invite"
                                       onChange={this.handleEmailChange}
                                       aria-describedby="basic-addon1"/>
                            </div>
                            <hr className="margin-top-2vh"/>
                            <div className="row margin-top-2vh">
                                <div className="col-xs-6">
                                    <button onClick={() => hashHistory.goBack()} type="button"
                                            className="btn btn-default pull-left"
                                            aria-expanded="false">
                                        <i className="fa fa-chevron-left" aria-hidden="true"></i> Back
                                    </button>
                                </div>
                                <div className="col-xs-6">
                                    <button type="button" className="btn btn-info pull-right"
                                            aria-expanded="false" onClick={() => this.submit()}>
                                        <i className="fa fa-envelope" aria-hidden="true"></i> Send
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

export default connect(mapStateToProps)(MemberInvite);