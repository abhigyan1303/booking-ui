// LeftDrawer.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { config } from '../config/config';
import '../scss/LeftDrawer.scss';

interface LeftDrawerProps {
  sideNavActive: string;
  setSideNavActive: (item: string) => void;
  userRoles: string[];
}

const LeftDrawer: React.FC<LeftDrawerProps> = ({ sideNavActive, setSideNavActive, userRoles }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = config.leftDrawer.menuItems.filter(item =>
    item.role ? item.role.some(role => userRoles.includes(role)) : true
  );

  return (
    <div className={`left-drawer ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-button" onClick={toggleDrawer}>
        <i className={`fas ${isOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
      </button>
      <nav className="drawer-content">
        <div className="drawer-header">
          <h2 className="text-xl font-bold">{config.leftDrawer.headerText}</h2>
          <p>{config.leftDrawer.descriptionText}</p>
        </div>
        <ul className="mt-4">
          {menuItems.map(item => (
            <li key={item.label} className={sideNavActive === item.label ? 'active' : ''}>
              <Link to={item.path} onClick={() => setSideNavActive(item.label)} className="menu-item">
          {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default LeftDrawer;