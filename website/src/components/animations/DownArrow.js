import styles from './DownArrow.module.css';

function DownArrow() {
    setTimeout(() => {
        document.querySelector('#arrow').style.visibility = 'visible';
    }, 9000);
    return(
        <i id="arrow" className={styles.arrow}><i className={styles.down}></i></i>
    );
}

export default DownArrow;