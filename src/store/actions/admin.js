import Apikey from '../../constants/Apikey';
import { authenticate, logout } from "./auth";
import Admin from "../../models/admin";

export const SET_ADMIN = 'SET_ADMIN';

const apiKey = Apikey.apiKey;

export const setAdmins = (admins)=>{
    return dispatch => {
        dispatch({
            type: SET_ADMIN,
            admins: admins,
        });
    }
}

export const getAdmins = (token) => {

    return async (dispatch) => {
        const response = await fetch(
            `https://app.disclosurediscounts.co.uk/api/v1/admin/admins`,
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

            const errorId = errorResData;
            let message = 'Something went wrong ' + errorId;

            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'Email or password incorrect';
            }
            throw new Error(message);
        } else {
            const resData = await response.json();

            loadAdmins(resData.search, dispatch);
            if (!resData.token) {
                dispatch(logout());
            } else {
                setToken(resData.token, dispatch);
            }
        }
    }
}

export const createNewAdmin = (id, name, email, password, token)=> {

    return async (dispatch) => {
        const response = await fetch(
            `https://app.disclosurediscounts.co.uk/api/v1/admin/createadmin/${id ? id : ''}`,
            {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Accept-Encoding':'gzip,deflate,br',
                    'Connection': 'keep-alive',
                    'apiKey': apiKey,
                    'token': token,
                },
                body: JSON.stringify({
                    'name': name,
                    'email': email,
                    'password': password
                })
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

            loadAdmins(resData.search, dispatch);
            if (!resData.token) {
                dispatch(logout());
            } else {
                setToken(resData.token, dispatch);
            }
        }
    }
}


export const deleteAdmin = (id, token) => {
    return async (dispatch) => {
        const response = await fetch(
            `https://app.disclosurediscounts.co.uk/api/v1/admin/deleteadmin/${id}`,
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

            loadAdmins(resData.search, dispatch);
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

const loadAdmins = (resData, dispatch) => {
    const admins = [];
    for (const key in resData) {
        admins.push(
            new Admin(
                resData[key].id,
                resData[key].username,
                resData[key].email,
            )
        );
    }
    dispatch( setAdmins(admins));
}

