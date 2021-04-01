import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from "react-redux";
import { FaBars, FaTimes } from 'react-icons/fa';
import {  Link } from "react-router-dom";
import './Navbar.css';
import { IconContext } from "react-icons/lib";
import {logout} from "../store/actions/auth";
import { useHistory } from "react-router-dom";



const Navbar = (props) => {
    const { isAuthUser } = props;
    const [click, setClick] = useState(false);
    const [, setReRender] = useState('');

    const history = useHistory();

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => {
        setClick(false);
        setReRender(Math.random());
    }

    const dispatch = useDispatch();

    let timeoutId;
    const doInactive = () => {

        window.clearTimeout(timeoutId)
        dispatch(logout());
        history.push("/login");
    }

    const resetTimer = () => {

        window.clearTimeout(timeoutId)
        startTimer();
    }

    const startTimer = () => {

        timeoutId = window.setTimeout(doInactive, 5 * 60 * 1000)
    }

    const setUpTimers = () => {
        document.addEventListener("mousemove", resetTimer, false);
        document.addEventListener("mousedown", resetTimer, false);
        document.addEventListener("keypress", resetTimer, false);
        document.addEventListener("touchmove", resetTimer, false);

        startTimer();
    }


    useEffect(()=>{
        setUpTimers();
    }, )


    return isAuthUser ? (
        <>
            <IconContext.Provider value={{ color: '#fff' }}>
        <div className="navbar">
            <div className="navbar-container container">
                <Link to= '/' className="navbar-logo" onClick={closeMobileMenu}>
                    Disclosure
                </Link>
                <div id="menu_icon" className="menu-icon" onClick={handleClick}>
                    {click ?<FaTimes /> : <FaBars />}
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>

                    <li className="nav-item">
                        <Link to='/clients' className="nav-links" onClick={closeMobileMenu}>
                            Clients
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/offers' className="nav-links" onClick={closeMobileMenu}>
                            Offers
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/system' className="nav-links" onClick={closeMobileMenu}>
                            System
                        </Link>

                    </li>
                </ul>
            </div>
        </div>
            </IconContext.Provider>
        </>
    ) : (
        <>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        isAuthUser: state.auth.isAuthUser
    }
};

export default connect(mapStateToProps)(Navbar);
