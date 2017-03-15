var AppDispatcher = require('../AppDispatcher');
var Constants = require('../constants/Constants');

module.exports = {

    showGroupList: function () {
        console.debug("Invoke action to show group list");
        AppDispatcher.setGenericAction({
            actionType: Constants.SHOW_GROUP_LIST
        });
    },

    showGroupContent: function (group) {
        console.debug("Invoke action to show group content");
        AppDispatcher.setGenericAction({
            actionType: Constants.SHOW_GROUP_CONTENT,
            data: group
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