// Header.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../scss/Header.scss';

interface User {
  isAuthenticated: boolean;
  name: string;
  email: string;
  roles: string[];
}

interface AppHeaderProps {
  user: User;
  onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    navigate('/profile');
    setDropdownOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/login');
    setDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('token'); // Clear the token from local storage
    onLogout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="text-lg">Booking Admin</div>
        <div className="relative">
          <button
            className="bg-secondary text-white px-4 py-2 rounded"
            onClick={toggleDropdown}
          >
            {user.isAuthenticated ? user.name : 'Menu'}
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              {user.isAuthenticated ? (
                <>
                  <button
                    onClick={handleProfileClick}
                    className="block px-4 py-2 text-left w-full"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="block px-4 py-2 text-left w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="block px-4 py-2 text-left w-full"
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;