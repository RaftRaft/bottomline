import {createStore} from "redux";
import all from "../reducers/all";

var defaultState = {
    login: {
        currentUser: null
    },
    main: {
        group: {
            show: true,
            showGroupList: true,
            showGroupContent: false,
            showGroupEdit: false
        },
        service: {
            show: false
        }
    }
};

export const store = createStore(all, defaultState)
