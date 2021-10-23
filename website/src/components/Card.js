import styles from "./Card.module.css";
import ListItem from "./ListItem";
import { v4 as uuidv4 } from 'uuid';

function Card(props) {
    function getRandomUUID() {
        let generatedUUID = uuidv4();
        console.log(generatedUUID);
        return generatedUUID;
    }

    const children = props.children;
    return (
        <div id={props.title} className={styles.cardbackground}>
            <h3>{props.title}</h3>
            <ul>
                {children.map((item) => {
                    return <ListItem text={item} key={getRandomUUID()} />
                })}
            </ul>
        </div>
    );
}

export default Card;
