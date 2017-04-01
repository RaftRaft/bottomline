import Constants from "../../common/Constants";

const serviceUsage = (state = {}, action) => {
    switch (action.type) {
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