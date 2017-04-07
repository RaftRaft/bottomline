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
        case Constants.ADD_ITEM_TO_SERVICE_USAGE_FILTER:
            console.debug("Reducer adds items to service usage filter");
            return Object.assign({}, state, {
                filter: Object.assign({}, state.filter, {
                    itemIdList: [
                        ...state.filter.itemIdList,
                        action.itemId
                    ]
                })
            })
        case Constants.REMOVE_ITEM_FROM_SERVICE_USAGE_FILTER:
            console.debug("Reducer adds items to service usage filter");
            return Object.assign({}, state, {
                filter: Object.assign({}, state.filter, {
                    itemIdList: state.filter.itemIdList.filter(t => {
                        return t != action.itemId
                    })
                })
            })
        case Constants.SET_SERVICE_USAGE_LIST:
            console.debug("Reducer sets list of service usage");
            return Object.assign({}, state, {
                list: action.list
            })
        case Constants.SET_SERVICE_USAGE_TOTAL_ITEM_COUNT:
            console.debug("Reducer Service sets total item count");
            return Object.assign({}, state, {
                totalItemsCount: action.count
            })
        case Constants.SET_SERVICE_USAGE_ACTIVE_PAGE:
            console.debug("Reducer Service sets active page");
            return Object.assign({}, state, {
                activePage: action.page
            })
        case Constants.SET_SERVICE_USAGE_CHART_DATA:
            console.debug("Reducer sets service usage chart data");
            return Object.assign({}, state, {
                chart: Object.assign({}, state.chart, {
                    config: Object.assign({}, state.chart.config, {
                        series: action.data
                    })
                })
            })
        default:
            return state
    }
}

export default serviceUsage