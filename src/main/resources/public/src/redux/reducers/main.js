import {combineReducers} from "redux";
import group from "./group";
import service from "./service";


const main = combineReducers({
    group, service
});

export default main