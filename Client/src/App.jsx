import React, { useState, useEffect } from "react";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://klickksauth.onrender.com/api/auth/status`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
        setUser(data.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return (
      <div className="app">
        <div className="app-background">
          <div className="app-content">
            <Dashboard user={user} onLogout={handleLogout} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-background">
        <div className="app-content">
          {currentView === "login" ? (
            <Login
              setCurrentView={setCurrentView}
              onLoginSuccess={handleLoginSuccess}
            />
          ) : (
            <Register setCurrentView={setCurrentView} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
