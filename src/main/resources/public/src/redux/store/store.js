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
            list: []
        },
        serviceUsage: {
            list: [],
            filter: {
                show: false,
                item: null,
                date: new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 365)).toISOString(),
                showConsumption: false
            }
        }
    }
};

export const store = createStore(all, defaultState)

store.subscribe(() =>
    console.debug("Store state: " + JSON.stringify(store.getState().main, null, 2))
)