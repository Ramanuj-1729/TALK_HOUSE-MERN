import React, { useState } from 'react';
import styles from './StepAvatar.module.css';
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { setAvatar } from '../../../store/activateSlice';
import { activate } from '../../../http';
import { setAuth} from '../../../store/authSlice';

const StepAvatar = ({ onNext }) => {
    const { name, avatar } = useSelector((state) => state.activateSlice);
    const [image, setImage] = useState('/images/monkey-avatar.png');
    const dispatch = useDispatch();
    function captureImage(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            setImage(reader.result);
            dispatch(setAvatar(reader.result));
        };
    }
    
    async function submit() {
        try {
            const { data } = await activate({ name, avatar});
            if(data.auth) {
                dispatch(setAuth(data));
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <Card
                title={`Okay, ${name}!`}
                icon="monkey-emoji"
            >
                <p className={styles.subHeading}>How's this photo ?</p>
                <div className={styles.avatarWrapper}>
                    <img className={styles.avatarImage} src={image} alt="avatar" />
                </div>
                <div>
                    <input
                        onChange={captureImage}
                        id="avatarInput"
                        type="file"
                        className={styles.avatarInput}
                    />
                    <label className={styles.avatarLabel} htmlFor="avatarInput">
                        Choose a different photo
                    </label>
                </div>
                <div>
                    <Button text="Next" onClick={submit} />
                </div>
            </Card>
        </>
    );
}

export default StepAvatar;