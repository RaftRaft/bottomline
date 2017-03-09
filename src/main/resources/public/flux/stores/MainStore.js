var AppDispatcher = require('../AppDispatcher');
var Constants = require('../constants/Constants');
var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var store = {
    "show": {
        "showGroup": true,
        "showService": false
    }
};

var MainStore = ObjectAssign({}, EventEmitter.prototype, {

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

        case Constants.SHOW_GROUP:
            showGroup();
            MainStore.emit(CHANGE_EVENT);
            break;

        default:
            return true;
    }

    function showGroup() {
        store.show.showGroup = true;
        store.show.showService = false;
    }
});

module.exports = MainStore;