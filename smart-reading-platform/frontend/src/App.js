import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Header from './components/Header';
import Footer from './components/Footer'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SignIn from  './components/SignIn';
import SignUp from './components/SignUp'
import PrivacyPolicy from './components/PrivacyPolicy';
import Terms from './components/Terms';
import About from './components/About';
import ForgotPassword from './components/ForgotPassword';
import Explore from './components/Explore';
import Profile from './components/Profile';
import BookDetail from './components/BookDetail';
import Favorites from './components/Favorites';
import Track from './components/Track';



function App() {
  return (
    <Router>
    <Header/>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<About />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/explore" element={<Explore/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/book/:bookId" element={<BookDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/track" element={<Track />} />
    </Routes>
    <Footer/>
    </Router>
  );
}

export default App;
