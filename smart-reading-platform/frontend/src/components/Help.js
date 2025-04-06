import React from 'react';
import './Help.css';

const Help = () => {
  return (
    <div className="help-container">
      <h1>Welcome to ShelfMate! 📚</h1>
      <p className="last-updated">Last Updated: April 6, 2025</p>

      <section className="help-section">
        <h2>Introduction 🎉</h2>
        <p>Welcome to ShelfMate, your personalized book recommendation and reading tracking platform! This guide will walk you through how to make the most of ShelfMate, from setting up your account to discovering new books.</p>
      </section>

      <section className="help-section">
        <h2>Getting Started 📝</h2>
        <h3>1. Creating an Account 🔑</h3>
        <p>To get started, click the "Sign Up" button on the homepage. You'll need to provide a name, an email address and  create a password. Once you're registered, you can log in anytime using your email and password.</p>

        <h3>2. Logging In 🔐</h3>
        <p>If you've already created an account, click the "Sign In" button. Enter your email and password, and you’ll be able to access your personalized dashboard and book lists.</p>
      </section>

      <section className="help-section">
        <h2>Using the Lists and Recommendations Pages📊</h2>
        <h3>1. Your Reading List 📚</h3>
        <p>You can add books by searching on the Explore page. Choose a book and then simply click the "Add to Favorite" button on the book's deatil page.</p>

        <h3>2. Your Favorite List 📚</h3>
        <p>You can add books by searching on the Explore page. Choose a book and then simply click the "Add to Reading List" button on the book's deatil page.</p>

        <h3>3. Recommendations Page 🤖</h3>
        <p>Based on the books in your reading list and favorite list, ShelfMate will suggest new books for you. These recommendations are powered by our AI algorithm, which considers your reading habits and ratings.</p>
      </section>
      </section>

      <section className="help-section">
        <h2>Interacting with Books 📖</h2>
        <h3>Writing Reviews ✍️</h3>
        <p>Once your are on a book's detail page, you can leave a review to share your thoughts. Navigate to the book page and scroll down to the Comments section. Share your thoughts, give it a thumbs up or down, and click "Submit" to post your review.</p>

      <section className="help-section">
        <h2>Managing Your Profile 👤</h2>
        <h3>1. Changing Password 🔑</h3>
        <p>To change your password, you should enter your old password, then your new password and click on "Change Password".</p>

        <h3>2. Deleting Account 🔒</h3>
        <p>To delete your account, you should enter your password and then click on "Delete Account" button. Note that this action can not be undone.</p>
      </section>

      <section className="help-section">
        <h2>Troubleshooting 🛠️</h2>
        <h3>1. I Can’t Log In! 🔑</h3>
        <p>If you're unable to log in, make sure you've entered the correct email and password. If you've forgotten your password, click the "Forgot Password?" link on the login page to reset it.</p>

      <section className="help-section">
        <h2>Contact Support 📧</h2>
        <p>If you need help, feel free to reach out to us at <a href="mailto:shelfmate.assistant@gmail.com">shelfmate.assistant@gmail.com</a> or use the chat feature available on the platform.</p>
      </section>
    </div>
  );
};

export default Help;