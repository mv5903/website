import Card from './Card';

function CardDisplay(props) {
    const data = props.data;
    return(
        <div className="cardDisplay">
            {
                data.map((item) => {
                    return <Card key={item.id} title={item.title} children={item.cards} />
                })
            }
        </div>
    );
}

export default CardDisplay;