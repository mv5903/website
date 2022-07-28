import styles from "./Navbar.module.css"

import { isMobile } from 'react-device-detect'

export default function NavButton({name, link, blue}) {
    return (
        <div className={`${styles.navbutton} ${styles.hoverunderlineanimation} ${blue ? styles.hoverunderlineanimationblue : styles.hoverunderlineanimationyellow} ${isMobile ? styles.mobile : ''}`}>
            <a href={link} target={name === 'resume' ? "_blank" : ""} rel="noreferrer">
                {name}
            </a>
        </div>
    )
}