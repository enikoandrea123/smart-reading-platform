import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h1 className="privacy-policy-title">Privacy Policy 🛡️</h1>
      <p className="last-updated">Last Updated: January 6, 2025</p>
      
      <div className="privacy-section">
        <h2>Information We Collect 📊</h2>
        <p>We collect your name, email, and usage data when you use ShelfMate. We also use cookies to make everything run smoothly 🍪.</p>
      </div>

      <div className="privacy-section">
        <h2>How We Use Your Info 🧠</h2>
        <p>Your info helps us improve your experience. We may send you updates or cool offers 📧. You can opt-out anytime!</p>
      </div>

      <div className="privacy-section">
        <h2>Sharing Your Info 🔒</h2>
        <p>Your info stays with us! We don't sell it, but might share it with trusted partners to improve our app or comply with laws.</p>
      </div>

      <div className="privacy-section">
        <h2>Your Privacy Choices ✨</h2>
        <p>You can update your info, change settings, or delete your account whenever you want! It's all in your account settings.</p>
      </div>

      <div className="privacy-section">
        <h2>Cookies 🍪</h2>
        <p>We use cookies to make things better for you. You can manage them through your browser settings anytime!</p>
      </div>

      <div className="privacy-section">
        <h2>Children’s Privacy 👶</h2>
        <p>ShelfMate isn't for kids under 13. If you think we’ve accidentally collected info from a child, let us know ASAP!</p>
      </div>

      <div className="privacy-section">
        <h2>Changes to This Policy 🔄</h2>
        <p>If we update our policy, we’ll post it here. Check back for any changes, and we’ll keep it simple and clear!</p>
      </div>

      <p className="sample-text">This is a sample privacy policy for ShelfMate.</p>
    </div>
  );
};

export default PrivacyPolicy;