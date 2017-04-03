import Constants from "../../common/Constants";

const serviceUsage = (state = {}, action) => {
    switch (action.type) {
        case Constants.SET_SERVICE_USAGE_SHOW_FILTER:
            console.debug("Reducer Service shows filter");
            return Object.assign({}, state, {
                filter: Object.assign({}, state.filter, {
                    show: action.show
                })
            })
        case Constants.SET_SERVICE_USAGE_CONSUMPTION_FILTER:
            console.debug("Reducer Service sets consumption filter");
            return Object.assign({}, state, {
                filter: Object.assign({}, state.filter, {
                    showConsumption: action.showConsumption
                })
            })
        case Constants.SET_SERVICE_USAGE_DATE_FILTER:
            console.debug("Reducer Service sets date filter");
            return Object.assign({}, state, {
                filter: Object.assign({}, state.filter, {
                    date: action.date
                })
            })
        case Constants.SET_SERVICE_USAGE_LIST:
            console.debug("Reducer sets list of service usage");
            return Object.assign({}, state, {
                list: action.list
            })
        default:
            return state
    }
}

export default serviceUsage