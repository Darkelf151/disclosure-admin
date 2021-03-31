import { SET_ADMIN } from "../actions/admin";


const initialState = {
    admins: [],
};

const admin =  (state = initialState, action) => {
    switch (action.type) {
        case SET_ADMIN:
            return {
                admins: action.admins,
            };

        default: return state
    }
}

export default admin;
