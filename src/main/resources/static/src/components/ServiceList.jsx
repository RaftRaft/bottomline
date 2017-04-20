import React from "react";
import {hashHistory, Link} from "react-router";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {getServices} from "../common/api.js";
import * as actionCreators from "../redux/actions/actions";
import Constants from "../common/Constants";

function mapStateToProps(state) {
    return {
        service: state.main.service,
        login: state.login
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(actionCreators, dispatch)};
}

class ServiceList extends React.Component {

    constructor(props) {
        super(props);
        this.defaultMsg = "Manage your services";
        this.state = {
            loading: true,
            msg: this.defaultMsg,
            warnMsg: null
        }
        this.serviceElements = this.serviceElements.bind(this);
    }

    componentDidMount() {
        this.setState({loading: true});
        getServices(this.props.login.currentUser.id).then((resolve) => {
            this.props.actions.setServiceList(JSON.parse(resolve.responseText));
            if (JSON.parse(resolve.responseText).length != 0) {
                this.setState({loading: false, warnMsg: null});
            } else {
                this.setState({loading: false, msg: "You have no service. Please, add one", warnMsg: null});
            }
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

    serviceElements() {
        return this.props.service.list.map((service) =>
            <Link to={"main/service/" + service.id + "/edit"} type="button" className="list-group-item bg-green-light"
                  key={service.id}>
                <div><i className="fa fa-cogs blue-light" aria-hidden="true"></i><b> {service.label}</b></div>
                <div>
                    <small className="gray-dark">{service.desc}</small>
                </div>
            </Link>
        );
    }

    render() {
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-xs-6">
                                <h4>
                                    <i className="fa fa-cogs blue-light" aria-hidden="true"></i>
                                    <span> Your Services</span>
                                </h4>
                            </div>
                            <div className="col-xs-6">
                                <div className="btn-group pull-right">
                                    <Link to={"main/service/add/"} type="button" className="btn btn-success"
                                          aria-expanded="false">
                                        <i className="fa fa-plus-circle" aria-hidden="true"></i> New
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        {this.state.loading ?
                            <div>
                                <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                                <small className="gray-dark"> Loading data...</small>
                            </div> :
                            <div>
                                <i className="fa fa-info-circle gray-dark" aria-hidden="true"></i>
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
                <div id="mobilePanelId" className="panel panel-default">
                    <div id="groupListPanelBodyId" className="panel-body">
                        {this.props.service.list.length > 0 ?
                            <div id="groupListId" className="list-group">
                                {this.serviceElements()}
                            </div> :
                            <div className="text-align-center margin-top-2vh margin-bottom-2em">
                                <small className="gray-dark"><strong>Empty service list</strong></small>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceList);