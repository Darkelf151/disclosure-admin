import { SET_BUSINESS, SET_COUNT, SET_SINGLE, CLEAR_SINGLE, SET_CATEGORIES } from "../actions/business";

const initialState = {
    availablebusinesses: [],
    selectedBusiness: [],
    categories: [],
    count: 0
};

const client =  (state = initialState, action) => {

    switch (action.type) {
        case SET_BUSINESS:
            return {
                availablebusinesses: action.clients,
                selectedBusiness: state.selectedBusiness,
                categories: state.categories,
                count: state.count
            };

        case SET_COUNT:
            return {
                availablebusinesses: state.availablebusinesses,
                selectedBusiness: state.selectedBusiness,
                categories: state.categories,
                count: action.count
            }
        case SET_SINGLE:
            return {
                availablebusinesses: state.availablebusinesses,
                selectedBusiness: action.client,
                categories: state.categories,
                count: state.count
            }
        case CLEAR_SINGLE:
            return {
                availablebusinesses: state.availablebusinesses,
                selectedBusiness: initialState.selectedBusiness,
                categories: state.categories,
                count: state.count
            }
        case SET_CATEGORIES:
            return {
                availablebusinesses: state.availablebusinesses,
                selectedBusiness: state.selectedBusiness,
                categories: action.categories,
                count: state.count
            }
            default: return state
    }
}

export default client;