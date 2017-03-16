var Dispatcher = require('flux').Dispatcher;
var AppDispatcher = new Dispatcher();

AppDispatcher.setGenericAction = function (action) {
    console.debug("Dispatcher handle set generic action was called");
    this.dispatch({
        source: 'SET_GENERIC_ACTION',
        action: action
    });
};

module.exports = AppDispatcher;