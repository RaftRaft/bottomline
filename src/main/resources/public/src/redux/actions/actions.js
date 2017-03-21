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
    console.debug("Invoke add new group action");
    return {type: Constants.ADD_GROUP, group};
}

export function editGroup(group) {
    console.debug("Invoke edit group action ");
    return {type: Constants.EDIT_GROUP, group};
}