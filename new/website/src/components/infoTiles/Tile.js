import styles from './Tile.module.css';

import { isMobile } from 'react-device-detect';

export default function Tile({blue, heading, tiles, isLeft, id}) {
    return (
        <div id={id} className={`${styles.tile} ${isLeft ? styles.left : styles.right} ${isMobile ? styles.mobile : ''}`}>
            <div className={styles.flex}>
                <h3 className={`${styles.tileHeader} ${blue ? styles.blue : styles.yellow} ${isLeft ? styles.leftHeader : styles.rightHeader}`}>{heading}</h3>
            </div>
            <div>
                {tiles.map((tile, index) => {
                    return (
                        <div className={styles.smallTile} key={index}>
                            <h4>{tile.subheading}</h4>
                            {tile.hasOwnProperty('date') ? <p style={{ margin: '0' }}><i>{tile.date}</i></p> : null}
                            <p>{tile.content}</p>
                            {tile.hasOwnProperty('tech') ? <p><b>Technologies Used:</b> {tile.tech}</p> : null}
                            {tile.hasOwnProperty('website') ? <a className={styles.infolink} target="_blank" rel="noreferrer" href={tile.website}>Learn More</a> : null}
                            {index !== tiles.length - 1 ? <hr></hr> : <div></div>}
                        </div>
                    )
                })}
            </div>    
        </div>
    )
}