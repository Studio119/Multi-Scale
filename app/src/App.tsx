import React from 'react';
import './App.css';
import { Map } from "./Compo/Map";

function App() {
  return (
    <div className="App">
      <Map id="map0" width={ 800 } height={ 600 } />
    </div>
  );
}

export default App;
