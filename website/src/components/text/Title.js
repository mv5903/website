import styles from './Title.module.css';

function Title() {
    return (
        <div className={styles.titleContainer}>
            <p>Matthew Vandenberg</p>
            <p>Aspiring Software Engineer</p>
        </div> 
    );
}

export default Title;