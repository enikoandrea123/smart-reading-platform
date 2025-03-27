import React from "react";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact-container">
      <h1 className="contact-title">📩 Contact Us</h1>
      <p className="contact-description">
        Have any questions or need assistance? We'd love to hear from you! Feel free to reach out to us via email, and
        we'll get back to you as soon as possible.
      </p>

      <div className="contact-info">
        <h2>📬 Get in Touch</h2>
        <p className="contact-email">
          📧 <a href="mailto:shelfmate.assistant@gmail.com">shelfmate.assistant@gmail.com</a>
        </p>
      </div>

      <p className="contact-footer">
        *ShelfMate is dedicated to providing the best book recommendations and reading experience. Reach out to us for any inquiries!*
      </p>
    </div>
  );
}

export default Contact;