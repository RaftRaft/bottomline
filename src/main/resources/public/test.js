import React from "react";
import ReactDOM from "react-dom";
import {createStore} from "redux";
import {Provider} from "react-redux";
import {store} from "./redux/store/store";
import Test from "./components/Test.jsx";
import {Router, Route, DefaultRoute, hashHistory, IndexRoute} from "react-router";

ReactDOM.render((
    <Provider store={store}>
        <Router history={hashHistory}>

            <Route path="/(:filter)" component={Test}/>
        </Router>
    </Provider>
), document.getElementById('login'))
