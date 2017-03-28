import Constants from "../../common/Constants";

const service = (state = {}, action) => {
    switch (action.type) {
        case Constants.SELECT_SERVICE:
            console.debug("Reducer selects service");
            return Object.assign({}, state, {
                selectedService: action.service
            })
        default:
            return state
    }
}

export default service