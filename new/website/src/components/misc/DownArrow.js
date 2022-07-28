import styles from './DownArrow.module.css'

export default function DownArrow({blue}) {
    return (
        <div className={`${styles.downarrow} ${blue ? styles.downarrowBlue : styles.downarrowYellow}`}></div>
    )
}