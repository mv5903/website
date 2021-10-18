import Navbutton from "./Navbutton";
import Logo from "./Logo";

import styles from "./Navbar.module.css";

function Navbar() {
    return (
        <nav className={styles.nav}>
            <Logo />
            <div className={styles.flexright}>
                <Navbutton title="About" />
                <Navbutton title="Projects" />
                <Navbutton title="Contact" />
            </div>
        </nav>
    );
}

export default Navbar;
