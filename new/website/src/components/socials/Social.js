import styles from "./Social.module.css"
import { SOCIALS } from "./SocialJson"
import { isMobile } from 'react-device-detect'

export default function Social({blue}) {
    return (
        <div className={`${styles.social} ${blue ? styles.blue : styles.yellow} ${isMobile ? styles.mobile : ''}`}>
            {SOCIALS.map((social, index) => {
                return <a key={index} href={social.url} target="_blank" rel="noreferrer"><i className={`${social.icon}`}></i></a>
            })}
        </div>   
    )
}