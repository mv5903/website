import styles from './Navbar.module.css';

function Navbutton(props) {
    return(
        <div className={styles.navbutton}>
            <p>{props.title}</p>
        </div>
    );
}

export default Navbutton;