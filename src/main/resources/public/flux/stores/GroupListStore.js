var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

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
        "services": []
    }
]

function getGroupListFromServer() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('a value')
        }, 1000)
    })
}

var store = {
    "show": {
        "loading": false
    },
    "groupList": []
};

var GroupListStore = ObjectAssign({}, EventEmitter.prototype, {

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getStore: function () {
        return store;
    },

    loadGroupList: function () {
        store.show.loading = true;
        getGroupListFromServer().then(
            function () {
                store.groupList = mockGroupList;
                store.show.loading = false;
                GroupListStore.emit(CHANGE_EVENT);
            },
            function (reason) {
                console.error('Something went wrong', reason);
            });
        GroupListStore.emit(CHANGE_EVENT);
    }

});

module.exports = GroupListStore;