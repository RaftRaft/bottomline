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
    }
}

const groupElement = (group, action) => {
    switch (action.type) {
        case Constants.ADD_SERVICE_FOR_GROUP:
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
        case Constants.REMOVE_SERVICE_FROM_GROUP:
            return Object.assign({}, group, {
                serviceList: group.serviceList.filter(t => {
                    return t.id != action.serviceId
                })
            })
        case Constants.REMOVE_MEMBER_FROM_GROUP:
            return Object.assign({}, group, {
                memberList: group.memberList.filter(t => {
                    return t.id != action.memberId
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
        case Constants.EDIT_ITEM:
            serviceList: group.serviceList.map(t => {
                return serviceElement(t, action)
            })
        case Constants.REMOVE_ITEM:
            return Object.assign({}, group, {
                serviceList: group.serviceList.map(t => {
                    return serviceElement(t, action)
                })
            })
        default:
            return group
    }
}

const group = (state = {}, action) => {
    switch (action.type) {
        case Constants.SET_GROUP_LIST:
            return Object.assign({}, state, {
                list: action.list
            })
        case Constants.ADD_GROUP:
            return Object.assign({}, state, {
                list: [
                    ...state.list,
                    action.group
                ]
            })
        case Constants.EDIT_GROUP:
            return Object.assign({}, state, {
                list: state.list.map(t => {
                    if (t.id == action.group.id) {
                        return Object.assign({}, t, action.group)
                    } else {
                        return Object.assign({}, t)
                    }
                })
            })
        case Constants.REMOVE_GROUP:
            return Object.assign({}, state, {
                list: state.list.filter(t => {
                    return t.id != action.groupId
                })
            })
        case Constants.ADD_SERVICE_FOR_GROUP:
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
            return Object.assign({}, state, {
                list: state.list.map(t => {
                    return groupElement(t, action)
                })
            })
        case Constants.REMOVE_SERVICE:
            return Object.assign({}, state, {
                list: state.list.map(t => {
                    return groupElement(t, action)
                })
            })
        case Constants.REMOVE_SERVICE_FROM_GROUP:
            return Object.assign({}, state, {
                list: state.list.map(t => {
                    if (t.id == action.groupId) {
                        return groupElement(t, action)
                    } else {
                        return Object.assign({}, t)
                    }
                })
            })
        case Constants.REMOVE_MEMBER_FROM_GROUP:
            return Object.assign({}, state, {
                list: state.list.map(t => {
                    if (t.id == action.groupId) {
                        return groupElement(t, action)
                    } else {
                        return Object.assign({}, t)
                    }
                })
            })
        case Constants.ADD_ITEM:
            return Object.assign({}, state, {
                list: state.list.map(t => {
                    return groupElement(t, action)
                })
            })
        case Constants.EDIT_ITEM:
            return Object.assign({}, state, {
                list: state.list.map(t => {
                    return groupElement(t, action)
                })
            })
        case Constants.REMOVE_ITEM:
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