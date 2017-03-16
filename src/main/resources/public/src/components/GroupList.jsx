import React from "react";
import GroupListStore from "../flux/stores/GroupListStore";
import GroupActions from "../flux/actions/GroupActions";
import {Link} from "react-router";


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
            <Link to="group/group-content" key={group.id}>
                <button type="button" className="list-group-item"
                        onClick={() => GroupActions.showGroupContent(group)}>
                    <div><b>{group.label}</b></div>
                    <div>{group.desc}</div>
                </button>
            </Link>
        );
    }

    render() {
        console.debug("Render Group List component");
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
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
                                        <i className="fa fa-plus-circle" aria-hidden="true"></i> Add new
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

export default GroupList;