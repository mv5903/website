import styles from './Navbar.module.css';

function Navbutton(props) {
    //Privacy policies will link to another part of site
    let link = (props.title === "Privacy Policy") || (props.title === "Resumé") ? '' + props.link : '#' + props.link;
    return(
        <>
         <a target={(props.title === "Privacy Policy") || (props.title === "Resumé") ? "_blank" : ""} className={styles.navlink} rel="noopener noreferrer" href={link}><p>{props.title}</p></a>
        </>
    );
        
       
}

export default Navbutton;