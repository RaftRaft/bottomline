import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {hashHistory, Link} from "react-router";
import * as actionCreators from "../redux/actions/actions";
import {selectGroup} from "../common/Helper";
import {removeServiceFromGroup} from "../common/api.js";
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

class GroupContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            serviceToRetract: null,
            retractingService: false,
            retractingServiceMsg: null
        }
        this.memberElements = this.memberElements.bind(this);
        this.serviceElements = this.serviceElements.bind(this);
        this.renderRetractServiceConfirmation = this.renderRetractServiceConfirmation.bind(this);
        this.retractServiceConfirmation = this.retractServiceConfirmation.bind(this);
        console.debug("Group content construct");
    }

    retractService(service, groupId) {
        this.setState({retractingService: true});
        removeServiceFromGroup(service.id, groupId, this.props.login.currentUser.id).then((resolve) => {
            this.setState({
                retractingService: false,
                retractingServiceMsg: null
            });
            this.props.actions.removeServiceFromGroup(service.id, groupId);
        }).catch((err) => {
            if (err.status == Constants.HttpStatus.BAD_REQUEST) {
                this.setState({retractingService: false, retractingServiceMsg: err.responseText});
            }
            else {
                console.error(err);
                this.setState({retractingService: false, retractingServiceMsg: Constants.GENERIC_ERROR_MSG});
            }
        });
    }

    memberElements() {
        return this.props.group.memberList.map((member) =>
            <div key={member.id} className="col-lg-4 col-xs-6 margin-top-05">
                {this.props.group.owner.id != member.id ?
                    <div>
                        <img className="img-circle" width="18px" height="18px"
                             src={member.profileImageUrl}/><span className="gray-dark"> {member.name}</span>
                    </div> :
                    <div>
                        <img className="img-circle" width="18px" height="18px"
                             src={member.profileImageUrl}/><span className="gray-dark"> {member.name}</span>
                        <sup className="cyan"><strong> owner</strong></sup>
                    </div>
                }
            </div>
        );
    }

    serviceElements() {
        return this.props.group.serviceList.map((service) =>
            <a key={service.id}
               type="button" className="list-group-item bg-green-light">
                <div className="row">
                    <div className="col-xs-10" onClick={() => {
                        hashHistory.push("main/group/" + this.props.group.id + "/service/" + service.id + "/usage")
                    }}>
                        <div><i className="fa fa-line-chart gray-dark"
                                aria-hidden="true"></i><b> {service.label}</b>
                        </div>
                        <div>
                            <small className="gray-dark">{service.desc}</small>
                        </div>
                    </div>
                    <div className="col-xs-2">
                        <button type="button" className="btn btn-info btn-xs pull-right"
                                aria-expanded="false" onClick={() => this.retractServiceConfirmation(service)}>
                            <i className="fa fa-chain-broken" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                {this.state.serviceToRetract != null && this.state.serviceToRetract.id == service.id ?
                    this.renderRetractServiceConfirmation(service) :
                    <div></div>}
            </a>
        );
    }

    retractServiceConfirmation(service) {
        if (this.state.serviceToRetract != null && this.state.serviceToRetract.id == service.id) {
            this.setState({serviceToRetract: null, retractingServiceMsg: null});
        } else {
            this.setState({serviceToRetract: service, retractingServiceMsg: null});
        }
    }

    renderRetractServiceConfirmation(service) {
        return (
            <div>
                {!this.state.retractingService ?
                    <div className="row">
                        <div className="col-xs-9 col-lg-11"><h5 className="pull-right">Retract service from group
                            ? </h5></div>
                        <div className="col-xs-3 col-lg-1">
                            <button type="button" className="btn btn-default pull-right" aria-expanded="false"
                                    onClick={() => this.retractService(service, this.props.group.id)}>
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
                {this.state.retractingServiceMsg != null ?
                    <div className="row">
                        <div className="col-xs-12">
                            <span className="pull-right red-gray margin-top-05">{this.state.retractingServiceMsg}</span>
                        </div>
                    </div> :
                    <div></div>
                }
            </div>
        )
    }

    render() {
        console.debug("Group Content render");
        if (!this.props.group) {
            return (
                <div className="container">
                    <div id="mobilePanelId" className="panel panel-default">
                        <div className="panel-body">
                            <div className="alert alert-warning" role="alert">Group does not exist</div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-xs-8">
                                <h4>
                                    <i className="fa fa-television blue-light" aria-hidden="true"></i>
                                    <span> Group panel</span>
                                </h4>
                            </div>
                            <div className="col-xs-4">
                                <div className="btn-group pull-right">
                                    <Link to={"main/group/edit/" + this.props.group.id} type="button"
                                          className="btn btn-default" aria-expanded="false">
                                        <i className="fa fa-pencil-square blue-light" aria-hidden="true"></i> Edit group
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div>
                            <i className="fa fa-cubes gray-dark" aria-hidden="true"></i>
                            <small className="gray-dark"> Group: <strong> {this.props.group.label}</strong>
                            </small>
                        </div>
                    </div>
                </div>
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-body">
                        <div>
                            <div className="row">
                                <div className="col-xs-6">
                                    <h4 className="pull-left"><i className="fa fa-user-circle" aria-hidden="true"></i>
                                        <span> Members</span></h4>
                                </div>
                                <div className="col-xs-6">
                                    <div className="btn-group pull-right">
                                        <Link to={"main/group/" + this.props.group.id + "/member"} type="button"
                                              className="btn btn-default" aria-expanded="false">
                                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Edit users
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                {this.memberElements()}
                            </div>
                        </div>
                        <hr/>
                        <div>
                            <div className="row margin-top-2vh">
                                <div className="col-xs-6">
                                    <h4 className="pull-left"><i className="fa fa-cogs" aria-hidden="true"></i>
                                        <span> Services</span>
                                    </h4>
                                </div>
                                <div className="col-xs-6">
                                    <div className="btn-group pull-right">
                                        <Link to={"main/service/add/" + this.props.group.id} type="button"
                                              className="btn btn-success" aria-expanded="false">
                                            <i className="fa fa-plus-circle" aria-hidden="true"></i> Add service
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="serviceListPanelBodyId" className="panel-body">
                            <div id="groupListId" className="list-group margin-top-05">
                                {this.serviceElements()}
                            </div>
                            {this.props.group.serviceList.length == 0 ?
                                <div className="alert alert-info" role="alert">
                                    <i className="fa fa-info-circle" aria-hidden="true"></i>
                                    <span> You have no services. Please, add a new one</span>
                                </div>
                                :
                                <div></div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupContent);