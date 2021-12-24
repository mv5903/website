import Navbar from "./components/nav/Navbar";
import Title from "./components/text/Title";
import CardDisplay from "./components/blurbcards/CardDisplay";
import styles from "./App.css";
import Contact from "./components/contactbar/Contact";
import { cardData } from "./components/assets/websiteContent.js";
import DownArrow from "./components/animations/DownArrow";
import RainMaker from "./components/animations/RainMaker";

export default function App() {
    return (
        <div className={styles.null}>
            <RainMaker />
            <Navbar />
            <Title />
            <DownArrow />
            <CardDisplay data={cardData} />;
            <Contact />
        </div>
    );
}