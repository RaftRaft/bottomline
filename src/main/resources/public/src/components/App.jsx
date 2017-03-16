import React from "react";
import {connect} from "react-redux";
import Main from "./Main.jsx";
import GoogleLogin from "./GoogleLogin.jsx";

function mapStateToProps(state) {
    return {login: state.login};
}

class App extends React.Component {

    constructor(props) {
        super(props);
        console.debug("App construct");
    }

    render() {
        // console.debug("Render App. State: " + JSON.stringify(this.props.login));
        if (this.props.login.currentUser != null) {
            return (
                <div>
                    <Main/>
                </div>
            )
        } else {
            return (
                <div>
                    <GoogleLogin/>
                </div>
            )
        }
    }
}

export default connect(mapStateToProps)(App);