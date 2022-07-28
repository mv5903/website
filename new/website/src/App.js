import './App.css';
import Switch from './components/misc/Switch';
import Name from './components/name/Name';
import Navbar from './components/nav/Navbar';
import Social from './components/socials/Social';

import { useState } from 'react';
import DownArrow from './components/misc/DownArrow';
import TileContainer from './components/infoTiles/TileContainer';

function App() {

  const [blue, setBlue] = useState(true);


  return (
    <div className="App">
      <Navbar blue={blue}/>
      <Name blue={blue}/>
      <Social blue={blue}/>
      <Switch blue={blue} setBlue={setBlue}/>
      <DownArrow blue={blue}/>
      <TileContainer blue={blue}/>
    </div>
  );
}

export default App;
