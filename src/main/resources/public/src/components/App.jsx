import React from "react";
import {connect} from "react-redux";

class App extends React.Component {

    constructor(props) {
        super(props);
        console.debug("App construct");
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}

export default connect()(App);