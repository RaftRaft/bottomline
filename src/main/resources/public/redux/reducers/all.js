import {combineReducers} from "redux";
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';

import login from "./login";
import main from "./main";


const all = combineReducers({
    login, main,
    routing: routerReducer
})

export default all