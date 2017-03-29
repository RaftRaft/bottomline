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
        this.state = {
            loading: true,
            msg: "Services are people"
        }
        this.serviceElements = this.serviceElements.bind(this);
        console.debug("Service list construct");
    }

    componentDidMount() {
        this.setState({loading: true});
        getServices(this.props.login.currentUser.id).then((resolve) => {
            this.props.actions.setServiceList(JSON.parse(resolve.responseText));
            if (JSON.parse(resolve.responseText).length != 0) {
                this.setState({loading: false});
            } else {
                this.setState({loading: false, msg: "You have no services. Please, add one"});
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

    serviceElements() {
        return this.props.service.list.map((service) =>
            <Link to={"main/service/" + service.id + "/edit"} type="button" className="list-group-item"
                  key={service.id}>
                <div><b>{service.label}</b></div>
                <div>
                    <small className="gray-dark">{service.desc}</small>
                </div>
            </Link>
        );
    }

    render() {
        console.debug("Service list render");
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-6"><h5><i className="fa fa-cogs cyan" aria-hidden="true"></i>
                                <span> <strong>Your Services</strong></span>
                            </h5>
                            </div>
                            <div className="col-xs-6">
                                <div className="btn-group pull-right">
                                    <Link to={"main/service/add"} type="button" className="btn btn-warning"
                                          aria-expanded="false">
                                        <i className="fa fa-plus-circle" aria-hidden="true"></i> Add service
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="groupListPanelBodyId" className="panel-body">
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
                                <div id="groupListId" className="list-group">
                                    {this.serviceElements()}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceList);