import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkToken } from "../store/actions/auth";

const AuthRoute = props => {
    const { isAuthUser, type, index } = props;
    const dispatch = useDispatch();
    useEffect(()=>{
        const checkAuth = ()=> {
            const userSession = JSON.parse(localStorage.getItem(  'disclosure_admin'));
            if (userSession) {
                dispatch(checkToken(userSession.token));
            }
        }
        checkAuth();
    },[dispatch, index]);

    if (type === "guest" && isAuthUser) return <Redirect to="/" />;
    else if (type === "private" && !isAuthUser) return <Redirect to="/login" />;

    return <Route {...props} />;
};

const mapStateToProps = (state) => {
    return {
        isAuthUser: state.auth.isAuthUser
    }
};

export default connect(mapStateToProps)(AuthRoute);