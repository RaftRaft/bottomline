import React from "react";
import {Link} from "react-router";
import * as actionCreators from "../redux/actions/actions";
// import todoApp from '../redux/reducers/todoApp'
import {createStore, bindActionCreators} from "redux";
import {connect} from "react-redux";


function mapStateToProps(state, ownProps) {
    console.log("OK " + ownProps.params.filter);
    return {todos: state.todos};
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(actionCreators, dispatch)};
}

// var defaultState = {
//     todos: {
//         items: []
//     },
//     visibilityFilter: "SHOW_ME"
// };
//
// var store = createStore(todoApp, defaultState);

class Test extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {

        // store.subscribe(() => {
        //     console.debug("Store: " + JSON.stringify(store.getState()));
        // });
        // addTodo("test");
        console.log(this.props.actions);
        console.log(this.props.todos);
    }

    render() {
        console.log("Render" + JSON.stringify(this.props.todos));
        return (
            <div>
                <a href="#" onClick={() => this.props.actions.addTodo("zzzz")}>Go</a>
            </div>
        )
    }
}

export default  connect(mapStateToProps, mapDispatchToProps)(Test);