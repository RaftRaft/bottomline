import React from "react";
import {connect} from "react-redux";
import {hashHistory} from "react-router";
import Header from "./Header.jsx";

function mapStateToProps(state) {
    return {
        login: state.login
    };
}

class Main extends React.Component {

    constructor(props) {
        super(props);
        console.debug("Main construct");
    }

    componentDidMount() {
        if (this.props.login.currentUser == null) {
            hashHistory.push("/");
        }
    }

    render() {
        console.debug("Main render");
        if (this.props.login.currentUser != null) {
            return (
                <div>
                    <Header/>
                    {this.props.children}
                </div>
            )
        }
        return (<div></div>)
    }
}

export default connect(mapStateToProps, null)(Main);