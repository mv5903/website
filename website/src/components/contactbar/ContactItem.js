export default function ContactItem(props) {
    return (
        <a href={props.href} target="_blank" rel="noopener noreferrer">
            <img
                title={props.title}
                src={props.src}
            />
        </a>
        
    );
}