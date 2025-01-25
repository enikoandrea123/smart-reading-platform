import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isPasswordChangeSuccess, setIsPasswordChangeSuccess] = useState(false);
  const [isAccountDeleted, setIsAccountDeleted] = useState(false);

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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const response = await fetch('http://127.0.0.1:5000/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      setIsPasswordChangeSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
    } else {
      setError(data.message || '❌ Unable to change password.');
    }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('http://127.0.0.1:5000/delete-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ current_password: deletePassword }),
    });

    const data = await response.json();

    if (response.ok) {
      setDeleteSuccess('Account deleted successfully. You will be logged out.');
      localStorage.removeItem('token');
      setUser(null);
      setDeleteError('');
      setIsModalOpen(false);
      setIsAccountDeleted(true);
    } else {
      setDeleteError(data.message || '❌ Unable to delete account.');
      setDeleteSuccess('');
    }
  };

  const handleLogoutAndRedirect = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {error && <p className="error-message">{error}</p>}
        {user && (
          <div>
            <h2>Hello, {user.name} 👋</h2>
            <p>Your email: <span className="highlight-email">{user.email} 📧</span></p>

            <h3>Change Password</h3>
            <form onSubmit={handleChangePassword}>
              <div>
                <label className="input-label">Current Password:</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="input-label">New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                />
              </div>
              <button type="submit" className="change-password-btn">Change Password</button>
            </form>

            <h3>Delete Account</h3>
            <button onClick={() => setIsModalOpen(true)} className="delete-account-btn">
              Delete Account
            </button>
            {deleteSuccess && <p className="success-message">{deleteSuccess}</p>}
            {deleteError && <p className="error-message">{deleteError}</p>}

            {isModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Confirm Account Deletion</h3>
                  <p>Please enter your current password to confirm account deletion:</p>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter your current password"
                    required
                  />
                  <div className="modal-actions">
                    <button onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
                    <button onClick={handleDeleteAccount} className="confirm-btn">Confirm Deletion</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isPasswordChangeSuccess && (
        <div className="modal">
          <div className="modal-content">
            <h3>Password Changed Successfully! 🎉</h3>
            <p>You have been logged out. Redirecting you to the sign in page...</p>
            <div className="modal-actions">
              <button onClick={() => {
                localStorage.removeItem('user');
                window.location.href = '/signin';
              }} className="confirm-btn">OK</button>
            </div>
          </div>
        </div>
      )}

      {isAccountDeleted && (
        <div className="modal">
          <div className="modal-content">
            <h3>Account Deleted Successfully!</h3>
            <p>You have been logged out. Redirecting you to the homepage...</p>
            <button onClick={handleLogoutAndRedirect} className="confirm-btn">OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;