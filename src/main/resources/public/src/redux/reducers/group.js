import Constants from "../../common/Constants";

const service = (group, action) => {
    switch (action.type) {
        case Constants.ADD_SERVICE:
            return Object.assign({}, group, {
                serviceList: [
                    ...group.serviceList,
                    action.service
                ]
            })
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
                        return t;
                    }
                })
            })
        case Constants.ADD_SERVICE:
            console.debug("Reducer adds service: " + action.service + " for group id " + action.groupId);
            return Object.assign({}, state, {
                list: state.list.map(t => {
                    if (t.id == action.groupId) {
                        return service(t, action)
                    } else {
                        return t;
                    }
                })
            })
        default:
            return state
    }
}

export default group