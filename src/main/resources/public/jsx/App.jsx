import React from "react";
import Main from "./Main.jsx";
import GoogleLogin from "./GoogleLogin.jsx";
import AppStore from "../flux/stores/AppStore.js";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = AppStore.getStore();
    }

    render() {
        if (this.state.currentUser != null) {
            return (
                <div>
                    <Main currentUser={this.state.currentUser}/>
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

    componentDidMount() {
        AppStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        AppStore.removeChangeListener(this.onChange);
    }

    onChange() {
        console.debug("Update App state");
        this.setState(AppStore.getStore());
    }
}

export default App;