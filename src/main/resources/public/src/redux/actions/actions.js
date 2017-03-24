import Constants from "../../common/Constants";

export const VisibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_ACTIVE: 'SHOW_ACTIVE'
}

export function setCurrentUser(user) {
    console.debug("Invoke set user action");
    return {type: Constants.SET_CURRENT_USER, user};
}

export function setGroupList(list) {
    console.debug("Invoke set list of groups action");
    return {type: Constants.SET_GROUP_LIST, list};
}

export function addGroup(group) {
    console.debug("Invoke add new item action");
    return {type: Constants.ADD_GROUP, group};
}

export function editGroup(group) {
    console.debug("Invoke edit item action ");
    return {type: Constants.EDIT_GROUP, group};
}

export function addService(service, groupId) {
    console.debug("Invoke add new service action for group" + groupId);
    return {type: Constants.ADD_SERVICE, service, groupId};
}

export function addItem(item, serviceId) {
    console.debug("Invoke add new item action for service " + serviceId);
    return {type: Constants.ADD_ITEM, item, serviceId};
}