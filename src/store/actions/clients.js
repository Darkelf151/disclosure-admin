import Apikey from '../../constants/Apikey';
import {authenticate, logout} from "./auth";
import Clients from "../../models/clients";

export const SET_CLIENTS = "SET_CLIENTS";
export const SET_CLIENT_COUNT = "SET_CLIENT_COUNT";

const apiKey = Apikey.apiKey;

export const getClients = (token) => {

    return async (dispatch) => {
        const response = await fetch(
            `https://app.disclosurediscounts.co.uk/api/v1/admin/clients`,
            {
                method: 'GET',
                headers: {
                    'Accept': '*/*',
                    'Accept-Encoding':'gzip,deflate,br',
                    'Connection': 'keep-alive',
                    'apiKey': apiKey,
                    'token': token,
                }
            }
        );
        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong';

            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'Email or password incorrect';
            }
            throw new Error(message);
        } else {
            const resData = await response.json();

            dispatch(dispatch({
                type: SET_CLIENT_COUNT,
                count: resData.search.count
            }));

            loadClients(resData.search.clients, dispatch);
            if (!resData.token) {
                dispatch(logout());
            } else {
                setToken(resData.token, dispatch);
            }
        }
    }
}

const setToken = (resData, dispatch) => {
    dispatch(
        authenticate(
            resData.id,
            resData.verification_code,
            resData.email,
            resData.username
        )
    );
}

const loadClients = (resData, dispatch) => {
    const clients = [];

    for (const key in resData) {
        clients.push(
            new Clients(
                resData[key].fname,
                resData[key].lname,
                resData[key].email,
                resData[key].mailingList,
                resData[key].created_at,
            )
        );
    }

    dispatch(dispatch({
        type: SET_CLIENTS,
        clients: clients,
    }));
}