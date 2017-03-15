import React from "react";
import {connect} from "react-redux";
import GroupList from "./GroupList.jsx";
import GroupEdit from "./GroupEdit.jsx";
import GroupContent from "./GroupContent.jsx";

function mapStateToProps(state, ownProps) {
    console.debug("Params: " + ownProps.params);
    console.debug("Store: " + JSON.stringify(state));
    return {
        group: state.main.group
    };
}

class Group extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        console.debug("Render Group component");
        if (this.props.group.showGroupList) {
            return (
                <GroupList/>
            );
        }
        else if (this.props.group.showGroupEdit) {
            return (
                <GroupEdit/>
            );
        }
        else if (this.props.group.showGroupContent) {
            return (
                <GroupContent/>
            );
        }
    }
}

export default connect(mapStateToProps)(Group);