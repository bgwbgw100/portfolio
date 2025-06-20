import React from 'react';
import './App.css';
import PacMan from './game/pacman/PacMan';
import Dnf from './portfolio/dnf/dnf';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Main from './portfolio/Main';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PacMan/>}/>
        <Route path="/main" element={<Main/>}/>
        <Route path="/dnf" element={<Dnf/>}/>
      </Routes>
    </Router>
  );
}

export default App;
