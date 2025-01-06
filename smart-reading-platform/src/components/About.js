import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-container">
      <h1 className="about-title">📚 About ShelfMate</h1>
      <p className="about-description">
        <strong>ShelfMate</strong> is an AI-powered platform designed to revolutionize how we discover and track books.
        Built with a passion for literature and technology, it provides personalized recommendations based on your reading
        preferences and a seamless way to monitor your reading journey. Whether you're diving into a classic or exploring
        a new genre, ShelfMate is your go-to literary companion. 🌟
      </p>

      <div className="about-section">
        <h2>✨ Why Choose ShelfMate?</h2>
        <ul className="about-list">
          <li>📖 Get personalized book recommendations powered by cutting-edge AI algorithms.</li>
          <li>📊 Easily track the books you've read, are reading, or want to read.</li>
          <li>💬 Share your thoughts and connect with like-minded readers.</li>
          <li>📈 Discover insights about your reading habits to explore new horizons.</li>
        </ul>
      </div>

      <div className="about-section">
        <h2>💡 A Note From the Founder</h2>
        <p>
          "ShelfMate started as my final thesis project, born out of a deep love for books and technology.
          As someone who has always been captivated by the power of stories, I envisioned a platform that not only
          recommends books tailored to each reader but also makes tracking your reading journey intuitive and enjoyable.
          <br />
          <br />
          Building ShelfMate has been a solo endeavor, blending my passion for programming with the art of storytelling.
          I hope this platform inspires you to read more, discover hidden gems, and connect with the magic of books.
          <br />
          <br />
          Thank you for being part of this journey. Let’s create smarter shelves, one book at a time!"
        </p>
        <p className="founder-name">- Eniko Andrea Beke, Founder</p>
      </div>

      <div className="about-section">
        <h2>🚀 Join the ShelfMate Experience</h2>
        <p>
          Dive into a world of personalized reading. Whether you're an avid reader or just starting your literary
          journey, ShelfMate is here to guide you. Let’s explore, discover, and grow together—one book at a time. 📚✨
        </p>
      </div>

      <p className="sample-text">
        *ShelfMate is an AI-powered platform built as a thesis project to innovate book discovery and tracking.*
      </p>
    </div>
  );
}

export default About;