import React, { useState } from 'react';
import styles from './StepName.module.css';
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import TextInput from '../../../components/shared/TextInput/TextInput';
import { useDispatch, useSelector } from 'react-redux';
import { setName } from '../../../store/activateSlice';

const StepName = ({ onNext }) => {
    const dispatch = useDispatch();
    const { name } = useSelector(state => state.activateSlice);
    const [fullName, setFullName] = useState(name);

    function nextStep () {
        if(!fullName){
            return;
        }
        dispatch(setName(fullName));
        onNext();
    }
    return (
        <>
            <Card
                title="What's your full name ?"
                icon="goggle-emoji"
            >
                <TextInput
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
                <p className={styles.paragraph}>
                    People use real names at Talk House :)!
                </p>
                <div>
                    <Button text="Next" onClick={nextStep} />
                </div>
            </Card>
        </>
    );
}

export default StepName;