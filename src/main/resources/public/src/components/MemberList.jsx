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
        this.state = {
            msg: "Members are people",
            memberToRemove: null,
            removingMember: false,
        }
        this.memberElements = this.memberElements.bind(this);
        this.removeMemberFromGroup = this.removeMemberFromGroup.bind(this);
        this.removeMemberConfirmation = this.removeMemberConfirmation.bind(this);
        this.renderRemoveMemberConfirmation = this.renderRemoveMemberConfirmation.bind(this);
        console.debug("Member list construct");
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
                msg: "Member removed"
            });
            this.props.actions.removeMemberFromGroup(member.id, this.props.group.id);
        }).catch((err) => {
            if (err.status == Constants.HttpStatus.BAD_REQUEST) {
                this.setState({removingMember: false, memberToRemove: null, msg: err.responseText});
            }
            else {
                console.error(err);
                this.setState({removingMember: false, memberToRemove: null, msg: Constants.GENERIC_ERROR_MSG});
            }
        });
    }

    removeMemberConfirmation(member) {
        if (this.state.memberToRemove != null && this.state.memberToRemove.id == member.id) {
            this.setState({memberToRemove: null});
        } else {
            this.setState({memberToRemove: member});
        }
    }

    memberElements() {
        return this.props.group.memberList.map((member) =>
            <a type="button" className="list-group-item" key={member.id}>
                <div className="row">
                    <div className="col-xs-10">
                        <img className="img-circle" width="18px" height="18px" src={member.profileImageUrl}/>
                        {this.props.login.currentUser.id == member.id ?
                            <span><strong>{member.name}</strong><sup className="cyan"> owner</sup></span> :
                            <span>{member.name}</span>
                        }
                    </div>
                    <div className="col-xs-2">
                        <button type="button" className="btn btn-warning btn-xs pull-right"
                                aria-expanded="false" onClick={() => this.removeMemberConfirmation(member)}>
                            <i className="fa fa-remove" aria-hidden="true"></i>
                        </button>
                    </div>
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
                        <div className="col-xs-9 col-lg-11"><h5 className="pull-right">Remove member from group ? </h5></div>
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
        console.debug("Member list render");
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-6"><h5><i className="fa fa-cubes cyan" aria-hidden="true"></i>
                                <span> <strong>Group members</strong></span>
                            </h5>
                            </div>
                            <div className="col-xs-6">
                                <div className="btn-group pull-right">
                                    <Link to={"main/group/" + this.props.group.id + "/member/invite"} type="button" className="btn btn-info"
                                          aria-expanded="false">
                                        <i className="fa fa-envelope" aria-hidden="true"></i> Invite user
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="groupListPanelBodyId" className="panel-body">
                        <div>
                            <div className="alert alert-info" role="alert">
                                <i className="fa fa-info-circle" aria-hidden="true"></i>
                                <span> {this.state.msg}</span>
                            </div>
                            <div id="groupListId" className="list-group">
                                {this.memberElements()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberList);