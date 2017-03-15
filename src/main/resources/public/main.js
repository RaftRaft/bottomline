import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, browserHistory, IndexRoute} from "react-router";
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';

import {createStore} from "redux";
import {Provider} from "react-redux";
import App from "./components/App.jsx";
import GoogleLogin from "./components/GoogleLogin.jsx";
import Main from "./components/Main.jsx";
import Group from "./components/Group.jsx";
import Test1 from "./components/Test1.jsx";

import {store} from "./redux/store/store";

ReactDOM.render((
    <Provider store={store}>
        <Router history={syncHistoryWithStore(browserHistory, store)}>
            <Route path="/" component={App}>
                <IndexRoute component={GoogleLogin}/>
                <Route path="main" component={Main}>
                    <IndexRoute component={Group}/>
                    <Route path="group/:name" component={Group}/>
                    <Route path="test/:name" component={Test1}/>
                </Route>
            </Route>
        </Router>
    </Provider>
), document.getElementById('app'))
