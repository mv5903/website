import styles from "./Logo.module.css";
import logo from "../assets/logo.png";

function Logo() {
    return (
        <div>
            <img className={styles.logo} src={logo} alt="Logo" />
        </div>
    );
}

export default Logo;
