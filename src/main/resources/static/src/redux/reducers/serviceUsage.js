import Constants from "../../common/Constants";

const serviceUsage = (state = {}, action) => {
    switch (action.type) {
        case Constants.RESET_SERVICE_USAGE:
            return Object.assign({}, state, {
                list: [],
                totalItemsCount: 0,
                activePage: 1,
                filter: {
                    show: false,
                    itemIdList: [],
                    date: new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 365)).toISOString(),
                    showConsumption: true
                },
                chart: Object.assign({}, state.chart, {
                    show: true,
                    fetchData: false,
                    config: Object.assign({}, state.chart.config, {
                        series: []
                    })
                })
            })
        case Constants.RESET_SERVICE_USAGE_FILTER:
            return Object.assign({}, state, {
                filter: {
                    show: false,
                    itemIdList: [],
                    date: new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 365)).toISOString(),
                    showConsumption: false
                }
            })
        case Constants.SET_SERVICE_USAGE_SHOW_FILTER:
            return Object.assign({}, state, {
                filter: Object.assign({}, state.filter, {
                    show: action.show
                })
            })
        case Constants.SET_SERVICE_USAGE_CONSUMPTION_FILTER:
            return Object.assign({}, state, {
                filter: Object.assign({}, state.filter, {
                    showConsumption: action.showConsumption
                })
            })
        case Constants.SET_SERVICE_USAGE_DATE_FILTER:
            return Object.assign({}, state, {
                filter: Object.assign({}, state.filter, {
                    date: action.date
                })
            })
        case Constants.ADD_ITEM_TO_SERVICE_USAGE_FILTER:
            return Object.assign({}, state, {
                filter: Object.assign({}, state.filter, {
                    itemIdList: [
                        ...state.filter.itemIdList,
                        action.itemId
                    ]
                })
            })
        case Constants.REMOVE_ITEM_FROM_SERVICE_USAGE_FILTER:
            return Object.assign({}, state, {
                filter: Object.assign({}, state.filter, {
                    itemIdList: state.filter.itemIdList.filter(t => {
                        return t != action.itemId
                    })
                })
            })
        case Constants.SET_SERVICE_USAGE_LIST:
            return Object.assign({}, state, {
                list: action.list
            })
        case Constants.SET_SERVICE_USAGE_TOTAL_ITEM_COUNT:
            return Object.assign({}, state, {
                totalItemsCount: action.count
            })
        case Constants.SET_SERVICE_USAGE_ACTIVE_PAGE:
            return Object.assign({}, state, {
                activePage: action.page
            })
        case Constants.SET_SERVICE_USAGE_CHART_DATA:
            return Object.assign({}, state, {
                chart: Object.assign({}, state.chart, {
                    config: Object.assign({}, state.chart.config, {
                        series: action.data
                    })
                })
            })
        case Constants.FETCH_SERVICE_USAGE_CHART_DATA:
            return Object.assign({}, state, {
                chart: Object.assign({}, state.chart, {
                    fetchData: action.val
                })
            })
        case Constants.SHOW_SERVICE_USAGE_CHART:
            return Object.assign({}, state, {
                chart: Object.assign({}, state.chart, {
                    show: action.val
                })
            })
        default:
            return state
    }
}

export default serviceUsage