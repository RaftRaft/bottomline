import Constants from "./Constants";

export function addUser(user) {
    console.debug("API: add user");
    return genericAPICall("POST", Constants.SERVER_ADDRESS + "/user", user.id, user);
}

export function addGroup(group, userId) {
    console.debug("API: add group for user");
    return genericAPICall("POST", Constants.SERVER_ADDRESS + "/group", userId, group);
}

export function updateGroup(group, userId) {
    console.debug("API: update group for user");
    return genericAPICall("PUT", Constants.SERVER_ADDRESS + "/group", userId, group);
}

export function getGroups(userId) {
    console.debug("API: get groups for user");
    return genericAPICall("GET", Constants.SERVER_ADDRESS + "/group", userId);
}

export function removeGroup(groupId, userId) {
    console.debug("API: remove group for user");
    return genericAPICall("DELETE", Constants.SERVER_ADDRESS + "/group/" + groupId, userId);
}

export function addServiceForGroup(service, groupId, userId) {
    console.debug("API: add service for group and user");
    return genericAPICall("POST", Constants.SERVER_ADDRESS + "/service/group/" + groupId, userId, service);
}

export function addService(service, userId) {
    console.debug("API: add service for user");
    return genericAPICall("POST", Constants.SERVER_ADDRESS + "/service", userId, service);
}

export function updateService(service, userId) {
    console.debug("API: update service for user");
    return genericAPICall("PUT", Constants.SERVER_ADDRESS + "/service", userId, service);
}

export function removeService(serviceId, userId) {
    console.debug("API: remove service");
    return genericAPICall("DELETE", Constants.SERVER_ADDRESS + "/service/" + serviceId, userId);
}

export function removeServiceFromGroup(serviceId, groupId, userId) {
    console.debug("API: remove service from group");
    return genericAPICall("DELETE", Constants.SERVER_ADDRESS + "/service/" + serviceId + "/group/" + groupId, userId);
}

export function getServices(userId) {
    console.debug("API: get services for user");
    return genericAPICall("GET", Constants.SERVER_ADDRESS + "/service", userId);
}

export function addItem(item, serviceId, userId) {
    console.debug("API: add item for service");
    return genericAPICall("POST", Constants.SERVER_ADDRESS + "/measurement-item/service/" + serviceId, userId, item);
}

export function updateItem(item, userId) {
    console.debug("API: update item for user");
    return genericAPICall("PUT", Constants.SERVER_ADDRESS + "/measurement-item", userId, item);
}

export function removeItem(itemId, userId) {
    console.debug("API: remove item");
    return genericAPICall("DELETE", Constants.SERVER_ADDRESS + "/measurement-item/" + itemId, userId);
}

export function addServiceUsage(usage, groupId, serviceId, itemId, userId) {
    console.debug("API: add service for user");
    return genericAPICall("POST", Constants.SERVER_ADDRESS + "/service-usage/group/" + groupId + "/service/"
        + serviceId + "/item/" + itemId, userId, usage);
}

export function getServiceUsage(groupId, serviceId, offset, maxResults, date, itemIdList, userId) {
    console.debug("API: get service usage list");
    let itemListQuery = "";
    for (let i = 0; i < itemIdList.length; i++) {
        itemListQuery = itemListQuery + "&itemId=" + itemIdList[i];
    }
    return genericAPICall("GET", Constants.SERVER_ADDRESS + "/service-usage/group/" + groupId + "/service/"
        + serviceId + "?offset=" + offset + "&max=" + maxResults + "&date=" + date + itemListQuery, userId);
}

function genericAPICall(method, url, userheader, data) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("user", userheader);
        xhr.onload = function () {
            if (this.status == 200) {
                resolve(xhr);
            } else {
                reject(xhr);
            }
        };
        xhr.onerror = function () {
            reject(xhr);
        };
        xhr.send(data);
    });
}