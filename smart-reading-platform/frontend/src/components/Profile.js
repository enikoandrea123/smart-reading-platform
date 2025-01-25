import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('❌ You must be logged in to view your profile.');
      return;
    }

    const fetchProfile = async () => {

      try {
        const response = await fetch('http://127.0.0.1:5000/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          setError('');
        } else {
          setError(data.message || '❌ Unable to fetch profile.');
        }
      } catch (err) {
        setError('❌ Server error. Please try again later.');
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-container">
        {error && <p className="error-message">{error}</p>}
        {user ? (
          <div>
            <h2>Welcome back, {user.name}! 🎉</h2>
            <p>Your email: {user.email} 📧</p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;