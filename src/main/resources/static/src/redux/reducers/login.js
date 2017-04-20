import Constants from "../../common/Constants";

const login = (state = {}, action) => {
    switch (action.type) {
        case Constants.SET_CURRENT_USER:
            return Object.assign({}, state, {
                currentUser: action.user
            })
        default:
            return state
    }
}

export default login