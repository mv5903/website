import styles from './Navbar.module.css';

function Navbutton(props) {
    let link = '#' + props.link;
    return(
        <div className={styles.navbutton}>
            <a className={styles.navlink} href={link}><p>{props.title}</p></a>
        </div>
    );
}

export default Navbutton;