import React, { useReducer, useCallback, useState, useEffect } from 'react';
import {useDispatch} from "react-redux";
import { useHistory } from "react-router-dom";
import * as authActions from "../../store/actions/auth";
import Input from "../../components/UI/Input";
import {Button} from"../../components/UI/Button";
import './LoginScreen.css';
import logo from '../../assets/images/disclosurelogo.png';

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

const LoginScreen = () => {

    const [, setIsLoading] = useState(false);

    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const history = useHistory();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
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
        action = authActions.login(
            formState.inputValues.email,
            formState.inputValues.password
        );

        try {
            await dispatch(action);


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

        const forgottenPasswordHandler  = () => {
            history.push("/forgotten");
        }


    return  (
        <div className="wrapper">
        <div className="loginContainer">
            <div className="logoContainer">
                <img className='logo' src={logo} alt='logo'/>
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
                <Input
                    id="password"
                    label="Password"
                    type="text"
                    required
                    minLength={4}
                    secureTextEntry
                    autoCapitalize="none"
                    errorText="Please enter a valid password."
                    onInputChange={inputChangeHandler}
                />
                <Button onClick={authHandler} buttonColor="accent" buttonSize="btn--full">Login</Button>
            </form>
            {error ? <div className="error">{error}</div> : null}
        </div>
            <div className="forgotten">
                <Button onClick={forgottenPasswordHandler}>Forgotten password?</Button>
            </div>

        </div>
    );
};

export default LoginScreen;
