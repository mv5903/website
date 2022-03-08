import { cardData } from "../assets/websiteContent";
import React, { useState } from 'react'
import Slide from "./Slide";
import styles from './carouselstyles.module.css'

export default function Carousel(props) {
    const [currentImageIndex, setCount] = useState(0)

    let currentObj = cardData[props.id]['cards'][currentImageIndex]
    return(
        <div className={styles.carousel}>
            <div className={styles.leftArrow} onClick={() => {
                setCount(currentImageIndex === 0 ? cardData[props.id]['cards'].length - 1 : currentImageIndex - 1)
            }}></div>

            <Slide id={currentObj.key} heading={currentObj.subtitle} content={currentObj.content} website={currentObj.hasOwnProperty('website') ? currentObj.website : ''}/>

            <div className={styles.rightArrow} onClick={() => {
                setCount(currentImageIndex === cardData[props.id]['cards'].length - 1 ? 0 : currentImageIndex + 1)
            }}></div>
        </div>
    )
}