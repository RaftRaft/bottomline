var AppDispatcher = require('../AppDispatcher');
var Constants = require('../constants/Constants');
var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var groupsMock = [
    {
        "id": 1,
        "label": "Trestiana",
        "desc": "Sector 4, Bucharest, Street no. 9",
        "services": []
    },
    {
        "id": 2,
        "label": "Suceava",
        "desc": "Marasti 8, Suceava, Street no. 8",
        "services": []
    }
]

var store = {
    "show": {
        "showGroupList": true,
        "showGroup": false,
        "showGroupEdit": false
    },
    "groups": []
};

var GroupStore = ObjectAssign({}, EventEmitter.prototype, {

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getStore: function () {
        return store;
    }

});

AppDispatcher.register(function (payload) {

    var action = payload.action;

    switch (action.actionType) {

        case Constants.SHOW_GROUP_LIST:
            showGroupList();
            GroupStore.emit(CHANGE_EVENT);
            break;
        case Constants.SHOW_GROUP_EDIT:
            showGroupEdit(action.data);
            GroupStore.emit(CHANGE_EVENT);
            break;
        default:
            return true;
    }

    function showGroupList() {
        store.show.showGroupList = true;
        store.show.showGroupEdit = false;
        store.show.showGroupServices = false;
    }

    function showGroupEdit(data) {
        store.show.showGroupList = false;
        store.show.showGroupEdit = true;
        store.show.showGroupServices = false;
    }
});

module.exports = GroupStore;