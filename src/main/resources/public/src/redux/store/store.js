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
            totalItemsCount: 0,
            activePage: 1,
            filter: {
                show: false,
                itemIdList: [],
                date: new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 365)).toISOString(),
                showConsumption: false
            },
            chart: {
                show: false,
                fetchData: false,
                config: {
                    chart: {
                        type: 'area'
                    },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            month: '%e. %b',
                            year: '%b'
                        },
                        title: {
                            text: 'Date'
                        }
                    },
                    series: []
                }
            }
        }
    }
};

export const store = createStore(all, defaultState)

store.subscribe(() =>
    console.debug("Store state: " + JSON.stringify(store.getState().main, null, 2))
)