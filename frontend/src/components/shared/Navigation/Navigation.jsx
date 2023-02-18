import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';

const Navigation = () => {
    return (
        <nav className={`${styles.navbar} container`}>
            <NavLink to="/" className={styles.logo}>
                <img src="/images/logo.png" alt="logo" />
                <span>Talk House</span>
            </NavLink>
        </nav>
    );
}

export default Navigation;