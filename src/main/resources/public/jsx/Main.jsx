import React from "react";
import MainStore from "../flux/stores/MainStore.js";
import Header from "./Header.jsx";
import Group from "./Group.jsx";

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = MainStore.getStore();
    }

    render() {
        return (
            <div>
                <Header currentUser={this.props.currentUser}/>
                {(this.state.show.showGroup) ?
                    <Group/>
                    :
                    <div>Services</div>
                }
            </div>
        );
    }

    componentDidMount() {
        MainStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        MainStore.removeChangeListener(this.onChange);
    }

    onChange() {
        console.debug("Update Main state");
        this.setState(MainStore.getStore());
    }
}

export default Main;