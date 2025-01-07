"use client";

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppHeader from './components/Header';
import Footer from './components/Footer';
import LeftDrawer from './components/LeftDrawer';
import Login from './components/Login';
import Profile from './components/Profile';
import User from './components/User';
import ManageBuses from './components/ManageBuses';
import ManageRoutes from './components/ManageRoutes';
import ManageTrips from './components/ManageTrips';
import ManageBookings from './components/ManageBookings';
import Home from './components/Home';
import { config } from './config/config';
import './theme/theme.scss';

const App: React.FC = () => {
  const [sideNavActive, setSideNavActive] = useState(config.leftDrawer.menuItems[0].label);
  const [user, setUser] = useState<{
    isAuthenticated: boolean;
    name: string;
    email: string;
    roles: string[];
  }>({
    isAuthenticated: false,
    name: '',
    email: '',
    roles: []
  });
  const theme = 'blue-theme'; // Default theme
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = (userData: { name: string; email: string; roles: string[] }) => {
    setUser({
      isAuthenticated: true,
      ...userData
    });
    localStorage.setItem('user', JSON.stringify({
      isAuthenticated: true,
      ...userData
    }));
  };

  const handleLogout = () => {
    setUser({
      isAuthenticated: false,
      name: '',
      email: '',
      roles: []
    });
    localStorage.removeItem('user');
  };

  const hasAdminRole = user.roles.includes('superAdmin') || user.roles.includes('admin');

  return (
    <div className={`app ${theme}`}>
      {isClient ? (
        <BrowserRouter>
          <AppHeader user={user} onLogout={handleLogout} />
          <div className="main-content">
            {user.isAuthenticated && hasAdminRole && (
              <LeftDrawer
                sideNavActive={sideNavActive}
                setSideNavActive={setSideNavActive}
                userRoles={user.roles}
              />
            )}
            <main className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile user={user} />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/user" element={<User />} />
                <Route path="/buses" element={<ManageBuses />} />
                <Route path="/routes" element={<ManageRoutes />} />
                <Route path="/trip" element={<ManageTrips />} />
                <Route path="/bookings" element={<ManageBookings />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </BrowserRouter>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default App;