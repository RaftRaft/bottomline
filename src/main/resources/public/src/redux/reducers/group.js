import Constants from "../../common/Constants";

const group = (state = {}, action) => {
    switch (action.type) {
        case Constants.SET_GROUP_LIST:
            console.debug("Reducer sets list of groups");
            return Object.assign({}, state, {
                list: action.list
            })
        default:
            return state
    }
}

export default group