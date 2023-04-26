import React from 'react';
import { NavLink } from 'react-router-dom';
import { logout } from '../../../http';
import styles from './Navigation.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../../store/authSlice';

const Navigation = () => {
    const dispatch = useDispatch();
    const { isAuth, user } = useSelector(state => state.authSlice);
    async function logOutUser() {
        try {
            const { data } = await logout();
            dispatch(setAuth(data));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <nav className={`${styles.navbar} container`}>
            <NavLink to="/" className={styles.logo}>
                <img src="/images/logo.png" alt="logo" />
                <span>Talk House</span>
            </NavLink>
            {isAuth && (
                <div className={styles.navRight}>
                    <h3>{user?.name}</h3>
                    <NavLink to="/">
                        <img
                            className={styles.avatar}
                            src={user.avatar ? user.avatar: '/images/monkey-avatar.png'}
                            width="40"
                            height="40"
                            alt="avatar"
                        />
                    </NavLink>
                    <button
                        className={styles.logoutButton}
                        onClick={logOutUser}
                    >
                        <img src="/images/logout.png" alt="logout" />
                    </button>
                </div>
            )}
        </nav>
    );
}

export default Navigation;