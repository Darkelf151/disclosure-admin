import React, { useReducer, useCallback, useState, useEffect } from 'react';
import {useDispatch} from "react-redux";

import * as authActions from "../../store/actions/auth";
import Input from "../../components/UI/Input";
import {Button} from"../../components/UI/Button";
import './ForgottenPasswordScreen.css';
import {useHistory} from "react-router-dom";

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        };
    }
    return state;
};

const ForgottenPasswordScreen = () => {

    const [, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const history = useHistory();


    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',

        },
        inputValidities: {
            email: false,

        },
        formIsValid: false
    });

    useEffect(() => {
        if (error) {
            //alert('An error occured', error, [{text: "Ok"}])
            console.log({error})
        }
    }, [error]);

    const authHandler = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        let action;
        action = authActions.forgottenPassword(
            formState.inputValues.email
        );

        try {
            await dispatch(action);
            history.push("/login");

        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };
    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
            dispatchFormState({
                type: FORM_INPUT_UPDATE,
                value: inputValue,
                isValid: inputValidity,
                input: inputIdentifier
            });
        },
        [dispatchFormState]
    );

    return (
        <div className="wrapper">
            <div className="loginContainer">
                <div className="logoContainer">

                </div>

                <form className="loginForm">
                    <Input
                        id="email"
                        label="E-Mail"
                        type="text"
                        email
                        required
                        autoCapitalize="none"
                        errorText="Please enter a valid email address."
                        onInputChange={inputChangeHandler}
                    />

                    <Button onClick={authHandler} buttonColor="accent" buttonSize="btn--full">Reset Password</Button>
                </form>
                {error ? <div className="error">{error}</div> : null}
            </div>
        </div>
    );
};

export default ForgottenPasswordScreen;
