import React from "react";
import {connect} from "react-redux";
import {Link, hashHistory} from "react-router";
import {addGroup} from "../api.js";

function mapStateToProps(state) {
    return {login: state.login};
}

class GroupAdd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            msg: "A group can be a house",
            groupId: null
        }
        this.data = {
            group: {
                label: null,
                desc: null
            }
        }
        this.handleLabelChange = this.handleLabelChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.submit = this.submit.bind(this);
        console.debug("Group add construct");
    }

    handleLabelChange(event) {
        this.data.group = Object.assign({}, this.data.group, {
            label: event.target.value
        })
    }

    handleDescChange(event) {
        this.data.group = Object.assign({}, this.data.group, {
            desc: event.target.value
        })
    }

    submit() {
        console.debug("Form: " + JSON.stringify(this.data.group));
        this.setState({loading: true});
        addGroup(JSON.stringify(this.data.group), this.props.login.currentUser.id).then((resolve) => {
            console.debug(resolve);
            this.setState({
                loading: false,
                groupId: resolve.responseText
            });
            hashHistory.push("main/group/content/" + this.state.groupId);
        }).catch((err) => {
            console.error(err.statusText);
            this.setState({loading: false, msg: err.responseText});
        });
    }

    render() {
        console.debug("Group add render");
        return (
            <div className="container">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-12"><h5><i className="fa fa-plus-circle cyan"
                                                              aria-hidden="true"></i>
                                <span> <strong>Add new group</strong></span>
                            </h5>
                            </div>
                        </div>
                    </div>
                    <div className="panel-body">
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
                            </div>
                        }
                        <form>
                            <div className="input-group col-xs-8 col-lg-4">
                                <label>Label
                                    <sup> <i className="fa fa-star red" aria-hidden="true"></i></sup>
                                </label>
                                <input type="text" className="form-control" maxLength="50"
                                       placeholder="Happy tree friends" onChange={this.handleLabelChange}
                                       aria-describedby="basic-addon1"/>
                            </div>
                            <div className="input-group col-xs-12 col-lg-6 margin-top-05">
                                <label>Description</label>
                                <textarea className="form-control" maxLength="256" rows="3" placeholder="Some desc"
                                          onChange={this.handleDescChange}></textarea>
                            </div>
                            <div className="row margin-top-2vh">
                                <div className="col-xs-6">
                                    <Link to="main/group" type="button" className="btn btn-default pull-left"
                                          aria-expanded="false">
                                        <i className="fa fa-chevron-left" aria-hidden="true"></i> Groups
                                    </Link>
                                </div>
                                <div className="col-xs-6">
                                    <button type="button" className="btn btn-info pull-right"
                                            aria-expanded="false" onClick={() => this.submit()}>
                                        <i className="fa fa-check" aria-hidden="true"></i> Done
                                    </button>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(GroupAdd);