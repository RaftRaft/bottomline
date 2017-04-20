import React from "react";
import {hashHistory, Link} from "react-router";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as actionCreators from "../redux/actions/actions";
import {selectGroup} from "../common/Helper";
import {removeMemberFromGroup} from "../common/api.js";
import Constants from "../common/Constants";


function mapStateToProps(state, ownProps) {
    return {
        group: selectGroup(state.main.group.list, ownProps.params.groupId),
        login: state.login
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(actionCreators, dispatch)};
}

class MemberList extends React.Component {

    constructor(props) {
        super(props);
        this.defaultMsg = "Manage group members";
        this.state = {
            msg: this.defaultMsg,
            warnMsg: null,
            memberToRemove: null,
            removingMember: false,
        }
        this.memberElements = this.memberElements.bind(this);
        this.removeMemberFromGroup = this.removeMemberFromGroup.bind(this);
        this.removeMemberConfirmation = this.removeMemberConfirmation.bind(this);
        this.renderRemoveMemberConfirmation = this.renderRemoveMemberConfirmation.bind(this);
    }

    componentDidMount() {
        if (this.props.group.memberList.length == 0) {
            this.setState({msg: "Group has no new members."})
        }
    }

    removeMemberFromGroup(member) {
        this.setState({removingMember: true});
        removeMemberFromGroup(member.id, this.props.group.id, this.props.login.currentUser.id).then((resolve) => {
            this.setState({
                removingMember: false,
                memberToRemove: null,
                msg: "Member removed",
                warnMsg: null
            });
            this.props.actions.removeMemberFromGroup(member.id, this.props.group.id);
        }).catch((err) => {
            if (err.status == Constants.HttpStatus.BAD_REQUEST) {
                this.setState({removingMember: false, memberToRemove: null, warnMsg: err.responseText});
            }
            else {
                console.error(err);
                this.setState({removingMember: false, memberToRemove: null, warnMsg: Constants.GENERIC_ERROR_MSG});
            }
        });
    }

    removeMemberConfirmation(member) {
        if (this.state.memberToRemove != null && this.state.memberToRemove.id == member.id) {
            this.setState({memberToRemove: null, warnMsg: null});
        } else {
            this.setState({memberToRemove: member, warnMsg: null});
        }
    }

    memberElements() {
        return this.props.group.memberList.map((member) =>
            <a type="button" className="list-group-item" key={member.id}>
                <div className="row">
                    <div className="col-xs-10">
                        <img className="img-circle" width="18px" height="18px" src={member.profileImageUrl}/>
                        {this.props.group.owner.id == member.id ?
                            <span><strong> {member.name}</strong><sup className="cyan"> owner</sup></span> :
                            <span> {member.name}</span>
                        }
                    </div>
                    {this.props.group.owner.id == this.props.login.currentUser.id ?
                        <div className="col-xs-2">
                            <button type="button" className="btn btn-default btn-xs pull-right"
                                    aria-expanded="false" onClick={() => this.removeMemberConfirmation(member)}>
                                <i className="fa fa-remove" aria-hidden="true"></i>
                            </button>
                        </div> :
                        <div></div>
                    }
                </div>
                {this.state.memberToRemove != null && this.state.memberToRemove.id == member.id ?
                    this.renderRemoveMemberConfirmation(member) :
                    <div></div>}
            </a>
        );
    }

    renderRemoveMemberConfirmation(member) {
        return (
            <div className="margin-top-2vh">
                {!this.state.removingMember ?
                    <div className="row">
                        <div className="col-xs-9 col-lg-11"><h5 className="pull-right">Remove member from group ? </h5>
                        </div>
                        <div className="col-xs-3 col-lg-1">
                            <button type="button" className="btn btn-default pull-right" aria-expanded="false"
                                    onClick={() => this.removeMemberFromGroup(member)}>
                                <i className="fa fa-check" aria-hidden="true"></i> Yes
                            </button>
                        </div>
                    </div> :
                    <div className="row">
                        <div className="col-xs-10 col-lg-11"><span className="pull-right">Loading </span></div>
                        <div className="col-xs-2 col-lg-1">
                            <i className="fa fa-spinner fa-spin pull-right" aria-hidden="true"></i>
                        </div>
                    </div>
                }
            </div>
        )
    }

    render() {
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-xs-8">
                                <h4>
                                    <i className="fa fa-user-circle blue-light" aria-hidden="true"></i>
                                    <span> Group members</span>
                                </h4>
                            </div>
                            <div className="col-xs-4">
                                <div className="btn-group pull-right">
                                    <Link to={"main/group/" + this.props.group.id + "/member/invite"} type="button"
                                          className="btn btn-info"
                                          aria-expanded="false">
                                        <i className="fa fa-user-plus" aria-hidden="true"></i> Add user
                                    </Link>
                                </div>
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
                        <div>
                            <div id="groupListId" className="list-group">
                                {this.memberElements()}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-6"></div>
                            <div className="col-xs-6">
                                <button type="button" className="btn btn-default pull-right"
                                        aria-expanded="false"
                                        onClick={() => hashHistory.push("main/group/content/" + this.props.group.id)}>
                                    <i className="fa fa-check" aria-hidden="true"></i>
                                    <span> Done</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberList);