import React, { useEffect, useState } from 'react';
import { Router, Route, Redirect } from 'wouter';
import HomePage from './components/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import SignIn from './components/SignIn';
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
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Statistics from "./components/Statistics";
import ErrorPage from './components/ErrorPage';
import Help from './components/Help';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('is_admin');
    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(userRole === 'true');
    }
  }, []);

  const ProtectedRoute = ({ component: Component }) => {
    if (!isAuthenticated) {
      setErrorMessage('You must be logged in to access this page.');
      return <Redirect to="/error" />;
    }
    return <Component />;
  };

  const AdminRoute = ({ component: Component }) => {
    if (!isAdmin) {
      setErrorMessage('You do not have permission to view this page.');
      return <Redirect to="/error" />;
    }
    return <Component />;
  };

  return (
    <Router>
      <Header />
      <Route path="/" component={() => <HomePage showCarousel={isAuthenticated} />} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={Terms} />
      <Route path="/about" component={About} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/contact" component={Contact} />
      <Route path="/help" component={Help}/>

      <Route path="/explore" component={() => <ProtectedRoute component={Explore} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
      <Route path="/book/:bookId" component={() => <ProtectedRoute component={BookDetail} />} />
      <Route path="/favorites" component={() => <ProtectedRoute component={Favorites} />} />
      <Route path="/track" component={() => <ProtectedRoute component={Track} />} />
      <Route path="/recommendations" component={() => <ProtectedRoute component={Recommendations} />} />

      <Route path="/manageusers" component={() => <AdminRoute component={ManageUsers} />} />
      <Route path="/statistics" component={() => <AdminRoute component={Statistics} />} />

      <Route path="/error" component={() => <ErrorPage message={errorMessage} />} />

      <Footer />
    </Router>
  );
}

export default App;