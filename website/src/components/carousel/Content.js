import Carousel from './Carousel'
import { cardData } from '../assets/websiteContent'

export default function Content() {
    return (
        <div className="cardDisplay">
            {
                cardData.map(section => {
                    return (
                    <div key={section.id} className="carousel">
                        <h3 id={section.title}>{section.title}</h3>
                        <Carousel id={section.id}/>
                    </div>
                    )
                })
            }
        </div>
    )
}