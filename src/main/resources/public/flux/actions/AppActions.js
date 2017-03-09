var AppDispatcher = require('../AppDispatcher');
var Constants = require('../constants/Constants');

module.exports = {

    setUser: function (data) {
        console.debug("Invoke action to set user");
        AppDispatcher.setGenericAction({
            actionType: Constants.SET_USER,
            data: data
        });
    }
};