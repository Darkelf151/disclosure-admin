import Business from "../../models/business";
import Categories from "../../models/categories";

import Apikey from '../../constants/Apikey';
import {authenticate, logout} from "./auth";

export const SET_BUSINESS = 'SET_BUSINESS';
export const SET_COUNT = 'SET_COUNT';
export const SET_SINGLE = 'SET_SINGLE';
export const CLEAR_SINGLE = 'CLEAR_SINGLE';
export const SET_CATEGORIES = 'SET_CATEGORIES';

const apiKey = Apikey.apiKey;

export const setClients = (loadedClients)=>{
    return dispatch => {
        dispatch({
            type: SET_BUSINESS,
            clients: loadedClients,
        });
    }
}
export const setCategories = (categories)=>{
    return dispatch => {
        dispatch({
            type: SET_CATEGORIES,
            categories: categories,
        });
    }
}


export const getBusinesses = (inputValue, pageCount, filterType, token) => {
    return async (dispatch) => {

        const response = await fetch(
            `http://18.135.69.3/api/v1/admin/getbusinesses/`,
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
                    input: inputValue,
                    page: pageCount,
                    filter: filterType
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

        }
        const resData = await response.json();
        loadBusinesses(resData.search, dispatch);
        if (!resData.token) {
            dispatch(logout());
        } else {
            setToken(resData.token, dispatch);
        }
    }
}

export const getBusinessById = (id, token) => {

    const formatDate = (date) => {
        let dateObj = new Date(date);

        const d = dateObj.getDate();
        const m = dateObj.getMonth() + 1;
        const y = dateObj.getFullYear();
        return y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d)
    }

    return async (dispatch) => {

        const response = await fetch(
            `http://18.135.69.3/api/v1/admin/getbusiness/${id}`,
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

        }
        const resData = await response.json();

        dispatch({
            type: SET_SINGLE,
            client: {
                id: resData.search.company_id,
                name: resData.search.name,
                address: resData.search.address,
                town: resData.search.town,
                postcode: resData.search.postcode,
                phone: resData.search.phone,
                start: formatDate(resData.search.start_date),
                end: formatDate(resData.search.end_date),
                title: resData.search.offer_title,
                description: resData.search.offer_desc,
                heroImageUrl: resData.search.main_image,
                bottomImage1: resData.search.bottom_image_1,
                bottomImage2: resData.search.bottom_image_2,
                category: resData.search.category_id
            },
        });

        if (!resData.token) {
            dispatch(logout());
        } else {
            setToken(resData.token, dispatch);
        }
    }
}

export const updateBusiness = (id, name, address, town, postcode, phone, start, end, title, description, oldHeroUrl, oldBtmLeftUrl, oldBtmRightUrl, heroImageUrl, bottomImage1, bottomImage2, token, category ) => {

   return async (dispatch) => {

        const response = await fetch(
            `http://18.135.69.3/api/v1/admin/updatebusiness/${id ? id : ''}`,
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
                    name: name,
                    address: address,
                    town: town,
                    postcode: postcode,
                    phone: phone,
                    start: start,
                    end: end,
                    title: title,
                    description: description,
                    heroImageUrl: heroImageUrl ? heroImageUrl : oldHeroUrl,
                    bottomImage1: bottomImage1 ? bottomImage1 : oldBtmLeftUrl,
                    bottomImage2: bottomImage2 ? bottomImage2 : oldBtmRightUrl,
                    category: category
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
        }
        const resData = await response.json();

        if (!id) {
            loadBusinesses(resData.search, dispatch)
        }
       if (!resData.token) {
           dispatch(logout());
       } else {
           setToken(resData.token, dispatch);
       }

    }
}

export const deleteBusiness = (id, token) => {

    return async (dispatch) => {
        const response = await fetch(
            `http://18.135.69.3/api/v1/admin/deletebusiness/${id}`,
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

            loadBusinesses(resData.search, dispatch);
            if (!resData.token) {
                dispatch(logout());
            } else {
                setToken(resData.token, dispatch);
            }
        }
    }
}

export const getCategories = (token) => {

    return async (dispatch) => {
        const response = await fetch(
            `http://18.135.69.3/api/v1/admin/categories`,
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

            loadCategories(resData.search, dispatch);
            if (!resData.token) {
                dispatch(logout());
            } else {
                setToken(resData.token, dispatch);
            }
        }
    }
}
export const deleteCategory = (id, token) => {
    console.log("deleteCategory",{token})
    return async (dispatch) => {
        const response = await fetch(
            `http://18.135.69.3/api/v1/admin/category/${id}`,
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
            console.log("delete category",resData.search);
            loadCategories(resData.search, dispatch);
            if (!resData.token) {
                dispatch(logout());
            } else {
                setToken(resData.token, dispatch);
            }
        }
    }
}
export const createCategory = (name, token) => {
    console.log("createCategory",{token})
    return async (dispatch) => {
        const response = await fetch(
            `http://18.135.69.3/api/v1/admin/category/`,
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
                    name: name
                })
            });

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
            console.log("create category",resData);
            loadCategories(resData.search, dispatch);
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

const loadBusinesses = (resData, dispatch) => {
    const loadedBusiness = [];
    let start;
    let end;

    for (const key in resData.result) {
        start = new Date (resData.result[key].start_date);
        end = new Date (resData.result[key].end_date);
        loadedBusiness.push(
            new Business(
                resData.result[key].company_id,
                resData.result[key].name,
                resData.result[key].address,
                resData.result[key].town,
                resData.result[key].postcode,
                resData.result[key].phone,
                start.toDateString(),
                end.toDateString(),
                resData.result[key].offer_title,
                resData.result[key].offer_desc,
                resData.result[key].main_image,
                resData.result[key].bottom_image_1,
                resData.result[key].bottom_image_2,
                resData.result[key].category_id
            )
        );
    }
    dispatch( setClients(loadedBusiness))
    dispatch({
        type: SET_COUNT,
        count: resData.count,
    })
}

const loadCategories = (resData, dispatch) => {

    const categories = [];
    for (const key in resData.clients) {
        categories.push(
            new Categories(
                resData.clients[key].id,
                resData.clients[key].category_name,

            )
        );
    }
    dispatch( setCategories(categories));
}
