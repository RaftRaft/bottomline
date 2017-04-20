import Constants from "../../common/Constants";

const serviceElement = (service = {}, action) => {
    switch (action.type) {
        case Constants.ADD_ITEM:
            return Object.assign({}, service, {
                itemList: [
                    ...service.itemList,
                    action.item
                ]
            })
        case Constants.EDIT_ITEM:
            return Object.assign({}, service, {
                itemList: service.itemList.map(t => {
                    if (t.id == action.item.id) {
                        return Object.assign({}, t, action.item);
                    } else {
                        return Object.assign({}, t);
                    }
                })
            })
        case Constants.REMOVE_ITEM:
            return Object.assign({}, service, {
                itemList: service.itemList.filter(t => {
                    return t.id != action.itemId
                })
            })
        default:
            return service
    }
}

const service = (state = {}, action) => {
    switch (action.type) {
        case Constants.SET_SERVICE_LIST:
            return Object.assign({}, state, {
                list: action.list
            })
        case Constants.ADD_SERVICE:
            return Object.assign({}, state, {
                list: [
                    ...state.list,
                    action.service
                ]
            })
        case Constants.EDIT_SERVICE:
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
            return Object.assign({}, state, {
                list: state.list.filter(t => {
                    return t.id != action.serviceId
                })
            })
        case Constants.ADD_ITEM:
            return Object.assign({}, state, {
                list: state.list.map(t => {
                    if (t.id == action.serviceId) {
                        return serviceElement(t, action)
                    } else {
                        return Object.assign({}, t)
                    }
                })
            })
        case Constants.REMOVE_ITEM:
            return Object.assign({}, state, {
                list: state.list.map(t => {
                    return serviceElement(t, action)
                })
            })
        case Constants.EDIT_ITEM:
            return Object.assign({}, state, {
                list: state.list.map(t => {
                    return serviceElement(t, action)
                })
            })
        default:
            return state
    }
}

export default service