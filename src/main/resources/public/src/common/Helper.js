export function selectGroup(groupList, id) {
    for (let i = 0; i < groupList.length; i++) {
        if (groupList[i].id == id) {
            return groupList[i];
        }
    }
}

export function selectService(serviceList, id) {
    for (let i = 0; i < serviceList.length; i++) {
        if (serviceList[i].id == id) {
            return serviceList[i];
        }
    }
}

export function containsService(serviceList, service) {
    for (let i = 0; i < serviceList.length; i++) {
        if (serviceList[i].id == service.id) {
            return true;
        }
    }
    return false;
}