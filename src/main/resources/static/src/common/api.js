import Constants from "./Constants";

export function addUser(user) {
    return genericAPICall("POST", Constants.SERVER_ADDRESS + "/user", user.id, user);
}

export function addGroup(group, userId) {
    return genericAPICall("POST", Constants.SERVER_ADDRESS + "/group", userId, group);
}

export function updateGroup(group, userId) {
    return genericAPICall("PUT", Constants.SERVER_ADDRESS + "/group", userId, group);
}

export function getGroups(userId) {
    return genericAPICall("GET", Constants.SERVER_ADDRESS + "/group", userId);
}

export function removeGroup(groupId, userId) {
    return genericAPICall("DELETE", Constants.SERVER_ADDRESS + "/group/" + groupId, userId);
}

export function addServiceForGroup(service, groupId, userId) {
    return genericAPICall("POST", Constants.SERVER_ADDRESS + "/service/group/" + groupId, userId, service);
}

export function addService(service, userId) {
    return genericAPICall("POST", Constants.SERVER_ADDRESS + "/service", userId, service);
}

export function updateService(service, userId) {
    return genericAPICall("PUT", Constants.SERVER_ADDRESS + "/service", userId, service);
}

export function removeService(serviceId, userId) {
    return genericAPICall("DELETE", Constants.SERVER_ADDRESS + "/service/" + serviceId, userId);
}

export function removeServiceFromGroup(serviceId, groupId, userId) {
    return genericAPICall("DELETE", Constants.SERVER_ADDRESS + "/service/" + serviceId + "/group/" + groupId, userId);
}

export function getServices(userId) {
    return genericAPICall("GET", Constants.SERVER_ADDRESS + "/service", userId);
}

export function addItem(item, serviceId, userId) {
    return genericAPICall("POST", Constants.SERVER_ADDRESS + "/measurement-item/service/" + serviceId, userId, item);
}

export function updateItem(item, userId) {
    return genericAPICall("PUT", Constants.SERVER_ADDRESS + "/measurement-item", userId, item);
}

export function removeItem(itemId, userId) {
    return genericAPICall("DELETE", Constants.SERVER_ADDRESS + "/measurement-item/" + itemId, userId);
}

export function addServiceUsage(usage, groupId, serviceId, itemId, userId) {
    return genericAPICall("POST", Constants.SERVER_ADDRESS + "/service-usage/group/" + groupId + "/service/"
        + serviceId + "/item/" + itemId, userId, usage);
}

export function updateServiceUsage(usage, itemId, serviceUsageId, userId) {
    return genericAPICall("PUT", Constants.SERVER_ADDRESS + "/service-usage/" + serviceUsageId + "/item/"
        + itemId, userId, usage);
}

export function getServiceUsage(groupId, serviceId, offset, maxResults, date, itemIdList, userId) {
    let itemListQuery = "";
    for (let i = 0; i < itemIdList.length; i++) {
        itemListQuery = itemListQuery + "&itemId=" + itemIdList[i];
    }
    return genericAPICall("GET", Constants.SERVER_ADDRESS + "/service-usage/group/" + groupId + "/service/"
        + serviceId + "?offset=" + offset + "&max=" + maxResults + "&date=" + date + itemListQuery, userId);
}

export function removeServiceUsage(serviceUsageId, userId) {
    return genericAPICall("DELETE", Constants.SERVER_ADDRESS + "/service-usage/" + serviceUsageId, userId);
}

export function sendInvitation(invitation, groupId, userId) {
    return genericAPICall("POST", Constants.SERVER_ADDRESS + "/invitation/send/group/" + groupId, userId, invitation);
}

export function acceptInvitation(invitationId, userId) {
    return genericAPICall("POST", Constants.SERVER_ADDRESS + "/invitation/" + invitationId, userId);
}

export function removeMemberFromGroup(memberId, groupId, userId) {
    return genericAPICall("DELETE", Constants.SERVER_ADDRESS + "/group/" + groupId + "/member/" + memberId, userId);
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