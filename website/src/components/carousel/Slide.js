import styles from './carouselstyles.module.css'

export default function Slide(props) {
    let [subtitle, content, website, id] = [
        props.heading,
        props.content,
        props.website,
        props.id
    ]

    return (
        <div key={id} className={styles.slide}>
            <h5>{subtitle}</h5>
            <p>{content}</p>
            { website !== '' ? <a href={website} target="_blank" rel="noopener noreferrer">Learn More</a> : <></> }
        </div>
    )
}