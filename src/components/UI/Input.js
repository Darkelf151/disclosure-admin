import React, {useEffect, useReducer, useState} from 'react';
import './Input.css';

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';
const RESET_TOUCH = 'RESET_TOUCH';

const inputReducer = (state, action) => {

    switch (action.type) {
        case INPUT_CHANGE:
            return {
                ...state,
                value: action.value,
                isValid: action.isValid
            };
        case INPUT_BLUR:
            return {
                ...state,
                touched: true
            };
        case RESET_TOUCH:
            return {
                ...state,
                touched: false
            }
        default:
            return state;
    }
};
const Input = props => {

    const { onInputChange, id, updatedValue, initialValue } = props

    const [oldValue, setOldValue] = useState(initialValue);

    const [inputState, dispatch] = useReducer(inputReducer, {
        value: initialValue ? initialValue : '',
        isValid: props.initiallyValid,
        touched: false,
    });

    useEffect(()=>{

        if (oldValue !== updatedValue) {
            dispatch({ type: INPUT_CHANGE, value: updatedValue, isValid: !!updatedValue });
            setOldValue(updatedValue);

        }
        if (updatedValue === ''){
            dispatch({ type: RESET_TOUCH });
        }
    }, [updatedValue, id, onInputChange, oldValue])


    useEffect(() => {
        if (inputState.touched) {

            onInputChange(id, inputState.value, inputState.isValid);
        }
    }, [inputState, onInputChange, id]);

    const textChangeHandler = textObj => {

        const text = textObj.target.value;

        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        const postcodeRegex = /^(([A-Z][A-HJ-Y]?\d[A-Z\d]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?\d[A-Z]{2}|BFPO ?\d{1,4}|(KY\d|MSR|VG|AI)[ -]?\d{4}|[A-Z]{2} ?\d{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/;
        let isValid = true;
        if (props.required && text.length === 0) {
            isValid = false;
        }
        if (props.email && !emailRegex.test(text.toLowerCase())) {
            isValid = false;
        }
        if (props.postcode && !postcodeRegex.test(text.toUpperCase())) {
            isValid = false;
        }
        if (props.min != null && +text < props.min) {
            isValid = false;
        }
        if (props.max != null && +text > props.max) {
            isValid = false;
        }
        if (props.minLength != null && text.length < props.minLength) {
            isValid = false;
        }
        if (props.maxLength != null && text.length > props.maxLength) {
            isValid = false;
        }
        dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
    };

    const lostFocusHandler = () => {
        dispatch({ type: INPUT_BLUR });
    };
    return (
        <div className="inputContainer">
            <label
                htmlFor={props.label}
                className="inputlabel"
            >
               {props.label}</label>
            {props.textarea ?(
                <textarea
                    name={props.id}
                    className='form-control'
                    rows="6"
                    value={inputState.value}
                    onChange={textChangeHandler}
                    onBlur={lostFocusHandler}
                >
                </textarea>
            ):(
                <input
                    type={props.type}
                    name={props.id}
                    id={props.id}
                    className='form-control'
                    value={inputState.value}
                    min={props.type==="date" ? props.min : ''}
                    onChange={textChangeHandler}
                    onBlur={lostFocusHandler}
                />
            )}
            {!inputState.isValid && inputState.touched && (
                <div>
                    <span>{props.errorText}</span>
                </div>
            )}
        </div>
    );
};

export default Input;
