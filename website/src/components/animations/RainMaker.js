import Rain from "./Rain";

export default function RainMaker() {

    const amountOfRain = 100
    let arr = []

    for (var i = 0; i < amountOfRain; i++) {
        arr.push({id: i})
    }

    return(
        <div className="snowflakes" aria-hidden="true">
            {arr.map(item => {
                return <Rain key={item.id}/>
            })}
        </div>
    );
}