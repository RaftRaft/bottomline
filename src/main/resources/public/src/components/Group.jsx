import React from "react";

class Group extends React.Component {

    constructor(props) {
        super(props);
        console.debug("Group construct");
    }

    render() {
        console.debug("Group render");
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}

export default Group;