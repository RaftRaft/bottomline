import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, hashHistory, IndexRoute} from "react-router";
import {createStore} from "redux";
import {Provider} from "react-redux";
import App from "./components/App.jsx";
import GoogleLogin from "./components/GoogleLogin.jsx";
import Main from "./components/Main.jsx";
import Group from "./components/Group.jsx";
import GroupList from "./components/GroupList.jsx";
import GroupEdit from "./components/GroupEdit.jsx";
import GroupAdd from "./components/GroupAdd.jsx";
import GroupContent from "./components/GroupContent.jsx";
import ServiceAdd from "./components/ServiceAdd.jsx";
import MeasurementItem from "./components/MeasurementItem.jsx";
import {store} from "./redux/store/store";

ReactDOM.render((
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={GoogleLogin}/>
                <Route path="main" component={Main}>
                    <Route path="group" component={Group}>
                        <IndexRoute component={GroupList}/>
                        <Route path="content/:index" component={GroupContent}/>
                        <Route path="edit/:index" component={GroupEdit}/>
                        <Route path="add" component={GroupAdd}/>
                        <Route path=":groupId/service/add" component={ServiceAdd}/>
                        <Route path=":groupId/service/:serviceId/mu/add" component={MeasurementItem}/>
                    </Route>
                </Route>
            </Route>
        </Router>
    </Provider>
), document.getElementById('app'))
