import Rain from "./Rain";
import { isMobile } from 'react-device-detect'

export default function RainMaker() {


    const amountOfRain = isMobile ? 10 : 100
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