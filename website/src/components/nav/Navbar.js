import Navbutton from "./Navbutton";
import Logo from "./Logo";

import styles from "./Navbar.module.css";

function Navbar() {
    return (
        <nav className={styles.nav}>
            <Logo />
            <div className={styles.flexright}>
                <Navbutton title="About" link="About Me"/>
                <Navbutton title="Portfolio" link="Portfolio"/>
                <Navbutton title="Knowledge" link="Knowledge"/>
                <Navbutton title="Contact" link="Contact"/>
                <Navbutton title="Resumé" link="https://www.mattvandenberg.com/resume.pdf"/>
                <Navbutton title="Privacy Policy" link="https://www.mattvandenberg.com/privacypolicy/reallysimple.html"/>
            </div>
        </nav>
    );
}

export default Navbar;
