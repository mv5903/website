import NavButtons from "./NavButtons"
import NavButton from "./NavButton"

import styles from "./Navbar.module.css"

export default function Navbar({blue}) {
    return (
        <nav className={`${styles.navbar} ${blue ? styles.blue : styles.yellow}`}>
            {NavButtons.map((button, index) => {
                return <NavButton key={index} name={button.name} link={button.link} blue={blue} rel="noreferrer"/>
            })}
        </nav>
    )
}