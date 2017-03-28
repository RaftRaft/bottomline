import React from "react";

class Service extends React.Component {

    constructor(props) {
        super(props);
        console.debug("Service construct");
    }

    render() {
        console.debug("Service render");
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}

export default Service;