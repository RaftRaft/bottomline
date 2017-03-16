var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var store = {
    "show": {
        "loading": false
    },
    "group": null
};

var GroupContentStore = ObjectAssign({}, EventEmitter.prototype, {

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

module.exports = GroupContentStore;