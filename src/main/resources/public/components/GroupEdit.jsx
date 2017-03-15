import React from "react";
import GroupStore from "../flux/stores/GroupStore";
import GroupListStore from "../flux/stores/GroupListStore";
import GroupActions from "../flux/actions/GroupActions";

class Group extends React.Component {

    constructor(props) {
        super(props);
        this.state = GroupStore.getStore();
        this.onChange = this.onChange.bind(this);
    }

    render() {
        if (this.state.show.showGroupList) {
            return (
                <GroupList/>
            );
        }
        else if (this.state.show.showGroupEdit) {
            return (
                <GroupEdit/>
            );
        }
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

    constructor(props) {
        super(props);
        this.state = GroupListStore.getStore();
        this.onChange = this.onChange.bind(this);
        this.groupElements = this.groupElements.bind(this);
    }

    componentDidMount() {
        GroupListStore.addChangeListener(this.onChange);
        GroupListStore.loadGroupList();
    }

    componentWillUnmount() {
        GroupListStore.removeChangeListener(this.onChange);
    }

    onChange() {
        console.debug("Update GroupList state");
        this.setState(GroupListStore.getStore());
    }

    groupElements() {
        return GroupListStore.getStore().groupList.map((group) =>
            <button key={group.id} type="button" className="list-group-item">
                <div><b>{group.label}</b></div>
                <div>{group.desc}</div>
            </button>
        );
    }

    render() {
        return (
            <div className="container">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-6"><h5><i className="fa fa-th-large cyan" aria-hidden="true"></i>
                                <span> Your Groups</span>
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
                    <div id="groupListPanelBodyId" className="panel-body">
                        {this.state.show.loading ?
                            <div className="text-align-center"><i className="fa fa-spinner fa-spin"
                                                                  aria-hidden="true"></i> Loading</div>
                            :
                            <div id="groupListId" className="list-group">
                                {this.groupElements()}
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

class GroupDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.state = GroupDisplayStore.getStore();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        GroupListStore.addChangeListener(this.onChange);
        GroupListStore.loadGroupList();
    }

    componentWillUnmount() {
        GroupListStore.removeChangeListener(this.onChange);
    }

    onChange() {
        console.debug("Update GroupList state");
        this.setState(GroupListStore.getStore());
    }

    groupElements() {
        return GroupListStore.getStore().groupList.map((group) =>
            <button key={group.id} type="button" className="list-group-item">
                <div><b>{group.label}</b></div>
                <div>{group.desc}</div>
            </button>
        );
    }

    render() {
        return (
            <div className="container">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-6"><h5><i className="fa fa-th-large cyan" aria-hidden="true"></i>
                                <span> Your Groups</span>
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
                    <div id="groupListPanelBodyId" className="panel-body">
                        {this.state.show.loading ?
                            <div className="text-align-center"><i className="fa fa-spinner fa-spin"
                                                                  aria-hidden="true"></i> Loading</div>
                            :
                            <div id="groupListId" className="list-group">
                                {this.groupElements()}
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

class GroupEdit extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-6"><h5><i className="fa fa-th-large cyan" aria-hidden="true"></i>
                                Your
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
            </div>
        )
    }
}

export default Group;