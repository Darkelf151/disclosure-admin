import { SET_CLIENTS, SET_CLIENT_COUNT } from "../actions/clients";


const initialState = {
    clients: [],
    count: 0
};

const client =  (state = initialState, action) => {

    switch (action.type) {
        case SET_CLIENTS:
            return {
                clients: action.clients,
                count: state.count
            };
        case SET_CLIENT_COUNT:
            return {
                clients: state.clients,
                count: action.count
            }


        default: return state
    }
}

export default client;
