import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Header from './components/Header';

function App() {
  return (
    <Router>
    <Header/>
    <Routes>
        <Route path="/" element={<HomePage />} />
    </Routes>
    </Router>
  );
}

export default App;
