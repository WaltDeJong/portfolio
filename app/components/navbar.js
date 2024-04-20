'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMenu } from 'react-icons/fi';
import styles from '../styles/navbar.css'; // Ensure the CSS path is correct

const Navbar = () => {
    const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);

    // Toggle the visibility of the mobile navigation menu
    const toggleMobileNav = () => {
        setIsMobileNavVisible(!isMobileNavVisible);
    };

    return (
        <nav className='navBarLogo'>
            <div className='navBarLogo'>
                {/* Use Next.js Image component for optimized image loading */}
                <Link href="/">
                        <Image src="/images/logo.png" alt="Logo" width={75} height={75} />               
                </Link>
            </div>
            {/* Button appears only on mobile screens due to CSS */}
            <button onClick={toggleMobileNav} className='menuIcon'>
                <FiMenu />
            </button>
            {/* Mobile navigation toggled based on state, hidden/shown based on CSS media queries */}
            <div className={isMobileNavVisible ? 'mobileNavContainer active' : 'mobileNavContainer'}>
                <Link className='mobileLink' href="/#projects">Projects</Link>
                <Link className='mobileLink' href="/#education">Education</Link>
                <Link className='mobileLink' href="/#footer">Contact</Link>
            </div>
            {/* Desktop navigation always visible on desktop, hidden on mobile */}
            <div className='desktopNavContainer'>
                <Link className='deskTopLink' href="/#projects">Projects</Link>
                <Link className='deskTopLink' href="/#education">Education</Link>
                <Link className='deskTopLink' href="/#footer">Contact</Link>
            </div>
        </nav>
    );
};

export default Navbar;
