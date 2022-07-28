import styles from './Tile.module.css';
import { TileJSON } from './TileJson';
import Tile from './Tile';

export default function TileContainer({blue}) {
    return (
        <div className={styles.tileContainer}>
            {TileJSON.map((tile, index) => {
                return (
                    <Tile id={tile.id} key={index} heading={tile.heading} tiles={tile.tiles} blue={blue} isLeft={index % 2 === 0}/>
                )
            })}
        </div>
    )
}