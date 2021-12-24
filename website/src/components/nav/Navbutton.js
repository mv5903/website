import styles from './Navbar.module.css';

function Navbutton(props) {
    //Privacy policies will link to another part of site
    let link = (props.title == "Privacy Policy") || (props.title == "Résumé") ? '' + props.link : '#' + props.link;
    return(
        <div className={styles.navbutton}>
            <a target={(props.title == "Privacy Policy") || (props.title == "Résumé") ? "_blank" : ""} className={styles.navlink} href={link}><p>{props.title}</p></a>
        </div>
    );
}

export default Navbutton;