import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import '../styles/navbar.css';

const Navbar = () => {
    const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);

    const toggleMobileNav = () => {
        setIsMobileNavVisible(!isMobileNavVisible);
    };

    return (
        <nav className='navBarLogo'>
            <div className='navBarLogo'>
                <a href="/">
                    <img src="/images/logo.png" alt="Logo" width={75} height={75} />
                </a>
            </div>
            <button onClick={toggleMobileNav} className='menuIcon'>
                <FiMenu />
            </button>
            <div className={isMobileNavVisible ? 'mobileNavContainer active' : 'mobileNavContainer'}>
                <a className='mobileLink' href="#experience">Experience</a>
                <a className='mobileLink' href="#works">Projects</a>
                <a className='mobileLink' href="#footer">Contact</a>
            </div>
            <div className='desktopNavContainer'>
                <a className='deskTopLink' href="#experience">Experience</a>
                <a className='deskTopLink' href="#works">Projects</a>
                <a className='deskTopLink' href="#footer">Contact</a>
            </div>
        </nav>
    );
};

export default Navbar;
