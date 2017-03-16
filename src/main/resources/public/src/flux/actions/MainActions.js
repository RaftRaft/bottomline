var AppDispatcher = require('../AppDispatcher');
var Constants = require('../constants/Constants');

module.exports = {

    showGroup: function () {
        console.debug("Invoke action to show group");
        AppDispatcher.setGenericAction({
            actionType: Constants.SHOW_GROUP
        });
    }
};