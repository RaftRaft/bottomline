import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Link} from "react-router";
import {selectGroup, selectService} from "../common/Helper";

function mapStateToProps(state, ownProps) {
    return {
        group: selectGroup(state.main.group.list, ownProps.params.groupId),
        service: selectService(selectGroup(state.main.group.list, ownProps.params.groupId).serviceList, ownProps.params.serviceId)
    }
}

class ServiceUsage extends React.Component {

    constructor(props) {
        super(props);
        console.debug("Service usage construct");
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
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ServiceUsage);