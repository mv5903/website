import Navbar from "./components/nav/Navbar";
import Title from "./components/text/Title";
import styles from "./App.css";
import Contact from "./components/contactbar/Contact";
import DownArrow from "./components/animations/DownArrow";
import RainMaker from "./components/animations/RainMaker";
import Content from "./components/carousel/Content";
import CardDisplay from "./components/blurbcards/CardDisplay";
import { cardData } from "./components/assets/websiteContent";

import { isMobile, MobileView, BrowserView } from 'react-device-detect';

export default function App() {
    return (
        <div className={styles.null}>
            <RainMaker />
            <Navbar />
            <Title />
            <DownArrow />
            <BrowserView>
                <Content />
            </BrowserView>
            <MobileView>
                <CardDisplay data={cardData} />
            </MobileView>
            <Contact />
        </div>
    );
}