import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Link} from "react-router";
import * as actionCreators from "../redux/actions/actions";
import {selectGroup, selectService} from "../common/Helper";
import {getServiceUsage} from "../common/api.js";
import Constants from "../common/Constants";

function mapStateToProps(state, ownProps) {
    return {
        login: state.login,
        group: selectGroup(state.main.group.list, ownProps.params.groupId),
        service: selectService(selectGroup(state.main.group.list, ownProps.params.groupId).serviceList, ownProps.params.serviceId),
        serviceUsage: state.main.serviceUsage
    }
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(actionCreators, dispatch)};
}

class ServiceUsage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            msg: "Service usage list"
        }
        this.serviceUsageElements = this.serviceUsageElements.bind(this);
        console.debug("Service usage construct");
    }

    componentDidMount() {
        this.setState({loading: true});
        getServiceUsage(this.props.group.id, this.props.service.id, 0, Constants.MAX_RESULTS, this.props.login.currentUser.id).then((resolve) => {
            this.props.actions.setServiceUsageList(JSON.parse(resolve.responseText));
            if (JSON.parse(resolve.responseText).length != 0) {
                this.setState({loading: false});
            } else {
                this.setState({loading: false, msg: "You have no service usages. Please, add one"});
            }
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

    serviceUsageElements() {
        return this.props.serviceUsage.list.map((serviceUsage) =>
            <Link key={serviceUsage.id} to={"main/service/" + serviceUsage.id + "/edit"} type="button"
                  className="list-group-item">
                <div><b>{serviceUsage.index}</b></div>
                <div>
                    <small className="gray-dark">{serviceUsage.desc}</small>
                </div>
            </Link>
        );
    }

    render() {
        console.debug("Service usage render");
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-6">
                                <h5><i className="fa fa-cogs cyan" aria-hidden="true"></i>
                                    <span> <strong>Service usage</strong></span>
                                </h5>
                            </div>
                            <div className="col-xs-6">
                                <div className="btn-group pull-right">
                                    <Link
                                        to={"main/service/" + this.props.service.id + "/edit"} type="button"
                                        className="btn btn-default" aria-expanded="false">
                                        <i className="fa fa-pencil-square" aria-hidden="true"></i> Service Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-xs-9">
                                <h4><i className="fa fa-area-chart cyan"
                                       aria-hidden="true"></i> {this.props.service.label}
                                </h4>
                            </div>
                            <div className="col-xs-3">
                                <Link
                                    to={"main/group/" + this.props.group.id + "/service/" + this.props.service.id + "/usage/edit/"}
                                    type="button" className="btn btn-info pull-right" aria-expanded="false"> New
                                </Link>
                            </div>
                        </div>
                        <hr/>
                        <div id="groupListId" className="list-group">
                            {this.serviceUsageElements()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceUsage);