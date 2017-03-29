import Constants from "../../common/Constants";

const serviceElement = (service = {}, action) => {
    switch (action.type) {
        default:
            return service
    }
}

const service = (state = {}, action) => {
    switch (action.type) {
        case Constants.SET_SERVICE_LIST:
            console.debug("Reducer sets list of services");
            return Object.assign({}, state, {
                list: action.list
            })
        case Constants.EDIT_SERVICE:
            console.debug("Reducer edits service");
            return Object.assign({}, state, {
                list: state.list.map(t => {
                    if (t.id == action.service.id) {
                        return Object.assign({}, action.service)
                    } else {
                        return Object.assign({}, t)
                    }
                })
            })
        case Constants.REMOVE_SERVICE:
            console.debug("Reducer removes service");
            return Object.assign({}, service, {
                list: state.list.filter(t => {
                    return t.id != action.serviceId
                })
            })
        default:
            return state
    }
}

export default service