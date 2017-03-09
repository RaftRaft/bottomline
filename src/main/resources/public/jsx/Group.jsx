import React from "react";
import GroupStore from "../flux/stores/GroupStore";
import GroupActions from "../flux/actions/GroupActions";

class Group extends React.Component {

    constructor(props) {
        super(props);
        this.state = GroupStore.getStore();
        this.onChange = this.onChange.bind(this);
    }

    render() {
        return (
            <div className="container">
                {this.state.show.showGroupList ?
                    <GroupList/>
                    : this.state.show.showGroupEdit ?
                        <GroupEdit/> : <div></div>}
            </div>
        );
    }

    componentDidMount() {
        GroupStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        GroupStore.removeChangeListener(this.onChange);
    }

    onChange() {
        console.debug("Update Group state");
        this.setState(GroupStore.getStore());
    }
}

class GroupList extends React.Component {
    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <div className="row">
                        <div className="col-xs-6"><h5><i className="fa fa-th-large cyan" aria-hidden="true"></i> <b>Your
                            Groups</b>
                        </h5>
                        </div>
                        <div className="col-xs-6">
                            <div className="btn-group pull-right">
                                <button type="button" className="btn btn-success" aria-expanded="false"
                                        onClick={() => GroupActions.showGroupEdit()}>
                                    Add new
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="groupListId" className="list-group">
                    <button type="button" className="list-group-item">Cras justo odio</button>
                    <button type="button" className="list-group-item">Dapibus ac facilisis in</button>
                    <button type="button" className="list-group-item">Morbi leo risus</button>
                </div>
            </div>
        )
    }
}

class GroupEdit extends React.Component {
    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <div className="row">
                        <div className="col-xs-6"><h5><i className="fa fa-th-large cyan" aria-hidden="true"></i> Your
                            Groups
                        </h5>
                        </div>
                        <div className="col-xs-6">
                        </div>
                    </div>
                </div>
                <div id="groupListId" className="list-group">
                    <button type="button" className="list-group-item">Cras justo odio</button>
                    <button type="button" className="list-group-item">Dapibus ac facilisis in</button>
                    <button type="button" className="list-group-item">Morbi leo risus</button>
                </div>
            </div>
        )
    }
}

export default Group;