import styles from "./Card.module.css";
import ListItem from "./ListItem";

function Card(props) {
    const children = props.children;
    return (
        <div id={props.title} className={styles.cardbackground}>
            <h3>{props.title}</h3>
            <ul>
                {children.map((item) => {
                    return <ListItem text={item} />
                })}
            </ul>
        </div>
    );
}

export default Card;
