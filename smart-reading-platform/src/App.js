import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Header from './components/Header';
import Footer from './components/Footer'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <Router>
    <Header/>
    <Routes>
        <Route path="/" element={<HomePage />} />
    </Routes>
    <Footer/>
    </Router>
  );
}

export default App;
