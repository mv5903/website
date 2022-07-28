import styles from "./Switch.module.css"

export default function Switch({blue, setBlue}) {

    function setIsBlue() {
        setBlue(!blue);
    }

    return (
        <div className={styles.switch}>
            <p>Toggle Me :)</p>
            <input type="checkbox" id="toggle" onClick={setIsBlue}/>
            <label htmlFor="toggle"></label>
        </div>
    )
}