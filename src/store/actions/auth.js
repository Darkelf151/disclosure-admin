import Apikey from '../../constants/Apikey';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

const apiKey = Apikey.apiKey;

export const authenticate = (userId, token, email, userName, company, role) => {
    return dispatch => {
        dispatch({
            type: AUTHENTICATE,
            userId: userId,
            token: token,
            email: email,
            userName: userName,
            company: company,
            role: role,
        });
    };
};

export const login = (email, password) => {

    return async dispatch => {
        const response = await fetch('http://18.135.69.3/api/v1/admin/login/'
            ,{
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Accept-Encoding':'gzip,deflate,br',
                    'Connection': 'keep-alive',
                    'apiKey': apiKey
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

        if (!response.ok) {
            const errorResData = await response.json();
console.log(errorResData.error);
            const errorId = errorResData.error.message;
            let message = 'Something went wrong';

            if (errorId ===  'EMAIL_NOT_FOUND') {
                message = 'Email or password incorrect';
            } else if (errorId === 'TOKEN_EXPIRED') {
                message = 'Token has expired';
            }
            throw new Error(message);
        }

        const resData = await response.json();
        dispatch(
            authenticate(
                resData.id,
                resData.token,
                resData.email,
                resData.username
            )
        );
    }
}
export const checkToken = (token) => {
    return async dispatch => {
        const response = await fetch('http://18.135.69.3/api/v1/admin/checktoken/'
            ,{
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Accept-Encoding':'gzip,deflate,br',
                    'Connection': 'keep-alive',
                    'apiKey': apiKey,
                    'token': token
                }
            });

        if (!response.ok) {
            const errorResData = await response.json();
            console.log(errorResData);
            dispatch(logout());

        }
        const resData = await response.json();

        if (!resData) {
            dispatch(logout());
        } else {
             dispatch(
                authenticate(
                    resData.id,
                    resData.verification_code,
                    resData.email,
                    resData.username
                )
            );
        }
    }
}

export const forgottenPassword = (email) => {
    return async dispatch => {
        const response = await fetch('http://18.135.69.3/api/v1/admin/forgotten/'
            , {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip,deflate,br',
                    'Connection': 'keep-alive',
                    'apiKey': apiKey,
                },
                body: JSON.stringify({
                    email: email,
                })
            });

        if (!response.ok) {
            const errorResData = await response.json();
            throw new Error(errorResData);
        }

        dispatch({ type: LOGOUT });
    }
}

export const logout = () => {

    localStorage.removeItem('disclosure_admin');
    return { type: LOGOUT };
};
