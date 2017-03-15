import React from "react";
import GroupContentStore from "../flux/stores/GroupContentStore";

class GroupContent extends React.Component {

    constructor(props) {
        super(props);
        GroupContentStore.getStore().group = this.props.group;
        this.state = GroupContentStore.getStore();
        this.onChange = this.onChange.bind(this);
        this.memberElements = this.memberElements.bind(this);
        this.serviceElements = this.serviceElements.bind(this);
    }

    componentDidMount() {
        GroupContentStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        GroupContentStore.removeChangeListener(this.onChange);
    }

    onChange() {
        console.debug("Update GroupContent state");
        this.setState(GroupContentStore.getStore());
    }

    memberElements() {
        return GroupContentStore.getStore().group.memberList.map((member) =>
            <div key={member.id} className="col-lg-4 col-xs-6 margin-top-05">
                <div>
                    <img className="img-circle" width="18px" height="18px" src={member.profileImageUrl}/> {member.name}
                </div>
            </div>
        );
    }

    serviceElements() {
        return GroupContentStore.getStore().group.serviceList.map((service) =>

            <button key={service.id} type="button" className="list-group-item">
                <div><b>{service.label}</b></div>
                <div>{service.desc}</div>
            </button>
        );
    }

    render() {
        console.debug("Render Group Content component");
        return (
            <div className="container">
                <div id="mobilePanelId" className="panel panel-default">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-6"><h5><i className="fa fa-th-large cyan" aria-hidden="true"></i>
                                <span> <b>{GroupContentStore.getStore().group.label}</b></span>
                            </h5>
                            </div>
                            <div className="col-xs-6">
                                <div className="btn-group pull-right">
                                    <button type="button" className="btn btn-success" aria-expanded="false"
                                            onClick={() => GroupActions.showGroupEdit()}>
                                        <i className="fa fa-pencil-square" aria-hidden="true"></i> Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="panel-body">
                        <div>
                            <h4><i className="fa fa-user-circle" aria-hidden="true"></i> Members</h4>
                            <div className="row">
                                {this.memberElements()}
                            </div>
                        </div>
                        <hr/>
                        <div>
                            <h4><i className=" fa fa-cogs" aria-hidden=" true"></i> Services</h4>
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

export default GroupContent;