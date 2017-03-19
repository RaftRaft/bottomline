import {createStore} from "redux";
import all from "../reducers/all";

var defaultState = {
    login: {
        currentUser: null
    },
    main: {
        group: {
            list: []
        },
        service: {
            show: false
        }
    }
};

export const store = createStore(all, defaultState)

store.subscribe(() =>
    console.debug("Store state: " + JSON.stringify(store.getState().main))
)