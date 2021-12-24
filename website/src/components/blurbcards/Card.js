import styles from "./Card.module.css";
import ListItem from "./ListItem";
import { v4 as uuidv4 } from 'uuid';

function Card(props) {
    const children = props.children;
    return (
        <div id={props.title} className={styles.cardbackground}>
            <h3>{props.title}</h3>
            <ul>
                {children.map(item => {
                    return <ListItem text={item} key={uuidv4()} />
                })}
            </ul>
        </div>
    );
} 

export default Card;
