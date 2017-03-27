import Constants from "../../common/Constants";

const serviceElement = (service, action) => {
    switch (action.type) {
        case Constants.ADD_ITEM:
            return Object.assign({}, service, {
                itemList: [
                    ...service.itemList,
                    action.item
                ]
            })
        case Constants.REMOVE_ITEM:
            return Object.assign({}, service, {
                itemList: service.itemList.filter(t => {
                    return t.id != action.itemId
                })
            })
    }
}

const groupElement = (group, action) => {
    switch (action.type) {
        case Constants.ADD_SERVICE:
            return Object.assign({}, group, {
                serviceList: [
                    ...group.serviceList,
                    action.service
                ]
            })
        case Constants.EDIT_SERVICE:
            return Object.assign({}, group, {
                serviceList: group.serviceList.map(t => {
                    if (t.id == action.service.id) {
                        return Object.assign({}, t, action.service)
                    } else {
                        return Object.assign({}, t)
                    }
                })
            })
        case Constants.REMOVE_SERVICE:
            return Object.assign({}, group, {
                serviceList: group.serviceList.filter(t => {
                    return t.id != action.serviceId
                })
            })
        case Constants.ADD_ITEM:
            return Object.assign({}, group, {
                serviceList: group.serviceList.map(t => {
                    if (t.id == action.serviceId) {
                        return serviceElement(t, action)
                    } else {
                        return Object.assign({}, t)
                    }
                })
            })
        case Constants.REMOVE_ITEM:
            return Object.assign({}, group, {
                serviceList: group.serviceList.map(t => {
                    if (t.id == action.serviceId) {
                        return serviceElement(t, action)
                    } else {
                        return Object.assign({}, t)
                    }
                })
            })
        default:
            return group
    }
}

const group = (state = {}, action) => {
    switch (action.type) {
        case Constants.SET_GROUP_LIST:
            console.debug("Reducer sets list of groups");
            return Object.assign({}, state, {
                list: action.list
            })
        case Constants.ADD_GROUP:
            console.debug("Reducer adds a new group");
            return Object.assign({}, state, {
                list: [
                    ...state.list,
                    action.group
                ]
            })
        case Constants.EDIT_GROUP:
            console.debug("Reducer edits group");
            return Object.assign({}, state, {
                list: state.list.map(t => {
                    if (t.id == action.group.id) {
                        return Object.assign({}, t, action.group)
                    } else {
                        return Object.assign({}, t)
                    }
                })
            })
        case Constants.ADD_SERVICE:
            console.debug("Reducer adds service: " + action.service + " for group id " + action.groupId);
            return Object.assign({}, state, {
                list: state.list.map(t => {
                    if (t.id == action.groupId) {
                        return groupElement(t, action)
                    } else {
                        return Object.assign({}, t)
                    }
                })
            })
        case Constants.EDIT_SERVICE:
            console.debug("Reducer edits service");
            return Object.assign({}, state, {
                list: state.list.map(t => {
                    return groupElement(t, action)
                })
            })
        case Constants.REMOVE_SERVICE:
            console.debug("Reducer removes service with id " + action.serviceId);
            return Object.assign({}, state, {
                list: state.list.map(t => {
                    return groupElement(t, action)
                })
            })
        case Constants.ADD_ITEM:
            console.debug("Reducer adds item: " + action.item + "for service id " + action.serviceId);
            return Object.assign({}, state, {
                list: state.list.map(t => {
                    return groupElement(t, action)
                })
            })
        case Constants.REMOVE_ITEM:
            console.debug("Reducer removes item with id " + action.itemId + " for service with id " + action.serviceId);
            return Object.assign({}, state, {
                list: state.list.map(t => {
                    return groupElement(t, action)
                })
            })
        default:
            return state
    }
}

export default group