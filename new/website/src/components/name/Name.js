import styles from "./Name.module.css"

import { isMobile } from "react-device-detect"

export default function Name({blue}) {
    const yellowText = "Software Engineering Intern at ec² Software Solutions"
    const blueText = "CS & Math at Rutgers University"

    return (
        <div>
            <div className={`${styles.title} ${blue ? styles.outerBlue : styles.outerYellow} ${isMobile ? styles.mobile : ''}`}>
                <h1 id="matthew">Matthew</h1>
                <h1 className={`${styles.vandenberg}  ${blue ? styles.innerBlue : styles.innerYellow}`}>Vandenberg</h1>
            </div>
            <div className={`${styles.name} ${blue ? styles.nameBlue : styles.nameYellow} ${isMobile ? styles.mobileTitle : ''}`}>
                <p>{blue ? blueText : yellowText}</p>
            </div>
        </div>
    )


}