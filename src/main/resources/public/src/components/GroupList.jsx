import React from "react";
import {hashHistory, Link} from "react-router";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {getGroups, getServices} from "../common/api.js";
import * as actionCreators from "../redux/actions/actions";
import Constants from "../common/Constants";

function mapStateToProps(state) {
    return {
        group: state.main.group,
        login: state.login
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(actionCreators, dispatch)};
}

class GroupList extends React.Component {

    constructor(props) {
        super(props);
        this.genericMsg = "Manage your groups";
        this.state = {
            loading: true,
            msg: this.genericMsg,
            warnMsg: null
        }
        this.groupElements = this.groupElements.bind(this);
        console.debug("Group list construct");
    }

    componentDidMount() {
        this.setState({loading: true});

        getServices(this.props.login.currentUser.id).then((resolve) => {
            this.props.actions.setServiceList(JSON.parse(resolve.responseText));
        }).catch((err) => {
            if (err.status == Constants.HttpStatus.BAD_REQUEST) {
                this.setState({loading: false, warnMsg: err.responseText});
            }
            else {
                console.error(err);
                this.setState({loading: false, warnMsg: Constants.GENERIC_ERROR_MSG});
            }
        });

        getGroups(this.props.login.currentUser.id).then((resolve) => {
            this.props.actions.setGroupList(JSON.parse(resolve.responseText));
            if (JSON.parse(resolve.responseText).length != 0) {
                this.setState({loading: false, msg: this.genericMsg, warnMsg: null});
            } else {
                this.setState({loading: false, msg: "You have no groups. Please, add one", warnMsg: null});
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

    groupElements() {
        return this.props.group.list.map((group) =>
            <Link to={"main/group/content/" + group.id} type="button" className="list-group-item bg-green-light"
                  key={group.id}>
                <div>
                    <i className="fa fa-cubes gray-dark" aria-hidden="true"></i>
                    <b> {group.label}</b></div>
                <div>
                    <small className="gray-dark">{group.desc}</small>
                </div>
            </Link>
        );
    }

    render() {
        console.debug("Group list render");
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-xs-3 col-md-5">
                                <img className="pull-right" src={"src/img/bird_blue.png"} width="72px" height="72px"/>
                            </div>
                            <div className="col-xs-9 col-md-7">
                                <h4 className="gray-dark">Welcome,
                                    <small> {this.props.login.currentUser.name}</small>
                                </h4>
                                <h6 className="gray-dark">Start managing your groups, services and service
                                    consumption</h6>
                            </div>
                        </div>
                        <div className="row margin-top-2vh">
                            <div className="col-xs-6">
                                <h4>
                                    <i className="fa fa-cubes blue-light" aria-hidden="true"></i>
                                    <span> Groups</span>
                                </h4>
                            </div>
                            <div className="col-xs-6">
                                <div className="btn-group pull-right">
                                    <Link to={"main/group/add"} type="button" className="btn btn-info"
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
                        <div>
                            {this.props.group.list.length > 0 ?
                                <div id="groupListId" className="list-group">
                                    {this.groupElements()}
                                </div> :
                                <div className="text-align-center margin-top-2vh margin-bottom-2em">
                                    <small className="gray-dark"><strong>Empty group list</strong></small>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupList);