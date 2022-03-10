import styles from './Spring.module.css'
import sun from './assets/sun.png'
import { isMobile } from 'react-device-detect'

export default function Sun() {
    return(
    <>
        <img style={{right: (isMobile ? '-5vh' : '-20vh'), top: (isMobile ? '-5vh' : '-20vh')}} id={styles.sun} src={sun} alt="sun"></img>
    </>
    )
}