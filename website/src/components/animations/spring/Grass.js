import styles from './Spring.module.css'
import grass from './assets/grass.png'

export default function Grass() {
    return (
        <>
            <img id={styles.grass} src={grass} alt="grass"/>
        </>
    )
}