import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import "./ManageUsers.css";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            fetchUsers();
        } else {
            setError("You must be an admin to access this page.");
        }
    }, [token]);

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/admin/manageusers", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch users");
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError(error.message);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/admin/deleteuser/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || "Failed to delete user");
            }

            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
            setError(error.message);
        }
    };

    return (
        <div className="manage-users">
            <h2 className="users-title">Manage Users</h2>
            {error && <p className="error-message">{error}</p>}

            <div className="users-list">
                {users.map(user => (
                    <div key={user.id} className="user-card">
                        <div className="user-info">
                            <p className="user-name"><strong>{user.name}</strong></p>
                            <p className="user-email">{user.email}</p>
                            <p className="user-last-login">Last Login: {user.last_login || "N/A"}</p>
                        </div>
                        <button onClick={() => handleDelete(user.id)} className="delete-btn">
                            <FaTrash className="trash-icon" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageUsers;