import Constants from "../../common/Constants";

export const VisibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_ACTIVE: 'SHOW_ACTIVE'
}

export function setCurrentUser(user) {
    return {type: Constants.SET_CURRENT_USER, user};
}

export function setGroupList(list) {
    return {type: Constants.SET_GROUP_LIST, list};
}

export function addGroup(group) {
    return {type: Constants.ADD_GROUP, group};
}

export function editGroup(group) {
    return {type: Constants.EDIT_GROUP, group};
}

export function removeGroup(groupId) {
    return {type: Constants.REMOVE_GROUP, groupId};
}

export function setServiceList(list) {
    return {type: Constants.SET_SERVICE_LIST, list};
}

export function addService(service) {
    return {type: Constants.ADD_SERVICE, service};
}

export function addServiceForGroup(service, groupId) {
    return {type: Constants.ADD_SERVICE_FOR_GROUP, service, groupId};
}

export function editService(service) {
    return {type: Constants.EDIT_SERVICE, service};
}

export function removeServiceFromGroup(serviceId, groupId) {
    return {type: Constants.REMOVE_SERVICE_FROM_GROUP, serviceId, groupId};
}

export function removeService(serviceId) {
    return {type: Constants.REMOVE_SERVICE, serviceId};
}

export function addItem(item, serviceId) {
    return {type: Constants.ADD_ITEM, item, serviceId};
}

export function editItem(item) {
    return {type: Constants.EDIT_ITEM, item};
}

export function removeItem(itemId) {
    return {type: Constants.REMOVE_ITEM, itemId};
}

export function showServiceUsageFilter(show) {
    return {type: Constants.SET_SERVICE_USAGE_SHOW_FILTER, show};
}

export function setServiceUsageConsumptionFilter(showConsumption) {
    return {type: Constants.SET_SERVICE_USAGE_CONSUMPTION_FILTER, showConsumption};
}

export function setServiceUsageDateFilter(date) {
    return {type: Constants.SET_SERVICE_USAGE_DATE_FILTER, date};
}

export function resetServiceUsage() {
    return {type: Constants.RESET_SERVICE_USAGE};
}

export function resetServiceUsageFilter() {
    return {type: Constants.RESET_SERVICE_USAGE_FILTER};
}

export function addItemToServiceUsageFilter(itemId) {
    return {type: Constants.ADD_ITEM_TO_SERVICE_USAGE_FILTER, itemId};
}

export function removeItemFromServiceUsageFilter(itemId) {
    return {type: Constants.REMOVE_ITEM_FROM_SERVICE_USAGE_FILTER, itemId};
}

export function setServiceUsageList(list) {
    return {type: Constants.SET_SERVICE_USAGE_LIST, list};
}

export function setServiceUsageTotalItemCount(count) {
    return {type: Constants.SET_SERVICE_USAGE_TOTAL_ITEM_COUNT, count};
}

export function setServiceUsageActivePage(page) {
    return {type: Constants.SET_SERVICE_USAGE_ACTIVE_PAGE, page};
}

export function setServiceUsageChartData(data) {
    return {type: Constants.SET_SERVICE_USAGE_CHART_DATA, data};
}

export function fetchServiceUsageChartData(val) {
    return {type: Constants.FETCH_SERVICE_USAGE_CHART_DATA, val};
}

export function showServiceUsageChart(val) {
    return {type: Constants.SHOW_SERVICE_USAGE_CHART, val};
}

export function removeMemberFromGroup(memberId, groupId) {
    return {type: Constants.REMOVE_MEMBER_FROM_GROUP, memberId, groupId};
}