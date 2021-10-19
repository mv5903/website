import styles from './Title.module.css';
import TypeIt from 'typeit-react';

function Title() {
    return (
        <div className={styles.titleContainer}>
            <TypeIt
            options={{
                strings: ['Matthew Vandenberg', 'Aspiring Software Engineer'],
                cursorChar: '_',
                speed: 60,
                html: true
            }}/>
        </div> 
    );
}

export default Title;