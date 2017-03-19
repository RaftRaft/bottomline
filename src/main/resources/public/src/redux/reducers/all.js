import {combineReducers} from "redux";

import login from "./login";
import main from "./main";


const all = combineReducers({
    login, main
})

export default all