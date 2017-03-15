import React from "react";
import {connect} from "react-redux";
import Header from "./Header.jsx";
import Group from "./Group.jsx";

function mapStateToProps(state) {
    return {
        main: state.main,
        login: state.login
    };
}

class Main extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Header currentUser={this.props.login.currentUser}/>
                {(this.props.main.group.show) ?
                    <Group/>
                    :
                    <div>Services</div>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps)(Main);