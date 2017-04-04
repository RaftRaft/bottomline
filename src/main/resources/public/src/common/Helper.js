export function selectGroup(groupList, id) {
    if (id == null || groupList == null) {
        return null;
    }
    for (let i = 0; i < groupList.length; i++) {
        if (groupList[i].id == id) {
            return groupList[i];
        }
    }
}

export function selectService(serviceList, serviceId) {
    if (serviceId == null || serviceList == null) {
        return null;
    }
    for (let i = 0; i < serviceList.length; i++) {
        if (serviceList[i].id == serviceId) {
            return serviceList[i];
        }
    }
    return null;
}

export function selectServiceUsage(serviceUsageList, id) {
    if (id == null || serviceUsageList == null) {
        return null;
    }
    for (let i = 0; i < serviceUsageList.length; i++) {
        if (serviceUsageList[i].id == id) {
            return serviceUsageList[i];
        }
    }
    return null;
}

export function containsService(serviceList, service) {
    for (let i = 0; i < serviceList.length; i++) {
        if (serviceList[i].id == service.id) {
            return true;
        }
    }
    return false;
}