import React from 'react';
import './Button.css';

const STYLES = ['btn--primary', 'btn--outline'];

const SIZES = ['btn--medium', 'btn--large', 'btn--mobile', 'btn--wide', 'btn--full', 'btn--small'];

const COLOR = ['primary', 'blue', 'red', 'green', 'accent'];

export const Button =({
    children,
    type,
    onClick,
    buttonStyle,
    buttonSize,
    buttonColor
}) => {

    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
    const checkButtonColor = COLOR.includes(buttonColor) ? buttonColor : null;
    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

    return (
        <button className={`btn 
        ${checkButtonStyle} 
        ${checkButtonSize} 
        ${checkButtonColor}`} onClick={onClick} type={type}>{children}</button>
    )
};
