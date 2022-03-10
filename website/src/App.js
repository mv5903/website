import Navbar from "./components/nav/Navbar";
import Title from "./components/text/Title";
import styles from "./App.css";
import Contact from "./components/contactbar/Contact";
import DownArrow from "./components/animations/DownArrow";
import Content from "./components/carousel/Content";
import CardDisplay from "./components/blurbcards/CardDisplay";
import { cardData } from "./components/assets/websiteContent";

import { MobileView, BrowserView } from 'react-device-detect';
import Spring from "./components/animations/spring/Spring";

export default function App() {
    return (
        <div className={styles.null}>
            <Spring />
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