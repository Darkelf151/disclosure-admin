import React, { useReducer, useEffect } from 'react';
import './Input.css';
const INPUT_CHANGE = 'INPUT_CHANGE';

const inputReducer = (state, action) => {

    switch (action.type) {
        case INPUT_CHANGE:
            return {
                ...state,
                value: action.value,
                touched: true
            };

        default:
            return state;
    }
};

const SearchInput = props => {

    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue ? props.initialValue : '',
        touched: false
    });
    const { onInputChange, id } = props;

    useEffect(() => {
        if (inputState.touched) {
            onInputChange(id, inputState.value);
        }
    }, [inputState, onInputChange, id]);

    const textChangeHandler = textObj => {

        dispatch({ type: INPUT_CHANGE, value: textObj.target.value });
    };

    return (
        <div>
            <input
                type={props.type}
                name={props.name}
                className='form-control'
                value={inputState.value}
                placeholder={props.label}
                onChange={textChangeHandler}
            />
            {!inputState.isValid && inputState.touched && (
                <div>
                    <span>{props.errorText}</span>
                </div>
            )}
        </div>
    );
};

export default SearchInput;
