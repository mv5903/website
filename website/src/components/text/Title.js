import styles from './Title.module.css';
import TypeIt from 'typeit-react';

function Title() {
    return (
        <div className={styles.titleContainer}>
            <TypeIt
            options={{
                strings: ['Matthew Vandenberg', ' ', 'Math & CS at UC San Diego'],
                cursorChar: '_',
                speed: 60,
                html: true,
            }}/>
        </div> 
    );
}

export default Title;