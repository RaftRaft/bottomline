import React from "react";
import {Link, hashHistory} from "react-router";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {getGroups} from "../api.js";
import * as actionCreators from "../redux/actions/actions";

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
        this.state = {
            fetchGroupList: true,
            msg: "Groups are people"
        }
        this.groupElements = this.groupElements.bind(this);
        console.debug("Group list construct");
    }

    componentDidMount() {
        this.setState({fetchGroupList: true});
        getGroups(this.props.login.currentUser.id).then((resolve) => {
            this.props.actions.setGroupList(JSON.parse(resolve.responseText));
            if (JSON.parse(resolve.responseText).length != 0) {
                this.setState({fetchGroupList: false});
            } else {
                this.setState({fetchGroupList: false, msg: "You have no groups. Please, add one"});
            }
        }).catch((err) => {
            console.error(err.statusText);
            this.setState({fetchGroupList: false, msg: err.responseText});
        });
    }

    groupElements() {
        return this.props.group.list.map((group) =>
            <Link to={"main/group/content/" + group.id} type="button" className="list-group-item" key={group.id}>
                <div><b>{group.label}</b></div>
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
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-6"><h5><i className="fa fa-th-large cyan" aria-hidden="true"></i>
                                <span> <strong>Your Groups</strong></span>
                            </h5>
                            </div>
                            <div className="col-xs-6">
                                <div className="btn-group pull-right">
                                    <Link to={"main/group/add"} type="button" className="btn btn-success"
                                          aria-expanded="false">
                                        <i className="fa fa-plus-circle" aria-hidden="true"></i> Add group
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="groupListPanelBodyId" className="panel-body">
                        {this.state.fetchGroupList ?
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
                                    {this.groupElements()}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupList);