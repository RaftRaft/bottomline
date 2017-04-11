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
        this.state = {
            loading: false,
            msg: "Invite member message"
        }
        this.formData = {
            invitation: {
                email: ""
            }
        }
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.submit = this.submit.bind(this);
        console.debug("Member invite construct");
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
                msg: "Invitation sent."
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

    render() {
        console.debug("Member invite render");
        return (
            <div className="container">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-12">
                                <i className="fa fa-pencil-square cyan"
                                   aria-hidden="true"></i>
                                <span> Invite new member for group </span>
                                <h5 className="margin-top-02">
                                    <strong>
                                        {this.props.group.label}
                                    </strong>
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
                                        <i className="fa fa-envelope" aria-hidden="true"></i> Invite
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