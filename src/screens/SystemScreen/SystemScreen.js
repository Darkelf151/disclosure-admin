import React, { useState, useCallback, useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from "react-redux";

import {getAdmins, createNewAdmin, deleteAdmin } from "../../store/actions/admin";
import {getCategories, deleteCategory, createCategory} from "../../store/actions/business";
import './SystemScreen.css';
import Input from "../../components/UI/Input";
import { Button } from "../../components/UI/Button";

const SystemScreen = () => {
    const user = useSelector(state => state.auth);
    const admins = useSelector(state =>state.admin.admins);
    const categories = useSelector(state => state.business.categories)
    const [, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [adminId, setAdminId] = useState('');
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const dispatch = useDispatch();
    const [categoryExists, setCategoryExists] = useState(false);

    const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
    const FORM_UPDATE_ALL = 'FORM_UPDATE_ALL';

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
        if (action.type === FORM_UPDATE_ALL) {
            const updatedValues = {
                name: action.value.name,
                email: action.value.email,
                password: action.value.password,
            }
            const updatedValidities = {
                name: action.valid.name,
                email: action.valid.email,
                password: action.valid.password,

            };
            const updatedFormIsValid = action.valid.form;

            return {
                formIsValid: updatedFormIsValid,
                inputValidities: updatedValidities,
                inputValues: updatedValues
            };
        }
        return state;
    };

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            name: '',
            email: '',
            password: '',

        },
        inputValidities: {
            name: false,
            email: false,
            password: false,


        },
        formIsValid: false
    });

    const submitHandler = async (e) => {
        e.preventDefault();
        if (formState.formIsValid) {
            setError(null);
            setIsLoading(true);
            setNewName(formState.inputValues.name);
            setNewEmail(formState.inputValues.email);
            setNewPassword(formState.inputValues.password);
            let action;
            action = createNewAdmin(
                adminId,
                formState.inputValues.name,
                formState.inputValues.email,
                formState.inputValues.password,
                user.token
            );
            try {
                await dispatch(action).then(() => {
                    setIsLoading(false);
                    clearFormHandler();
                });
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
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

    const inputCategoryHandler = (inputIdentifier, inputValue, inputValidity) => {

        setNewCategoryName(inputValue);
    }

    const submitCategoryHandler = async () => {
        setCategoryExists(false);
        const found = categories.some(el => el.username === newCategoryName);
        if (!found) {
            setIsLoading(true);
            let action;
            action = createCategory(
                newCategoryName,
                user.token
            );
            try {
                await dispatch(action).then(() => {
                    setIsLoading(false);
                    setNewCategoryName('');
                    clearFormHandler();
                });
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        } else {
            setCategoryExists(true);
        }
    }

    useEffect(() => {
        if (error) {
            //alert('An error occured', error, [{text: "Ok"}])
            console.log({error})
        }
    }, [error]);

    const searchHandler = useCallback(async () => {
        if (user.token) {
            try {
                await dispatch(getAdmins(
                    user.token
                ));
                await dispatch(getCategories(
                    user.token
                ));
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        }
    },[dispatch, user.token]);

    useEffect(()=>{
        searchHandler();
    },[searchHandler])


    const deleteAdminHandler = (id) => {

        if(window.confirm("Are you sure?")) {
            setAdminId(id);
            dispatch (deleteAdmin(id, user.token));
            clearFormHandler();
        }
    }

    const updateAdminHandler = (id, name, email) => {
        setNewName(name);
        setNewEmail(email);
        setNewPassword('');
        setAdminId(id);
        dispatchFormState({
            type: FORM_UPDATE_ALL,
            value: {
                name: name,
                email: email,
                password: '',
            },
            valid: {
                name: true,
                email: true,
                password: true,
                form: true
            },
            formIsValid: true
        });
    }

    const clearFormHandler = () => {

        setAdminId(null);
        setNewName('');
        setNewEmail('');
        setNewPassword('');
        dispatchFormState({
            type: FORM_UPDATE_ALL,
            value: {
                name: '',
                email: '',
                password: '',
            },
            valid: {
                name: false,
                email: false,
                password: false,
                form: false
            },
            formIsValid: false

        });
    }
    useEffect(()=>{
        if(formState.formIsValid) {
        }
    })
    const deleteCategoryHandler = (id) => {

        if(window.confirm("Are you sure?")) {
            setAdminId(id);
            dispatch (deleteCategory(id, user.token));

        }
    }

    return (
        <div>
            <div className="system__container">
                <div className="system__addAdmin">
                    {adminId ?(<p>Update Admin</p>) : (<p>Add New Admin</p>)}
                    <Input
                        id="name"
                        label="Name"
                        type="text"
                        required
                        autoCapitalize="none"
                        errorText="Please enter a name."
                        updatedValue={newName}
                        onInputChange={inputChangeHandler}
                        initialValue={formState.inputValues.name}
                        initiallyValid={formState.inputValues.name}
                    />
                    <Input
                        id="email"
                        label="Email"
                        type="text"
                        required
                        email
                        autoCapitalize="none"
                        errorText="Please enter a valid email address."
                        updatedValue={newEmail}
                        onInputChange={inputChangeHandler}
                        initialValue={formState.inputValues.email}
                        initiallyValid={formState.inputValues.email}
                    />
                    <Input
                        id="password"
                        label="Password"
                        type="text"
                        required
                        password
                        autoCapitalize="none"
                        errorText="Please enter a password."
                        updatedValue={newPassword}
                        onInputChange={inputChangeHandler}
                    />
                    <div className="system__addButtonContainer">

                        {adminId && formState.formIsValid && (
                            <Button
                                buttonColor="green"
                                buttonSize="btn--small"
                                onClick={submitHandler}
                            >Update</Button>
                        )}
                        {!adminId && formState.formIsValid &&(
                            <Button
                            buttonColor="green"
                            buttonSize="btn--small"
                            onClick={submitHandler}
                        >Add</Button>
                        )}
                        <Button
                            buttonColor="accent"
                            buttonSize="btn--small"
                            onClick={clearFormHandler}
                        >Clear</Button>

                    </div>
                </div>

                <div className="system__adminContainer">
                    {admins.map((admin) => (
                            <div
                                className="admin_wrapper"
                                key={admin.id}
                            >
                                <div className="admin_inner"
                                     onClick={()=>{updateAdminHandler(admin.id, admin.username, admin.email)}}
                                >
                                    <div className="system__adminName">
                                        <p>{admin.username}</p>
                                    </div>
                                    <div className="system__adminEmail">
                                        <p>{admin.email}</p>
                                    </div>
                                </div>

                                <div className="system__adminButtons">
                                    <Button
                                        buttonColor="red"
                                        buttonSize="btn--small"
                                        onClick={()=>{deleteAdminHandler(admin.id)}}
                                    >X</Button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
            <div className="system__container">
                <div className="system__addAdmin">
                    {adminId ?(<p>Update Category</p>) : (<p>Add New Category</p>)}
                    <Input
                        id="category"
                        label="Category"
                        type="text"
                        required
                        autoCapitalize="none"
                        errorText="Please enter a category."
                        updatedValue={newCategoryName}
                        onInputChange={inputCategoryHandler}
                    />
                    {categoryExists && <div>Category exists already</div>}
                    <div className="system__addButtonContainer">

                            <Button
                                buttonColor="green"
                                buttonSize="btn--small"
                                onClick={submitCategoryHandler}
                            >Add</Button>

                        <Button
                            buttonColor="accent"
                            buttonSize="btn--small"
                            onClick={clearFormHandler}
                        >Clear</Button>

                    </div>
                </div>

                <div className="system__adminContainer">
                    {categories.map((category) => (
                            <div
                                className="admin_wrapper"
                                key={category.id}
                            >

                                <div className="system__adminName">
                                    <p>{category.username}</p>
                                </div>

                                <div className="system__adminButtons">
                                    <Button
                                        buttonColor="red"
                                        buttonSize="btn--small"
                                        onClick={()=>{deleteCategoryHandler(category.id)}}
                                    >X</Button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default SystemScreen;
