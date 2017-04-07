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


export function generateSeries(serviceUsageList) {
    let series = [];
    for (let i = 0; i < serviceUsageList.length; i++) {
        let found = false;
        for (let j = 0; j < series.length; j++) {
            if (series[j].name == serviceUsageList[i].item.label) {
                series[j].data.push([serviceUsageList[i].date, serviceUsageList[i].index]);
                found = true;
                break;
            }
        }
        if (!found) {
            let object = {};
            object.name = serviceUsageList[i].item.label;
            object.data = [[serviceUsageList[i].date, serviceUsageList[i].index]];
            series.push(object);
        }
    }
    return series;
}