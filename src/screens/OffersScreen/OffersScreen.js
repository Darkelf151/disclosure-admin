import React, { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import * as businessActions from '../../store/actions/business'
import { Button } from "../../components/UI/Button";
import SearchInput from "../../components/UI/SearchInput";
import './OffersScreen.css';
import {getBusinessById, CLEAR_SINGLE, getCategories} from "../../store/actions/business";

function useAsyncRef(ref) {
    const value = useRef(ref);
    const [,forceRender] = useState(false);

    function updateValue(newState) {
        value.current = newState;
        forceRender(s=>!s);
    }
    return [value, updateValue];
}

const OffersScreen = (props) => {

    const [, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [pageCount, setPageCount] = useAsyncRef(1);
    const [filterType, setFilterType] = useAsyncRef('');
    const user = useSelector(state => state.auth);
    const businesses = useSelector(state=>state.business.availablebusinesses);
    const totalCount = useSelector(state=>state.business.count);
    const dispatch = useDispatch();
    const history = useHistory();

    const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

    const formReducer = (state, action) => {
        if (action.type === FORM_INPUT_UPDATE) {
            const updatedValues = {
                ...state.inputValues,
                [action.input]: action.value
            };
            return {
                inputValues: updatedValues
            };
        }
        return state;
    };
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            search: ''
        }
    });

    useEffect(() => {
        if (error) {
            //alert('An error occured', error, [{text: "Ok"}])
            console.log({error})
        }
    }, [error]);

    const searchHandler = useCallback(async () => {
        let action;
        action = businessActions.getBusinesses(
            formState.inputValues.search,
            pageCount.current,
            filterType.current,
            user.token
        );
        if (user.token) {
            try {
                await dispatch(action);
                await dispatch(getCategories(user.token));

            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        }

    },[dispatch, formState.inputValues.search, pageCount, user.token, filterType]);

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue) => {
            dispatchFormState({
                type: FORM_INPUT_UPDATE,
                value: inputValue,
                input: inputIdentifier
            });
        },
        [dispatchFormState]
    );
    useEffect(()=>{
        searchHandler();
    },[formState.inputValues.search, pageCount, filterType, searchHandler])


    const pageHandler = (btn) => {
        switch (btn) {
            case "first":
                setPageCount(1);
                break;
            case "prev":
                if (pageCount.current > 1) {
                    setPageCount(pageCount.current -1 )
                }
                break;
            case "next":
                if (pageCount.current < Math.ceil(totalCount / 10)) {
                    setPageCount(pageCount.current + 1)
                }
                break;
            case "last": setPageCount(Math.ceil(totalCount / 10));
                break;
            case "name":
                if (filterType.current === 'name') { setFilterType('')} else {setFilterType('name')}
                break;
            case "start_date":
                if (filterType.current === 'start_date') { setFilterType('')} else {setFilterType('start_date')}
                break;
            case "town":
                if (filterType.current === 'town') { setFilterType('')} else {setFilterType('town')}
                break;
            default: console.log("default");
        }
        searchHandler();
    }

    const newOfferHandler = ()=>{
        dispatch({
            type: CLEAR_SINGLE
        });
        history.push("/editoffer");
    }

    const businessList = () => {
        return (
            businesses.map((business) => (
                    <div
                        className="business_wrapper"
                        key={business.id}
                        onClick={()=>{
                            dispatch(getBusinessById(business.id, user.token));
                            history.push("/editoffer?id="+business.id);
                        }}
                    >
                        <div>
                            <p className="business_name">{business.name}</p>
                            <p className="business_title">{business.title}</p>
                        </div>
                        <div>
                            <p className="business_title">Start: {business.start}</p>
                            <p className="business_title">End  : {business.end}</p>
                        </div>
                    </div>
                )
            )
        )
    }

    return   (
        <div className="offers_container">
            <div>
                <div className="business_container_header">
                    <h1>Current Offers</h1>
                    <Button
                        buttonSize="btn--small"
                        buttonColor="green"
                        onClick={newOfferHandler}
                    >Add New</Button>
                </div>
                <div className="business_container">
                    <div className="contacts__controls">
                        <div className="contacts__searchContainer">
                            <form className="contacts__searchForm">
                                <div className="contacts__searchContainerInner">
                                    <div className="contacts__searchInput">
                                        <SearchInput
                                            id="search"
                                            label="Search"
                                            type="text"
                                            autoCapitalize="none"
                                            onInputChange={inputChangeHandler}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div>
                            <p className="order_filter">Order by</p>
                            <div className="contact__filterButtons">
                        <span
                            className={filterType.current === 'name' ? "filterButton selected" : "filterButton"}
                            onClick={()=>{pageHandler('name')}}
                        >Name
                        </span>
                                <span
                                    className={filterType.current === 'town' ? "filterButton selected" : "filterButton"}
                                    onClick={()=>{pageHandler('town')}}
                                >Town
                        </span>
                                <span
                                    className={filterType.current === 'start_date' ? "filterButton selected" : "filterButton"}
                                    onClick={()=>{pageHandler('start_date')}}
                                >Date
                        </span>
                            </div>
                        </div>
                    </div>
                    {businessList()}

                    <div className="contactsAdvanceBtnsContainer">
                        <div className="contacts__btns" onClick={()=>{pageHandler('first')}}>&#8810; First</div>
                        <div className="contacts__btns" onClick={()=>{pageHandler('prev')}}>&#8826; Prev</div>
                        <div className="contacts__btns pageCount">{pageCount.current}</div>
                        <div className="contacts__btns" onClick={()=>{pageHandler('next')}}>Next &#8827;</div>
                        <div className="contacts__btns" onClick={()=>{pageHandler('last')}}>Last &#8811;</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default OffersScreen;
