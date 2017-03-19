import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Link} from "react-router";
import {selectGroup} from "../common/Helper";

function mapStateToProps(state, ownProps) {
    return {
        group: selectGroup(state.main.group.list, ownProps.params.index)
    }
}

class GroupContent extends React.Component {

    constructor(props) {
        super(props);
        this.memberElements = this.memberElements.bind(this);
        this.serviceElements = this.serviceElements.bind(this);
        console.debug("Group content construct");
    }

    componentWillMount() {
    }

    memberElements() {
        return this.props.group.memberList.map((member) =>
            <div key={member.id} className="col-lg-4 col-xs-6 margin-top-05">
                <div>
                    <img className="img-circle" width="18px" height="18px" src={member.profileImageUrl}/> {member.name}
                </div>
            </div>
        );
    }

    serviceElements() {
        return this.props.group.serviceList.map((service) =>
            <button key={service.id} type="button" className="list-group-item">
                <div><b>{service.label}</b></div>
                <div>{service.desc}</div>
            </button>
        );
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
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-6"><h5><i className="fa fa-th-large cyan" aria-hidden="true"></i>
                                <span> <b>{this.props.group.label}</b></span>
                            </h5>
                            </div>
                            <div className="col-xs-6">
                                <div className="btn-group pull-right">
                                    <Link to={"main/group/edit/" + this.props.group.id} type="button"
                                          className="btn btn-default" aria-expanded="false">
                                        <i className="fa fa-pencil-square" aria-hidden="true"></i> Group Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="panel-body">
                        <div>
                            <div className="row">
                                <div className="col-xs-6">
                                    <h4 className="pull-left"><i className="fa fa-user-circle" aria-hidden="true"></i>
                                        <span> Members</span></h4>
                                </div>
                                <div className="col-xs-6">
                                    <div className="btn-group pull-right">
                                        <Link to={"main/group/edit/" + this.props.group.id} type="button"
                                              className="btn btn-default" aria-expanded="false">
                                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Edit
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-4 col-xs-6 margin-top-05 pull-left">
                                    <img className="img-circle" width="18px" height="18px"
                                         src={this.props.group.owner.profileImageUrl}/>
                                    <span> {this.props.group.owner.name} <sup
                                        className="cyan"><strong>owner</strong></sup></span>
                                </div>
                                {this.memberElements()}
                            </div>
                        </div>
                        <hr/>
                        <div>
                            <div className="row">
                                <div className="col-xs-6">
                                    <h4 className="pull-left"><i className="fa fa-cogs" aria-hidden=" true"></i>
                                        <span> Services</span>
                                    </h4>
                                </div>
                                <div className="col-xs-6">
                                    <div className="btn-group pull-right">
                                        <Link to={"main/group/edit/" + this.props.group.id} type="button"
                                              className="btn btn-default" aria-expanded="false">
                                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Edit
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="serviceListPanelBodyId" className="panel-body">
                            <div id="groupListId" className="list-group">
                                {this.serviceElements()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(GroupContent);