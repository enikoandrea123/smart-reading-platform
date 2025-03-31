import React from 'react';
import { Router, Route } from 'wouter';
import HomePage from './components/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SignIn from  './components/SignIn';
import SignUp from './components/SignUp';
import PrivacyPolicy from './components/PrivacyPolicy';
import Terms from './components/Terms';
import About from './components/About';
import ForgotPassword from './components/ForgotPassword';
import Explore from './components/Explore';
import Profile from './components/Profile';
import BookDetail from './components/BookDetail';
import Favorites from './components/Favorites';
import Track from './components/Track';
import Recommendations from './components/Recommendations';
import Contact from './components/Contact';
import ManageUsers from "./components/ManageUsers";
import Statistics from "./components/Statistics";


function App() {
  return (
    <Router>
      <Header />
      <Route path="/" component={HomePage} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={Terms} />
      <Route path="/about" component={About} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/explore" component={Explore} />
      <Route path="/profile" component={Profile} />
      <Route path="/book/:bookId" component={BookDetail} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/track" component={Track} />
      <Route path="/recommendations" component={Recommendations} />
      <Route path="/contact" component={Contact} />
      <Route path="/manageusers" component={ManageUsers} />
      <Route path="/statistics" component={Statistics} />
      <Footer />
    </Router>
  );
}

export default App;