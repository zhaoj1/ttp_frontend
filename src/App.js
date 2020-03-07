import React from 'react';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import MainContainer from './MainContainer'

function App() {
  return (
    <div className="App">
      <Router>
        <MainContainer />
      </Router>
    </div>
  );
}

export default App;
