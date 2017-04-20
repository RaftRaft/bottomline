import React from "react";
import ReactDOM from "react-dom";
import {hashHistory, IndexRoute, Route, Router} from "react-router";
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
import Service from "./components/Service.jsx";
import ServiceList from "./components/ServiceList.jsx";
import ServiceAdd from "./components/ServiceAdd.jsx";
import ServiceEdit from "./components/ServiceEdit.jsx";
import MeasurementItem from "./components/MeasurementItem.jsx";
import ServiceUsage from "./components/ServiceUsage.jsx";
import ServiceUsageEdit from "./components/ServiceUsageEdit.jsx";
import MemberList from "./components/MemberList.jsx";
import MemberInvite from "./components/MemberInvite.jsx";


import {store} from "./redux/store/store";

ReactDOM.render((
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={GoogleLogin}/>
                <Route path="main" component={Main}>
                    <Route path="group" component={Group}>
                        <IndexRoute component={GroupList}/>
                        <Route path="content/:groupId" component={GroupContent}/>
                        <Route path="edit/:groupId" component={GroupEdit}/>
                        <Route path="add" component={GroupAdd}/>
                        <Route path=":groupId/service/:serviceId/usage" component={ServiceUsage}/>
                        <Route path=":groupId/service/:serviceId/usage/edit/(:usageId)" component={ServiceUsageEdit}/>
                        <Route path=":groupId/member" component={MemberList}/>
                        <Route path=":groupId/member/invite" component={MemberInvite}/>
                    </Route>
                    <Route path="service" component={Service}>
                        <Route path="list" component={ServiceList}/>
                        <Route path="add/(:groupId)" component={ServiceAdd}/>
                        <Route path=":serviceId/mi" component={MeasurementItem}/>
                        <Route path=":serviceId/edit" component={ServiceEdit}/>
                    </Route>
                </Route>
            </Route>
            <Route path="/(:invitationCode)" component={App}>
                <IndexRoute component={GoogleLogin}/>
            </Route>
        </Router>
    </Provider>
), document.getElementById('app'))
