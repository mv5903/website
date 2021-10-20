import Navbar from "./components/nav/Navbar";
import Title from "./components/text/Title";
import CardDisplay from "./components/CardDisplay";
import styles from "./App.css";
import { cardData } from "./components/assets/websiteContent.js";

function App() {
    return (
        <div className={styles.null}>
            <Navbar />
            <Title />
            <CardDisplay data={cardData} />;
        </div>
    );
}

export default App;
