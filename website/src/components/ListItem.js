import styles from './ListItem.module.css';

function ListItem(props) {
    return (
        <li>
            <h5>{
                props.text.hasOwnProperty('website') ? <a className={styles.titleA} target="_blank" href={props.text.website}>{props.text.subtitle}</a> : <p>{props.text.subtitle}</p>
            }</h5>
            <p>{props.text.content}</p>
        </li>
    );
}

export default ListItem;
