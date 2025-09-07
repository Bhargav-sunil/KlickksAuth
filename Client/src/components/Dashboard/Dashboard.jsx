import React from "react";
import "./Dashboard.css";

const Dashboard = ({ user, onLogout }) => {
  const handleLogout = async () => {
    try {
      await fetch(`https://klickksauth.onrender.com/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      onLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h2>Welcome, {user?.email}!</h2>
          <p>You have successfully logged in to your account.</p>
        </div>

        <div className="user-info">
          <div className="info-item">
            <span className="info-label">User ID:</span>
            <span className="info-value">{user?.id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user?.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Status:</span>
            <span className="status-badge">Authenticated</span>
          </div>
        </div>

        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
