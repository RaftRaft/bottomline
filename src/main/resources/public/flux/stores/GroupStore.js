var AppDispatcher = require('../AppDispatcher');
var Constants = require('../constants/Constants');
var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var store = {
    "show": {
        "showGroupList": true,
        "showGroupContent": false,
        "showGroupEdit": false
    },
    "group": null
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
            showGroupEdit();
            GroupStore.emit(CHANGE_EVENT);
            break;
        case Constants.SHOW_GROUP_CONTENT:
            showGroupContent();
            store.group = action.data;
            GroupStore.emit(CHANGE_EVENT);
            break;
        default:
            return true;
    }

    function showGroupList() {
        store.show.showGroupList = true;
        store.show.showGroupEdit = false;
        store.show.showGroupContent = false;
    }

    function showGroupEdit() {
        store.show.showGroupList = false;
        store.show.showGroupEdit = true;
        store.show.showGroupContent = false;
    }

    function showGroupContent() {
        store.show.showGroupList = false;
        store.show.showGroupEdit = false;
        store.show.showGroupContent = true;
    }

});

module.exports = GroupStore;