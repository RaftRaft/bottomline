import {combineReducers} from "redux";
import group from "./group";
import service from "./service";
import serviceUsage from "./serviceUsage";


const main = combineReducers({
    group, service, serviceUsage
});

export default main