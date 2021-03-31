import { AUTHENTICATE, LOGOUT } from "../actions/auth";

const initialState = {
    token: null,
    userId: null,
    email: null,
    userName: null,
    isAuthUser: !!localStorage.getItem("disclosure_admin"),
    isLoading: false,
    error: null
};
const user = (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            localStorage.setItem('disclosure_admin', JSON.stringify({
                token: action.token,
                userId: action.userId,
                email: action.email,
                userName: action.userName,
                company: action.company,
                role: action.role
                }));

            return {
                ...state,
                token: action.token,
                userId: action.userId,
                email: action.email,
                userName: action.userName,
                company: action.company,
                role: action.role,
                isAuthUser: true,
            }

        case LOGOUT:
            localStorage.removeItem("disclosure_admin");
            return {
                ...initialState,
                isAuthUser: false
            };

        default:
            return state;
    }
};

export default user;