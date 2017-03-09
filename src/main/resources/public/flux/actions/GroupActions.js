var AppDispatcher = require('../AppDispatcher');
var Constants = require('../constants/Constants');

module.exports = {

    showGroupList: function () {
        console.debug("Invoke action to show group list");
        AppDispatcher.setGenericAction({
            actionType: Constants.SHOW_GROUP_LIST
        });
    },

    showGroupServices: function () {
        console.debug("Invoke action to show group services");
        AppDispatcher.setGenericAction({
            actionType: Constants.SHOW_GROUP_SERVICES
        });
    },

    showGroupEdit: function (index) {
        console.debug("Invoke action to show group edit");
        AppDispatcher.setGenericAction({
            actionType: Constants.SHOW_GROUP_EDIT,
            data: index
        });
    }
};