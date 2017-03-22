import Constants from "./Constants";

export function addUser(user) {
    console.debug("API: add user");
    return genericAPICall("POST", Constants.SERVER_ADDRESS + "/user", user);
}

export function addGroup(group, userId) {
    console.debug("API: add group for user");
    return genericAPICall("POST", Constants.SERVER_ADDRESS + "/group/user/" + userId, group);
}

export function updateGroup(group) {
    console.debug("API: update group for user");
    return genericAPICall("PUT", Constants.SERVER_ADDRESS + "/group", group);
}

export function getGroups(userId) {
    console.debug("API: get groups for user");
    return genericAPICall("GET", Constants.SERVER_ADDRESS + "/group/" + userId);
}

export function addService(service, groupId, userId) {
    console.debug("API: add service for group and user");
    return genericAPICall("POST", Constants.SERVER_ADDRESS + "/service/group/" + groupId + "/user/" + userId, service);
}

function genericAPICall(method, url, data) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader("Content-Type", "application/json");
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

var mockGroupList = [
    {
        "id": 1,
        "label": "Trestiana",
        "desc": "Sector 4, Bucharest, Street no. 9, Bucharest, Street no. 9, Bucharest, Street no. 9",
        "owner": 1,
        "memberList": [
            {
                "id": 1,
                "profileId": 432432432,
                "name": "Florin Slevoaca",
                "profileImageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4zgcoIMPdadgZBlENHz9hisllzqsFxeLScwdbBlXiMe0tUy2Sna-ew6k",
                "email": "florin.slevoaca@gmail.com"
            },
            {
                "id": 2,
                "profileId": 432232432,
                "name": "Dragos Visan",
                "profileImageUrl": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTDTRrBartGAiJTMqpK0zOo-mCgE8pwnQm-0Ow-HktlQNht6DJu",
                "email": "dragos.visan@gmail.com"
            },
            {
                "id": 3,
                "profileId": 132232432,
                "name": "Ghost Rider",
                "profileImageUrl": "https://s-media-cache-ak0.pinimg.com/736x/9e/39/46/9e3946384f4ac3ad640461bf8865ba81.jpg",
                "email": "ghost.rider@gmail.com"
            }
        ],
        "serviceList": [
            {
                "id": 1,
                "label": "Water consumption",
                "desc": "Service for monitoring water consumption evey month",
                "items": []
            },
            {
                "id": 2,
                "label": "Energy",
                "desc": null,
                "items": []
            }
        ]
    },
    {
        "id": 2,
        "label": "Suceava",
        "desc": "Marasti 8, Suceava, Street no. 8",
        "owner": 1,
        "memberList": [],
        "serviceList": []
    }
]

export function getGroupListFromServer() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(mockGroupList);
        }, 1000)
    })
}
